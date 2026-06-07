import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

export default function Countdown({ targetDate, onExpire, isDark = true, className = '' }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (Object.keys(remaining).length === 0) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (num) => String(num).padStart(2, '0');

  if (Object.keys(timeLeft).length === 0) {
    return (
      <View 
        className={`border px-3 py-1.5 rounded-lg ${className}`}
        style={{
          backgroundColor: isDark ? 'rgba(244, 63, 94, 0.08)' : 'rgba(244, 63, 94, 0.06)',
          borderColor: isDark ? 'rgba(244, 63, 94, 0.35)' : 'rgba(244, 63, 94, 0.25)',
        }}
      >
        <Text className="text-rose-500 dark:text-rose-400 font-extrabold text-xs text-center uppercase tracking-wider">LIVE / IN PROGRESS</Text>
      </View>
    );
  }

  return (
    <View 
      className={`flex-row items-center justify-center border px-4 py-2 rounded-xl ${className}`}
      style={{
        backgroundColor: isDark ? 'rgba(10, 14, 26, 0.75)' : 'rgba(241, 245, 249, 0.9)',
        borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.15 : 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="items-center px-1.5">
        <Text className={`font-extrabold text-lg leading-none tracking-tight ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>{pad(timeLeft.days)}</Text>
        <Text className={`text-[8px] uppercase font-bold tracking-widest mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>d</Text>
      </View>
      <Text className={`font-bold text-base pb-1 px-0.5 ${isDark ? 'text-violet-400/40' : 'text-violet-500/40'}`}>:</Text>
      <View className="items-center px-1.5">
        <Text className={`font-extrabold text-lg leading-none tracking-tight ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>{pad(timeLeft.hours)}</Text>
        <Text className={`text-[8px] uppercase font-bold tracking-widest mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>h</Text>
      </View>
      <Text className={`font-bold text-base pb-1 px-0.5 ${isDark ? 'text-violet-400/40' : 'text-violet-500/40'}`}>:</Text>
      <View className="items-center px-1.5">
        <Text className={`font-extrabold text-lg leading-none tracking-tight ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>{pad(timeLeft.minutes)}</Text>
        <Text className={`text-[8px] uppercase font-bold tracking-widest mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>m</Text>
      </View>
      <Text className={`font-bold text-base pb-1 px-0.5 ${isDark ? 'text-violet-400/40' : 'text-violet-500/40'}`}>:</Text>
      <View className="items-center px-1.5">
        <Text className={`font-extrabold text-lg leading-none tracking-tight ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} style={{
          textShadowColor: isDark ? 'rgba(0, 229, 255, 0.4)' : 'rgba(0, 180, 216, 0.3)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 6,
        }}>{pad(timeLeft.seconds)}</Text>
        <Text className={`text-[8px] uppercase font-bold tracking-widest mt-1 ${isDark ? 'text-cyan-400/70' : 'text-cyan-600/70'}`}>s</Text>
      </View>
    </View>
  );
}
