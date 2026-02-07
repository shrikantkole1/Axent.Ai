
import React, { useState, useCallback, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import {
  BookOpen, CheckCircle2, Clock, Brain, Loader2, ChevronRight, Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { generateContent } from '../services/geminiService';
import { generatePDFReport } from '../services/pdfService';

export const Dashboard: React.FC = () => {
  const { subjects, topics, user, sendToChat } = useApp();
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);

  const completedTopics = topics.filter(t => t.status === 'Completed').length;
  const totalTopics = topics.length;
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const activeSubjectsCount = subjects.length;

  const averageWeakness = totalTopics > 0
    ? topics.reduce((acc, t) => acc + t.weaknessScore, 0) / totalTopics
    : 5;
  const overallScore = Math.round((10 - averageWeakness) * 10);
  const weeklyHours = user ? (user.dailyStudyHours * 5) + (user.studyHoursWeekend || 0) * 2 : 0;

  const generateAISummary = useCallback(async () => {
    if (!user) return;

    setLoadingAI(true);
    try {
      console.log('Generating AI Insight for:', user.name);
      const prompt = `Provide a brief, encouraging 2-sentence study insight for ${user.name} (${user.branch || 'Engineering Student'}). 
      Stats: ${progressPercent}% syllabus complete, ${overallScore}/100 readiness score. 
      Focus on actionable next steps or motivation. Be warm and specific.`;

      const summary = await generateContent(prompt);
      if (!summary || summary.includes('unavailable')) throw new Error('AI Service Unavailable');
      setAiSummary(summary);
    } catch (error) {
      console.error('AI Insight Generation Error:', error);
      setAiSummary(`Keep pushing forward, ${user.name}! Consistent effort is key to mastering your subjects. 🚀`);
    } finally {
      setLoadingAI(false);
    }
  }, [user, progressPercent, overallScore]);

  useEffect(() => {
    if (user && subjects.length > 0 && !aiSummary) {
      generateAISummary();
    }
  }, [user, subjects.length]);

  const handleExportReport = useCallback(() => {
    if (!user) return;
    generatePDFReport({
      user, subjects, topics, overallScore, weeklyHours,
      progressPercent, completedTopics, totalTopics, activeSubjectsCount, aiSummary
    });
  }, [user, subjects, topics, overallScore, weeklyHours, progressPercent, completedTopics, totalTopics, activeSubjectsCount, aiSummary]);

  // Calculate streak (mock for now)
  const streak = 0;
  const streakGoal = 30;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[13px] font-medium text-slate-500 mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-[34px] font-bold text-slate-900 dark:text-white tracking-tight leading-none">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
          </h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleExportReport}
          className="h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white text-[15px] font-medium rounded-full transition-colors active:scale-95"
        >
          Export Report
        </motion.button>
      </div>

      {/* Today's Focus Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-slate-900 rounded-[20px] p-8 shadow-sm border border-slate-100 dark:border-slate-800"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[22px] font-semibold text-slate-900 dark:text-white mb-1">Today's Focus</h2>
            <p className="text-[15px] text-slate-500 dark:text-slate-400">Your personalized study insight</p>
          </div>
          {loadingAI && <Loader2 size={20} className="animate-spin text-blue-500" />}
        </div>

        <AnimatePresence mode="wait">
          {loadingAI ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8"
            >
              <div className="flex items-center gap-2 text-slate-400">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-[17px] leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                {aiSummary || 'AI insights will appear here to help guide your study session.'}
              </p>
              <button
                onClick={generateAISummary}
                className="text-[15px] font-medium text-blue-500 hover:text-blue-600 transition-colors"
              >
                Refresh Insight
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress Ring + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Progress Ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[20px] p-8 shadow-sm border border-slate-100 dark:border-slate-800"
        >
          <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white mb-6">This Week</h3>

          <div className="flex items-center gap-12">
            {/* Progress Circle */}
            <div className="relative">
              <svg className="transform -rotate-90" width="140" height="140">
                {/* Background circle */}
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-slate-100 dark:text-slate-800"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="70"
                  cy="70"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  className="text-blue-500"
                  initial={{ strokeDashoffset: 377 }}
                  animate={{ strokeDashoffset: 377 - (377 * progressPercent) / 100 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    strokeDasharray: 377,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[32px] font-semibold text-slate-900 dark:text-white">{progressPercent}%</span>
                <span className="text-[13px] text-slate-500 dark:text-slate-400">Complete</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1">Topics Completed</p>
                <p className="text-[28px] font-semibold text-slate-900 dark:text-white">{completedTopics}<span className="text-slate-400 dark:text-slate-600">/{totalTopics}</span></p>
              </div>
              <div>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1">Readiness Score</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[28px] font-semibold text-slate-900 dark:text-white">{overallScore}</p>
                  <span className="text-[15px] text-slate-400 dark:text-slate-600">/ 100</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-[20px] p-8 shadow-sm text-white relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 opacity-20">
            <Flame size={80} />
          </div>
          <div className="relative z-10">
            <Flame size={32} className="mb-4" />
            <p className="text-[48px] font-bold leading-none mb-1">{streak}</p>
            <p className="text-[15px] text-orange-100 mb-6">Day Streak</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[13px] text-orange-100">
                <span>Goal: {streakGoal} days</span>
                <span>{streak}/{streakGoal}</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(streak / streakGoal) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/subjects">
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-slate-900 rounded-[16px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-shadow hover:shadow-md group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/50 transition-colors">
              <BookOpen size={20} className="text-blue-500" />
            </div>
            <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white mb-1">Subjects</h3>
            <p className="text-[15px] text-slate-500 dark:text-slate-400 mb-3">{activeSubjectsCount} active courses</p>
            <div className="flex items-center text-blue-500 text-[15px] font-medium">
              <span>Manage</span>
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </Link>

        <Link to="/roadmap">
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-slate-900 rounded-[16px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-shadow hover:shadow-md group"
          >
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center mb-4 group-hover:bg-green-100 dark:group-hover:bg-green-950/50 transition-colors">
              <CheckCircle2 size={20} className="text-green-500" />
            </div>
            <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white mb-1">Study Plan</h3>
            <p className="text-[15px] text-slate-500 dark:text-slate-400 mb-3">Next: Review topics</p>
            <div className="flex items-center text-green-500 text-[15px] font-medium">
              <span>Continue</span>
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </Link>

        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-slate-900 rounded-[16px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-shadow hover:shadow-md group cursor-pointer"
          onClick={() => sendToChat('Hello! Can you help me with my studies today?')}
        >
          <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center mb-4 group-hover:bg-purple-100 dark:group-hover:bg-purple-950/50 transition-colors">
            <Brain size={20} className="text-purple-500" />
          </div>
          <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white mb-1">AI Tutor</h3>
          <p className="text-[15px] text-slate-500 dark:text-slate-400 mb-3">Get instant help</p>
          <div className="flex items-center text-purple-500 text-[15px] font-medium">
            <span>Ask Now</span>
            <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
