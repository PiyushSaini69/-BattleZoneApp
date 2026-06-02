import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, Laptop } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const darkMode = resolvedTheme === 'dark';

  return (
    <div className={`flex border rounded-lg p-0.5 items-center select-none font-display ${
      darkMode 
        ? 'bg-black/20 border-white/5' 
        : 'bg-slate-100 border-slate-200'
    }`}>
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-md transition duration-200 ${
          theme === 'light'
            ? 'bg-[#7C3AED] text-white shadow-md'
            : darkMode ? 'text-white/40 hover:text-white/80' : 'text-slate-400 hover:text-slate-700'
        }`}
        title="Light Mode"
      >
        <Sun size={14} />
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-md transition duration-200 ${
          theme === 'dark'
            ? 'bg-[#7C3AED] text-white shadow-md'
            : darkMode ? 'text-white/40 hover:text-white/80' : 'text-slate-400 hover:text-slate-700'
        }`}
        title="Dark Mode"
      >
        <Moon size={14} />
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-md transition duration-200 ${
          theme === 'system'
            ? 'bg-[#7C3AED] text-white shadow-md'
            : darkMode ? 'text-white/40 hover:text-white/80' : 'text-slate-400 hover:text-slate-700'
        }`}
        title="System Preference"
      >
        <Laptop size={14} />
      </button>
    </div>
  );
};

export default ThemeToggle;
