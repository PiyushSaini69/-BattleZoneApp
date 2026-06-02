import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const CountdownTimer = ({ targetDate, onComplete }) => {
  const { theme, resolvedTheme } = useContext(ThemeContext);
  const darkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { expired: true };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTime = calculateTimeLeft();
      setTimeLeft(updatedTime);

      if (updatedTime.expired) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <span className="text-red-500 font-display font-semibold tracking-wider uppercase animate-pulse">
        🔴 LIVE / STARTED
      </span>
    );
  }

  const formatNum = (num) => String(num).padStart(2, '0');

  return (
    <div className="flex gap-2 text-center font-display">
      {timeLeft.days > 0 && (
        <div className={`flex flex-col border rounded-md px-2 py-1 min-w-[36px] ${
          darkMode ? 'bg-black/40 border-white/5' : 'bg-slate-100 border-slate-200'
        }`}>
          <span className="text-brand-cyan text-sm font-semibold">{timeLeft.days}</span>
          <span className={`text-[10px] uppercase ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>d</span>
        </div>
      )}
      <div className={`flex flex-col border rounded-md px-2 py-1 min-w-[36px] ${
        darkMode ? 'bg-black/40 border-white/5' : 'bg-slate-100 border-slate-200'
      }`}>
        <span className="text-brand-purple text-sm font-semibold">{formatNum(timeLeft.hours)}</span>
        <span className={`text-[10px] uppercase ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>h</span>
      </div>
      <div className={`flex flex-col border rounded-md px-2 py-1 min-w-[36px] ${
        darkMode ? 'bg-black/40 border-white/5' : 'bg-slate-100 border-slate-200'
      }`}>
        <span className="text-brand-purple text-sm font-semibold">{formatNum(timeLeft.minutes)}</span>
        <span className={`text-[10px] uppercase ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>m</span>
      </div>
      <div className={`flex flex-col border rounded-md px-2 py-1 min-w-[36px] ${
        darkMode ? 'bg-black/40 border-white/5' : 'bg-slate-100 border-slate-200'
      }`}>
        <span className="text-brand-orange text-sm font-semibold">{formatNum(timeLeft.seconds)}</span>
        <span className={`text-[10px] uppercase ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>s</span>
      </div>
    </div>
  );
};


export default CountdownTimer;
