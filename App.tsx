
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { Layout } from './components/Layout';
import { DarkModeToggle } from './components/DarkModeToggle';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Subjects } from './pages/Subjects';
import { Roadmap } from './pages/Roadmap';

import { Profile } from './pages/Profile';
import { Info } from './pages/Info';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useApp();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;
  if (!user) return <Navigate to="/setup" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => (
  <>
    <DarkModeToggle />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/setup" element={<Auth />} />
      <Route path="/login" element={<Navigate to="/setup" replace />} />
      <Route path="/register" element={<Navigate to="/setup" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><Layout><Roadmap /></Layout></ProtectedRoute>} />

      <Route path="/subjects" element={<ProtectedRoute><Layout><Subjects /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      <Route path="/info/privacy" element={<Info page="privacy" />} />
      <Route path="/info/terms" element={<Info page="terms" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

const App: React.FC = () => (
  <AppProvider>
    <Router><AppRoutes /></Router>
  </AppProvider>
);
export default App;
