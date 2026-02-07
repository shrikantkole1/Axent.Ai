
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, User, Subject, Topic, DiaryEntry, Activity, AttendanceRecord } from '../types';
import { auth, db, onAuthStateChanged, signOut, doc, getDoc, setDoc } from '../services/firebase';

interface AppContextType extends AppState {
  pendingChatMessage: string | null;
  loading: boolean;
  isDarkMode: boolean;
  setUser: (user: User | null) => void;
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addTopic: (topic: Topic) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;

  addDiaryEntry: (entry: DiaryEntry) => void;
  addActivity: (activity: Activity) => void;
  addAttendance: (record: AttendanceRecord) => void;
  sendToChat: (message: string | null) => void;
  setSubjectsAndTopics: (subjects: Subject[], topics: Topic[]) => void;
  toggleDarkMode: () => void;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'axent_ai_data_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local data", e);
      }
    }
    return {
      user: null,
      subjects: [],
      topics: [],

      diaryEntries: [],
      activities: [],
      attendance: []
    };
  });

  const [loading, setLoading] = useState(true);
  const [pendingChatMessage, setPendingChatMessage] = useState<string | null>(null);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('axent_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // CRITICAL: Always sync to localStorage first
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    // If we have a user, also save it separately for the mock auth check
    if (state.user) {
      localStorage.setItem('axent_local_user', JSON.stringify({ uid: state.user.id, displayName: state.user.name, email: state.user.email }));
    }
  }, [state]);

  // Opportunistic Cloud Sync
  useEffect(() => {
    if (state.user && state.user.id && db) {
      const syncData = async () => {
        try {
          const userDoc = doc(db, 'users', state.user!.id);
          await setDoc(userDoc, state, { merge: true });
        } catch (e) {
          // Silent fail - local storage is our primary source
        }
      };
      syncData();
    }
  }, [state]);

  // Combined Auth & Local Session Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        // We have a user! Try to get cloud data if DB exists, otherwise stick with current state
        if (db) {
          try {
            const userDoc = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userDoc);
            if (docSnap.exists()) {
              setState(docSnap.data() as AppState);
            }
          } catch (e) {
            console.warn("Could not sync cloud data, staying local.");
          }
        }
      } else {
        // No user, but keep local state if it exists until explicit logout
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Dark Mode Effect
  useEffect(() => {
    localStorage.setItem('axent_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };


  const setUser = (user: User | null) => setState(prev => ({ ...prev, user }));
  const addSubject = (s: Subject) => setState(prev => ({ ...prev, subjects: [...prev.subjects, s] }));
  const updateSubject = (id: string, up: Partial<Subject>) => setState(prev => ({ ...prev, subjects: prev.subjects.map(s => s.id === id ? { ...s, ...up } : s) }));
  const deleteSubject = (id: string) => setState(prev => ({ ...prev, subjects: prev.subjects.filter(s => s.id !== id) }));
  const addTopic = (t: Topic) => setState(prev => ({ ...prev, topics: [...prev.topics, t] }));
  const updateTopic = (id: string, up: Partial<Topic>) => setState(prev => ({ ...prev, topics: prev.topics.map(t => t.id === id ? { ...t, ...up } : t) }));
  const deleteTopic = (id: string) => setState(prev => ({ ...prev, topics: prev.topics.filter(t => t.id !== id) }));

  const addDiaryEntry = (e: DiaryEntry) => setState(prev => ({ ...prev, diaryEntries: [e, ...prev.diaryEntries] }));
  const addActivity = (a: Activity) => setState(prev => ({ ...prev, activities: [a, ...prev.activities] }));
  const addAttendance = (r: AttendanceRecord) => setState(prev => ({ ...prev, attendance: [r, ...prev.attendance] }));
  const sendToChat = (msg: string | null) => setPendingChatMessage(msg);
  const setSubjectsAndTopics = (s: Subject[], t: Topic[]) => setState(prev => ({ ...prev, subjects: s, topics: t }));

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) { }
    localStorage.removeItem('axent_local_user');
    setState({ user: null, subjects: [], topics: [], diaryEntries: [], activities: [], attendance: [] });
  };

  return (
    <AppContext.Provider value={{
      ...state,
      pendingChatMessage,
      loading,
      isDarkMode,
      setUser,
      addSubject,
      updateSubject,
      deleteSubject,
      addTopic,
      updateTopic,
      deleteTopic,

      addDiaryEntry,
      addActivity,
      addAttendance,
      sendToChat,
      setSubjectsAndTopics,
      toggleDarkMode,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
