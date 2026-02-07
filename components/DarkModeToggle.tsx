
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const DarkModeToggle: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useApp();

    return (
        <motion.button
            onClick={toggleDarkMode}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-2xl bg-slate-900 dark:bg-white border-2 border-slate-800 dark:border-slate-200 shadow-2xl flex items-center justify-center transition-all overflow-hidden group"
            aria-label="Toggle dark mode"
        >
            <AnimatePresence mode="wait">
                {isDarkMode ? (
                    <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-slate-900"
                    >
                        <Sun size={24} className="fill-yellow-400 text-yellow-400" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-white"
                    >
                        <Moon size={24} className="fill-indigo-400 text-indigo-400" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};
