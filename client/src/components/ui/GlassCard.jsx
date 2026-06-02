import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const GlassCard = ({ children, className = '', hoverEffect = false, glowColor = '' }) => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  const glowStyles = {
    purple: 'shadow-neon-purple border-purple-500/20',
    cyan: 'shadow-neon-cyan border-cyan-500/20',
    orange: 'shadow-neon-orange border-orange-500/20',
  };

  const selectedGlow = glowColor ? (glowStyles[glowColor] || '') : '';

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 border ${
        darkMode 
          ? 'bg-white/5 border-white/5' 
          : 'bg-white border-slate-200'
      } ${
        hoverEffect 
          ? (darkMode ? 'hover:bg-white/10 hover:border-white/10 hover:shadow-neon-purple/20' : 'hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg') 
          : ''
      } ${selectedGlow} ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;

