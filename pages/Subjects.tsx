
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Plus, Search, MoreVertical, Edit2, Trash2, Calendar as CalendarIcon, AlertCircle, BookOpen, Clock, Timer } from 'lucide-react';
import { Subject, Difficulty } from '../types';
import { ENGINEERING_SYLLABUS, getSubjectsForBranchYear } from '../data/syllabus';

export const Subjects: React.FC = () => {
  const { subjects, addSubject, deleteSubject, updateSubject } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Subject>>({
    title: '',
    difficulty: 'Intermediate',
    examDate: '',
    priority: 3,
    color: '#6366f1',
    credits: 3,
    confidenceLevel: 3
  });

  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | ''>('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const branches = ENGINEERING_SYLLABUS.map(b => b.branch);
  const subjectsForSelection = selectedBranch && selectedYear
    ? getSubjectsForBranchYear(selectedBranch, selectedYear as number)
    : [];
  const isCustomSubject = selectedSubject === '__custom__';

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      difficulty: 'Intermediate',
      examDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 3 months out
      priority: 3,
      color: '#6366f1',
      credits: 3,
      confidenceLevel: 3
    });
    setSelectedBranch('');
    setSelectedYear('');
    setSelectedSubject('');
    setIsModalOpen(true);
  };

  const openEditModal = (subject: Subject) => {
    setEditingId(subject.id);
    setFormData({
      title: subject.title,
      difficulty: subject.difficulty,
      examDate: subject.examDate,
      priority: subject.priority,
      color: subject.color,
      credits: subject.credits || 3,
      confidenceLevel: subject.confidenceLevel || 3
    });
    setIsModalOpen(true);
  };

  const getTitleForSave = (): string => {
    if (editingId) return formData.title || '';
    if (selectedSubject === '__custom__') return formData.title || '';
    return selectedSubject;
  };

  const handleSave = () => {
    const title = getTitleForSave();
    if (!title || !formData.examDate) return;

    // For add mode, require branch/year when using syllabus (not custom)
    if (!editingId && selectedSubject !== '__custom__' && (!selectedBranch || !selectedYear)) return;

    if (editingId) {
      updateSubject(editingId, { ...formData, title });
    } else {
      addSubject({
        ...formData,
        title,
        id: Math.random().toString(36).substr(2, 9),
        userId: 'user-1',
      } as Subject);
    }
    setIsModalOpen(false);
  };

  const getDaysRemaining = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const colors = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
  const filteredSubjects = subjects.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Subjects & Exams</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your curriculum and track exam deadlines.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm text-slate-900 dark:text-white"
            />
          </div>
          <button
            onClick={openAddModal}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/50"
          >
            <Plus size={18} /> Add Subject
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSubjects.map((s) => {
          const daysLeft = getDaysRemaining(s.examDate);
          const isUrgent = daysLeft < 7;
          const isWarning = daysLeft < 30;

          return (
            <div key={s.id} className="bg-white dark:bg-slate-800 rounded-[24px] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-indigo-50 dark:hover:shadow-indigo-900/20 transition-all group">
              <div className="h-3 w-full" style={{ backgroundColor: s.color }}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{s.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide ${s.difficulty === 'Advanced' ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400' :
                        s.difficulty === 'Intermediate' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' :
                          'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                        }`}>
                        {s.difficulty}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border border-slate-100 dark:border-slate-700 px-2 py-0.5 rounded-md">
                        Priority {s.priority}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded">
                        Credits: {s.credits || 3}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${(s.confidenceLevel || 3) > 3 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' :
                        (s.confidenceLevel || 3) < 3 ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400' :
                          'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
                        }`}>
                        Confidence: {s.confidenceLevel || 3}/5
                      </span>
                    </div>
                  </div>
                  <button onClick={() => openEditModal(s)} className="text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Edit2 size={18} />
                  </button>
                </div>

                <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Exam Date</span>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                      <CalendarIcon size={14} className="text-indigo-500 dark:text-indigo-400" />
                      <span>{new Date(s.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Countdown</span>
                    <div className={`flex items-center gap-2 text-sm font-black ${isUrgent ? 'text-rose-500 dark:text-rose-400' : isWarning ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                      {isUrgent ? <AlertCircle size={14} /> : <Timer size={14} />}
                      <span>{daysLeft > 0 ? `${daysLeft} Days left` : 'Exam Passed'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/roadmap"
                    className="flex-1 bg-slate-900 dark:bg-indigo-600 text-white py-2.5 rounded-xl text-center text-xs font-black uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <BookOpen size={14} /> Study Plan
                  </Link>
                  <button
                    onClick={() => deleteSubject(s.id)}
                    className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800"
                    title="Delete Subject"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSubjects.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-[32px] border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-400">
              <BookOpen size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No subjects found</h3>
            <p className="text-slate-500 font-medium mb-6">Get started by adding your first course.</p>
            <button onClick={openAddModal} className="text-indigo-600 font-bold text-sm hover:underline">Create Subject</button>
          </div>
        )}
      </div>

      {/* Unified Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Edit Subject' : 'Add New Subject'}</h2>
                <p className="text-sm text-slate-500 font-medium">{editingId ? 'Update exam details and priorities' : 'Select your branch and subject, then set your completion timeline'}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">×</button>
            </div>

            <div className="p-8 space-y-6 bg-slate-50/50">
              {editingId ? (
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Subject Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:outline-none focus:border-indigo-600 font-bold text-slate-900"
                    placeholder="e.g. Data Structures & Algorithms"
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Branch</label>
                      <select
                        value={selectedBranch}
                        onChange={e => {
                          setSelectedBranch(e.target.value);
                          setSelectedYear('');
                          setSelectedSubject('');
                        }}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:outline-none focus:border-indigo-600 font-bold text-slate-700 appearance-none"
                      >
                        <option value="">Select branch</option>
                        {branches.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Year</label>
                      <select
                        value={selectedYear}
                        onChange={e => {
                          const val = e.target.value ? parseInt(e.target.value) : '';
                          setSelectedYear(val);
                          setSelectedSubject('');
                        }}
                        disabled={!selectedBranch}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:outline-none focus:border-indigo-600 font-bold text-slate-700 appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <option value="">Select year</option>
                        <option value="1">Year 1</option>
                        <option value="2">Year 2</option>
                        <option value="3">Year 3</option>
                        <option value="4">Year 4</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={e => setSelectedSubject(e.target.value)}
                      disabled={!selectedYear}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:outline-none focus:border-indigo-600 font-bold text-slate-700 appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="">Select subject</option>
                      {subjectsForSelection.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                      {subjectsForSelection.length > 0 && (
                        <option value="__custom__">Other (Custom subject)</option>
                      )}
                    </select>
                  </div>

                  {isCustomSubject && (
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Custom Subject Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:outline-none focus:border-indigo-600 font-bold text-slate-900"
                        placeholder="e.g. Data Structures & Algorithms"
                      />
                    </div>
                  )}
                </>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={e => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:outline-none focus:border-indigo-600 font-bold text-slate-700 appearance-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Completion Timeline (Exam Date)</label>
                  <input
                    type="date"
                    value={formData.examDate}
                    onChange={e => setFormData({ ...formData, examDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:outline-none focus:border-indigo-600 font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.credits}
                    onChange={e => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:outline-none focus:border-indigo-600 font-bold text-slate-700"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Confidence (1-5)</label>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${(formData.confidenceLevel || 3) < 3 ? 'bg-red-50 text-red-600' :
                      (formData.confidenceLevel || 3) > 3 ? 'bg-emerald-50 text-emerald-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>{formData.confidenceLevel}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.confidenceLevel}
                    onChange={e => setFormData({ ...formData, confidenceLevel: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Priority Level</label>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{formData.priority}/5</span>
                </div>
                <input
                  type="range" min="1" max="5"
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1 mt-2 uppercase">
                  <span>Optional</span>
                  <span>Critical</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Color Tag</label>
                <div className="flex flex-wrap gap-3">
                  {colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-10 h-10 rounded-full border-[3px] transition-all flex items-center justify-center ${formData.color === c ? 'border-slate-900 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: c }}
                    >
                      {formData.color === c && <div className="w-2 h-2 bg-white rounded-full" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-white border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-indigo-600 text-white text-sm font-black rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all flex items-center gap-2">
                {editingId ? 'Save Changes' : 'Create Subject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
