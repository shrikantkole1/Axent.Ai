
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { User, Mail, Building2, Phone, Hash, Calendar, Sun, Moon, Clock, Save, Loader2, Shield, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Electrical & Electronics Engineering',
  'Civil Engineering',
  'Data Science & AI',
];

export const Profile: React.FC = () => {
  const { user, setUser, isDarkMode, toggleDarkMode } = useApp();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    branch: BRANCHES[0],
    phone: '',
    studentId: '',
    year: 1,
    energyPreference: 'morning' as 'morning' | 'night',
    dailyStudyHours: 4,
    studyHoursWeekend: 6
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name ?? '',
        email: user.email ?? '',
        branch: user.branch ?? BRANCHES[0],
        phone: user.phone ?? '',
        studentId: user.studentId ?? '',
        year: user.year ?? 1,
        energyPreference: user.energyPreference ?? 'morning',
        dailyStudyHours: user.dailyStudyHours ?? 4,
        studyHoursWeekend: user.studyHoursWeekend ?? (user.dailyStudyHours ? user.dailyStudyHours + 2 : 6),
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      setUser({
        ...user,
        name: formData.name.trim(),
        email: formData.email.trim(),
        branch: formData.branch,
        phone: formData.phone.trim() || undefined,
        studentId: formData.studentId.trim() || undefined,
        year: formData.year,
        energyPreference: formData.energyPreference,
        dailyStudyHours: formData.dailyStudyHours,
        studyHoursWeekend: formData.studyHoursWeekend
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500 font-medium">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">My Profile</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your personal information and study preferences.</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <User size={20} className="text-blue-600 dark:text-blue-400" /> Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white font-medium"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white font-medium"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white font-medium"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Student ID</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white font-medium"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Year</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-slate-900 dark:text-white font-medium"
                  >
                    {[1, 2, 3, 4].map(y => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Branch</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    value={formData.branch}
                    onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-slate-900 dark:text-white font-medium"
                  >
                    {BRANCHES.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button (Mobile only, or separate) */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-70"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Right Column - Preferences & Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock size={20} className="text-blue-600 dark:text-blue-400" /> Study Habits
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Peak Energy Time</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, energyPreference: 'morning' })}
                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border transition-all duration-200 ${formData.energyPreference === 'morning'
                      ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-400'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-500 hover:border-slate-300'
                    }`}
                >
                  <Sun size={24} className={formData.energyPreference === 'morning' ? 'fill-amber-400 text-amber-500' : ''} />
                  <span className="font-medium text-sm">Morning</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, energyPreference: 'night' });
                  }}
                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border transition-all duration-200 ${formData.energyPreference === 'night'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-500 hover:border-slate-300'
                    }`}
                >
                  <Moon size={24} className={formData.energyPreference === 'night' ? 'fill-indigo-500 text-indigo-500' : ''} />
                  <span className="font-medium text-sm">Night</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Weekday Goal</label>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">{formData.dailyStudyHours} hrs</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={formData.dailyStudyHours}
                  onChange={e => setFormData({ ...formData, dailyStudyHours: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Weekend Goal</label>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">{formData.studyHoursWeekend} hrs</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={14}
                  value={formData.studyHoursWeekend}
                  onChange={e => setFormData({ ...formData, studyHoursWeekend: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-70 mt-4"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && (
              <p className="text-xs font-bold text-emerald-600 text-center bg-emerald-50 dark:bg-emerald-900/20 py-2 rounded-lg">
                Settings saved successfully!
              </p>
            )}
          </div>

          {/* Account Status Card - New addition to fill space */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 p-6 rounded-[24px] shadow-sm text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Shield size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Account Status</h4>
                  <p className="text-slate-400 text-xs">Student Edition</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm border-b border-white/10 pb-2">
                  <span className="text-slate-400">Plan</span>
                  <span className="font-medium text-emerald-400">Free Tier</span>
                </div>
                <div className="flex items-center justify-between text-sm border-b border-white/10 pb-2">
                  <span className="text-slate-400">Member Since</span>
                  <span className="font-medium">Feb 2026</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Data Sync</span>
                  <span className="font-medium flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.form>
    </div>
  );
};
