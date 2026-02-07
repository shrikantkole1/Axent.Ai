
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Loader2, Zap, Settings as SettingsIcon, MessageSquare, Save, Sparkles, User as UserIcon, BookOpen, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useApp } from '../store/AppContext';
import { ChatMessage } from '../types';
import { generateSubjectRoadmap } from '../services/geminiService';

export const AIChatbot: React.FC = () => {
  const { user, subjects, topics, setUser, pendingChatMessage, sendToChat, addSubject, addTopic } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Local state for settings
  const [localPersona, setLocalPersona] = useState(user?.botPersona || 'Highly intelligent academic assistant');
  const [localKnowledge, setLocalKnowledge] = useState(user?.botKnowledgeBase || '');

  const personaPresets = [
    { name: 'Socratic Tutor', description: 'Asks questions to guide you to the answer.' },
    { name: 'Concise Expert', description: 'Gives fast, direct, and brief technical answers.' },
    { name: 'Encouraging Peer', description: 'Friendly, relatable, and explains things simply.' },
    { name: 'Strict Examiner', description: 'Focuses on rigorous accuracy and potential exam pitfalls.' },
  ];

  const knowledgeFocus = [
    'GATE/Exam Prep',
    'Placement Interview Logic',
    'Practical Lab Focus',
    'Numerical Problem Solving',
    'Conceptual Deep-Dive'
  ];

  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([
        { role: 'model', text: `Hi ${user.name.split(' ')[0]}! I'm your Axent Assistant. How can I help you with your ${user.branch} studies today? I'm specialized in your curriculum's core subjects.` }
      ]);
    }
  }, [user]);

  useEffect(() => {
    if (pendingChatMessage) {
      setIsOpen(true);
      setShowSettings(false);
      handleExternalSend(pendingChatMessage);
      sendToChat(null);
    }
  }, [pendingChatMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSaveSettings = () => {
    if (user) {
      setUser({
        ...user,
        botPersona: localPersona,
        botKnowledgeBase: localKnowledge,
      });
      setShowSettings(false);
    }
  };

  const handleExternalSend = async (msg: string) => {
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    await processAIResponse(msg);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    await processAIResponse(userMessage);
  };

  const detectPlanIntent = (msg: string): string | null => {
    const patterns = [
      /plan\s+(?:my\s+)?subject\s+(?:called\s+)?["']?([^"'\n]+)["']?/i,
      /create\s+(?:a\s+)?roadmap\s+(?:for\s+)?["']?([^"'\n]+)["']?/i,
      /(?:help\s+me\s+)?(?:learn|study)\s+["']?([^"'\n]+)["']?/i,
      /generate\s+(?:a\s+)?roadmap\s+(?:for\s+)?["']?([^"'\n]+)["']?/i,
      /roadmap\s+(?:for\s+)?["']?([^"'\n]+)["']?/i,
    ];
    for (const re of patterns) {
      const m = msg.match(re);
      if (m && m[1]) {
        const subject = m[1].trim();
        if (subject.length >= 2) return subject;
      }
    }
    return null;
  };

  const processAIResponse = async (userMessage: string) => {
    const planSubject = detectPlanIntent(userMessage);
    if (planSubject) {
      setIsLoading(true);
      try {
        const { subject, topics: newTopics } = await generateSubjectRoadmap(
          planSubject,
          user?.id || 'user-1',
          user?.branch
        );
        if (subject && newTopics.length > 0) {
          addSubject(subject);
          newTopics.forEach(t => addTopic(t));
          setMessages(prev => [...prev, {
            role: 'model',
            text: `✅ I've created a learning roadmap for **${planSubject}** with ${newTopics.length} topics. Check your Roadmap and Planner pages to see it. You can now plan your study sessions and track progress!`
          }]);
        } else {
          setMessages(prev => [...prev, {
            role: 'model',
            text: `I couldn't generate a roadmap for "${planSubject}" right now. Make sure VITE_GEMINI_API_KEY is set in .env.local and try again.`
          }]);
        }
      } catch {
        setMessages(prev => [...prev, {
          role: 'model',
          text: `Failed to generate roadmap for "${planSubject}". Please try again.`
        }]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY ?? '';
    if (!apiKey || apiKey.trim() === '') {
      setMessages(prev => [...prev, {
        role: 'model',
        text: "⚠️ Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your .env.local file (create one from .env.example) and restart the dev server. Get a key from https://aistudio.google.com/apikey"
      }]);
      return;
    }

    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const personaContext = user?.botPersona || 'Highly intelligent academic assistant';
      const knowledgeContext = user?.botKnowledgeBase ? `Specialized Knowledge Focus: ${user.botKnowledgeBase}` : '';

      const systemContext = `
        You are AxentBot, an elite engineering study companion.
        
        STRICT PERSONA GUIDELINE: ${personaContext}
        ${knowledgeContext}
        
        User Environment:
        - Student Name: ${user?.name}
        - Branch: ${user?.branch}
        - Active Subjects: ${subjects.map(s => s.title).join(', ')}
        - Current Focus: ${topics.filter(t => t.status === 'InProgress').map(t => t.title).join(', ')}
        
        Core Rules:
        1. Always provide technically rigorous answers suitable for ${user?.branch}.
        2. Use LaTeX-like formatting for mathematical expressions.
        3. If the persona is Socratic, do not give direct answers immediately; ask clarifying questions first.
        4. Integrate the "Knowledge Focus" (${user?.botKnowledgeBase}) into every response where applicable.
        5. Mention industry applications or interview relevance for technical concepts.
      `;

      const fullContent = messages
        .filter(m => m.role === 'user' || m.role === 'model')
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
        .join('\n\n') + `\n\nUser: ${userMessage}`;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: fullContent,
        config: {
          systemInstruction: systemContext,
          temperature: 0.7
        }
      });

      const textResponse = response.text || "I'm sorry, I couldn't process that technical request. Please rephrase.";
      setMessages(prev => [...prev, { role: 'model', text: textResponse }]);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      const isNetwork = /network|fetch|connection|CORS/i.test(errMsg);
      const isAuth = /401|403|API key|invalid|unauthorized/i.test(errMsg);
      let friendlyMsg = "Axent AI core is temporarily unavailable. Check connectivity.";
      if (isAuth) friendlyMsg = "Invalid or missing Gemini API key. Check your .env.local (VITE_GEMINI_API_KEY).";
      else if (isNetwork) friendlyMsg = "Network error. Check your internet connection and try again.";
      setMessages(prev => [...prev, { role: 'model', text: friendlyMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[420px] h-[650px] bg-white rounded-[32px] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.25)] border border-slate-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <BrainCircuit size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest">{showSettings ? 'Logic Configuration' : 'Axent Assistant'}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Advanced AI Engine
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 rounded-xl transition-all ${showSettings ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                >
                  {showSettings ? <MessageSquare size={18} /> : <SettingsIcon size={18} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-800 text-slate-400 rounded-xl transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {showSettings ? (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 p-8 space-y-8 overflow-y-auto custom-scrollbar bg-white"
                  >
                    {/* Persona Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <UserIcon size={14} className="text-indigo-600" />
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Bot Persona</label>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {personaPresets.map(p => (
                          <button
                            key={p.name}
                            onClick={() => setLocalPersona(p.name + ": " + p.description)}
                            className="px-3 py-2 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all text-left"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>

                      <textarea
                        value={localPersona}
                        onChange={(e) => setLocalPersona(e.target.value)}
                        placeholder="Define how the bot should behave..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:outline-none focus:border-indigo-600 text-xs h-24 resize-none font-medium text-slate-700"
                      />
                    </div>

                    {/* Knowledge Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen size={14} className="text-indigo-600" />
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Knowledge Base Focus</label>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {knowledgeFocus.map(f => (
                          <button
                            key={f}
                            onClick={() => setLocalKnowledge(prev => prev ? `${prev}, ${f}` : f)}
                            className="px-3 py-1.5 text-[9px] font-black text-indigo-600 bg-indigo-50 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-all uppercase tracking-tight"
                          >
                            + {f}
                          </button>
                        ))}
                      </div>

                      <textarea
                        value={localKnowledge}
                        onChange={(e) => setLocalKnowledge(e.target.value)}
                        placeholder="Add specific topics or goals to prioritize..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:outline-none focus:border-indigo-600 text-xs h-28 resize-none font-medium text-slate-700"
                      />
                    </div>

                    <button
                      onClick={handleSaveSettings}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl flex items-center justify-center gap-2"
                    >
                      <Save size={16} /> Update AI Logic Core
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="messages"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col"
                  >
                    <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 custom-scrollbar">
                      {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                              ? 'bg-indigo-600 text-white shadow-md rounded-tr-none'
                              : 'bg-white text-slate-700 border border-slate-200 shadow-sm rounded-tl-none'
                            }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                            <Loader2 size={16} className="animate-spin text-indigo-600" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 bg-white border-t border-slate-100">
                      <div className="relative group">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                          placeholder="Ask a technical question..."
                          className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:outline-none focus:border-indigo-600 font-bold text-sm transition-all shadow-inner"
                        />
                        <button
                          onClick={handleSend}
                          disabled={!input.trim() || isLoading}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between px-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {user?.botPersona ? user.botPersona.split(':')[0] : 'Default Mode'}
                        </span>
                        <div className="flex items-center gap-1">
                          <Sparkles size={10} className="text-indigo-400" />
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pro Intelligence</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center shadow-2xl relative group"
      >
        <div className="absolute inset-0 bg-indigo-600 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl"></div>
        {isOpen ? <X size={28} /> : <Zap size={28} fill="white" />}
      </motion.button>
    </div>
  );
};
