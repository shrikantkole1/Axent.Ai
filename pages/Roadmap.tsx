
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Plus, GripVertical, CheckCircle, Clock, Trash2, ArrowRight, Target, Sparkles, BookOpen, MessageSquare, X, Loader2 } from 'lucide-react';
import { Status, Topic, AdaptivePlan } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { getTopicDetails, generateSubjectRoadmap, generateAdaptiveStudyPlan } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const Roadmap: React.FC = () => {
  const { user, subjects, topics, addTopic, updateTopic, deleteTopic, sendToChat } = useApp();
  const [activeSubjectId, setActiveSubjectId] = useState<string>(subjects[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTopic, setNewTopic] = useState<Partial<Topic>>({
    title: '',
    estimatedHours: 2,
    weightage: 5,
    weaknessScore: 5,
    status: 'Todo'
  });

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [topicDetails, setTopicDetails] = useState<string>('');
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [smartPlan, setSmartPlan] = useState<AdaptivePlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const handleGenerateSmartPlan = () => {
    sendToChat("Create a personalized study schedule for me");
  };

  const handleGenerateRoadmap = async () => {
    if (!currentSubject) return;
    setIsGeneratingRoadmap(true);
    try {
      const { topics: newTopics } = await generateSubjectRoadmap(
        currentSubject.title,
        user?.id || 'user-1',
        user?.branch
      );
      if (newTopics.length > 0) {
        newTopics.forEach(t => {
          addTopic({
            ...t,
            id: Math.random().toString(36).substr(2, 9),
            subjectId: currentSubject.id,
          } as Topic);
        });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate roadmap. Check API key in .env.local');
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const columns: { title: string; status: Status; bg: string; accent: string }[] = [
    { title: 'Backlog', status: 'Todo', bg: 'bg-slate-50', accent: 'bg-slate-400' },
    { title: 'Active Focus', status: 'InProgress', bg: 'bg-indigo-50/40', accent: 'bg-indigo-500' },
    { title: 'Mastered', status: 'Completed', bg: 'bg-emerald-50/40', accent: 'bg-emerald-500' }
  ];

  const currentSubject = subjects.find(s => s.id === activeSubjectId);
  const filteredTopics = topics.filter(t => t.subjectId === activeSubjectId);

  const handleAddTopic = () => {
    if (!newTopic.title || !activeSubjectId) return;
    addTopic({
      ...newTopic,
      id: Math.random().toString(36).substr(2, 9),
      subjectId: activeSubjectId,
    } as Topic);
    setIsModalOpen(false);
    setNewTopic({ title: '', estimatedHours: 2, weightage: 5, weaknessScore: 5, status: 'Todo' });
  };

  const handleMove = (id: string, status: Status) => {
    updateTopic(id, { status });
  };

  const handleTopicClick = async (topic: Topic) => {
    setSelectedTopic(topic);
    setIsModalOpen(false);
    setLoadingDetails(true);
    setTopicDetails('');

    // Fetch details
    const subjectTitle = subjects.find(s => s.id === topic.subjectId)?.title || 'Engineering Subject';
    const details = await getTopicDetails(topic.title, subjectTitle);
    setTopicDetails(details);
    setLoadingDetails(false);
  };

  const startTopicChat = () => {
    if (!selectedTopic) return;
    const subjectTitle = subjects.find(s => s.id === selectedTopic.subjectId)?.title || 'this subject';
    sendToChat(`I want to study "${selectedTopic.title}" in ${subjectTitle}. Can you act as my tutor? Start by verifying my prerequisite knowledge.`);
    setSelectedTopic(null);
  };

  const handleAIHelp = (topic: Topic) => {
    const subjectTitle = currentSubject?.title || 'this subject';
    sendToChat(`I need some help understanding the topic "${topic.title}" in my ${subjectTitle} course. Can you explain the key concepts and common pitfalls?`);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Curriculum Roadmap</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Break down your engineering subjects into digestible milestones.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGenerateSmartPlan}
            disabled={subjects.length === 0}
            className="bg-emerald-600 text-white px-6 py-3.5 rounded-2xl text-sm font-black shadow-xl shadow-emerald-100 dark:shadow-emerald-900/50 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <MessageSquare size={20} />
            Ask AI for Schedule
          </button>
          {activeSubjectId && filteredTopics.length === 0 && (
            <button
              onClick={handleGenerateRoadmap}
              disabled={isGeneratingRoadmap}
              className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 dark:shadow-indigo-900/50 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGeneratingRoadmap ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              Generate Roadmap with AI
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={!activeSubjectId}
            className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-3.5 rounded-2xl text-sm font-black shadow-xl shadow-slate-100 dark:shadow-indigo-900/50 hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Plus size={20} strokeWidth={2.5} /> Create Topic
          </button>
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <div className="flex gap-3 p-2 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-[24px] overflow-x-auto no-scrollbar shadow-sm">
        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSubjectId(s.id)}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeSubjectId === s.id
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100 dark:shadow-indigo-900/50'
              : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            {s.title}
          </button>
        ))}
        {subjects.length === 0 && (
          <p className="text-xs font-bold text-slate-400 px-4 py-2 italic uppercase tracking-widest">No subjects defined yet.</p>
        )}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map(col => (
          <div key={col.status} className="flex flex-col h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-6 px-4">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${col.accent}`} />
                <h3 className="font-black text-slate-900 uppercase tracking-[0.15em] text-xs">
                  {col.title}
                </h3>
              </div>
              <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-full font-black">
                {filteredTopics.filter(t => t.status === col.status).length}
              </span>
            </div>

            <div className={`flex-1 rounded-[32px] p-5 space-y-5 border border-slate-200/40 ${col.bg} relative group/column transition-colors`}>
              <AnimatePresence>
                {filteredTopics.filter(t => t.status === col.status).map(topic => (
                  <motion.div
                    key={topic.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -4 }}
                    className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all group/card overflow-hidden relative"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h4
                        role="button"
                        tabIndex={0}
                        onClick={() => handleTopicClick(topic)}
                        onKeyDown={e => e.key === 'Enter' && handleTopicClick(topic)}
                        className="font-extrabold text-slate-900 leading-tight pr-4 cursor-pointer hover:text-indigo-600 transition-colors"
                      >
                        {topic.title}
                      </h4>
                      <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleAIHelp(topic)}
                          className="p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Ask Axent about this"
                        >
                          <Sparkles size={16} />
                        </button>
                        <button
                          onClick={() => deleteTopic(topic.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100"><Clock size={12} /> {topic.estimatedHours}H</span>
                      <span className="flex items-center gap-1.5 text-indigo-600">Weight: {topic.weightage}</span>
                    </div>

                    <div className="w-full bg-slate-100 h-1 rounded-full mb-6">
                      <div className="bg-red-400 h-full rounded-full" style={{ width: `${topic.weaknessScore * 10}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex gap-2 w-full">
                        {columns.filter(c => c.status !== col.status).map(c => (
                          <button
                            key={c.status}
                            onClick={() => handleMove(topic.id, c.status)}
                            className="flex-1 px-3 py-2 bg-slate-50 hover:bg-indigo-600 text-[9px] font-black text-slate-500 hover:text-white rounded-xl transition-all uppercase tracking-widest border border-slate-100 hover:border-indigo-600"
                          >
                            To {c.title.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredTopics.filter(t => t.status === col.status).length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center px-10">
                  <Target size={32} strokeWidth={1.5} className="mb-4 opacity-40" />
                  <p className="text-[11px] font-bold uppercase tracking-widest italic opacity-60">No elements in {col.title}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modern Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[32px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative z-10 overflow-hidden"
            >
              <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-1">Define New Topic</h2>
                  <p className="text-sm font-medium text-slate-500">Add a sub-unit to <span className="text-indigo-600 font-bold">{subjects.find(s => s.id === activeSubjectId)?.title}</span></p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 text-3xl font-light">&times;</button>
              </div>
              <div className="p-10 space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Unit Name</label>
                  <input
                    type="text"
                    autoFocus
                    value={newTopic.title}
                    onChange={e => setNewTopic({ ...newTopic, title: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-indigo-500/10 focus:outline-none focus:border-indigo-600 font-bold text-slate-900 transition-all"
                    placeholder="e.g. Signal Processing Basics"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Complexity (Hours)</label>
                    <input
                      type="number"
                      value={newTopic.estimatedHours}
                      onChange={e => setNewTopic({ ...newTopic, estimatedHours: parseFloat(e.target.value) })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[20px] focus:outline-none focus:border-indigo-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Exam Weightage</label>
                    <input
                      type="number"
                      value={newTopic.weightage}
                      onChange={e => setNewTopic({ ...newTopic, weightage: parseInt(e.target.value) })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[20px] focus:outline-none focus:border-indigo-600 font-bold"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Self-Assessment Score</label>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${newTopic.weaknessScore && newTopic.weaknessScore > 7 ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {newTopic.weaknessScore}/10 Difficulty
                    </span>
                  </div>
                  <input
                    type="range" min="1" max="10"
                    value={newTopic.weaknessScore}
                    onChange={e => setNewTopic({ ...newTopic, weaknessScore: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>
              <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-sm font-bold text-slate-500 hover:text-slate-900 rounded-2xl transition-all">Discard</button>
                <button onClick={handleAddTopic} className="px-10 py-4 bg-indigo-600 text-white text-sm font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center gap-2">
                  Commit Topic <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Topic detail modal */}
      <AnimatePresence>
        {selectedTopic && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTopic(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full max-w-lg max-h-[85vh] rounded-[32px] shadow-2xl relative z-10 overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{selectedTopic.title}</h2>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">
                    {subjects.find(s => s.id === selectedTopic.subjectId)?.title}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1 min-h-0">
                {loadingDetails ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={32} className="animate-spin text-indigo-600" />
                  </div>
                ) : (
                  <div className="prose prose-slate prose-sm max-w-none">
                    <ReactMarkdown>{topicDetails || 'No details available.'}</ReactMarkdown>
                  </div>
                )}
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
                <button
                  onClick={startTopicChat}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all"
                >
                  <Sparkles size={18} /> Start with AI
                </button>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Smart Plan Modal */}
      <AnimatePresence>
        {showPlanModal && smartPlan && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPlanModal(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full max-w-5xl h-[90vh] rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Sparkles className="text-indigo-600" /> Adaptive Study Plan
                  </h2>
                  <p className="text-sm font-bold text-slate-500 mt-1">AI-Optimized for {user?.name}</p>
                </div>
                <button onClick={() => setShowPlanModal(false)} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-slate-50/50">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-indigo-600 text-white p-6 rounded-[24px] shadow-lg shadow-indigo-200">
                    <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Timeline</p>
                    <p className="text-lg font-bold leading-snug">{smartPlan.summary.completionTimeline}</p>
                  </div>
                  <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">Confidence Goal</p>
                    <p className="text-sm font-semibold text-slate-700">{smartPlan.summary.confidenceImprovement}</p>
                  </div>
                  <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                    <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-2">Risk Reduction</p>
                    <p className="text-sm font-semibold text-slate-700">{smartPlan.summary.workloadRiskReduction}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Schedule Column */}
                  <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <Clock className="text-indigo-500" size={24} /> Recommended Schedule
                    </h3>
                    <div className="space-y-4">
                      {smartPlan.visualSchedule.map((day, idx) => (
                        <div key={idx} className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                          <h4 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">{day.day}</h4>
                          <div className="space-y-3">
                            {day.tasks.map((task, tIdx) => (
                              <div key={tIdx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                <p className="text-sm font-medium text-slate-700">{task}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar Stats */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 mb-4">Time Allocation</h3>
                      <div className="space-y-3">
                        {smartPlan.subjectBreakdown.map((s, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-[20px] border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-slate-900 text-sm">{s.subject}</span>
                              <span className="text-xs font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded">{s.hours}h ({s.percentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full mb-2">
                              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${s.percentage}%` }} />
                            </div>
                            <p className="text-[10px] text-slate-500 italic leading-relaxed">{s.reasoning}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 mb-4">Actionable Next Steps</h3>
                      <div className="bg-emerald-50 rounded-[24px] p-6 space-y-4">
                        {smartPlan.actionableSteps.map((step, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">{idx + 1}</div>
                            <p className="text-xs font-bold text-emerald-900">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 mb-4">Progress Logic</h3>
                      <div className="bg-slate-900 text-slate-300 p-6 rounded-[24px] text-xs leading-relaxed font-medium">
                        {smartPlan.progressLogic}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(smartPlan, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `adaptive-plan-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  <BookOpen size={18} /> Export JSON
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
