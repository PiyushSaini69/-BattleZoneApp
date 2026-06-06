import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

export default function Countdown({ targetDate, onExpire, className = '' }) {
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
          backgroundColor: 'rgba(244, 63, 94, 0.08)',
          borderColor: 'rgba(244, 63, 94, 0.35)',
        }}
      >
        <Text className="text-rose-400 font-extrabold text-xs text-center uppercase tracking-wider">LIVE / IN PROGRESS</Text>
      </View>
    );
  }

  return (
    <View 
      className={`flex-row items-center justify-center border px-4 py-2 rounded-xl ${className}`}
      style={{
        backgroundColor: 'rgba(10, 14, 26, 0.75)',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="items-center px-1.5">
        <Text className="text-violet-400 font-extrabold text-lg leading-none tracking-tight">{pad(timeLeft.days)}</Text>
        <Text className="text-slate-400 text-[8px] uppercase font-bold tracking-widest mt-1">d</Text>
      </View>
      <Text className="font-bold text-base pb-1 px-0.5 text-violet-400/40">:</Text>
      <View className="items-center px-1.5">
        <Text className="text-violet-400 font-extrabold text-lg leading-none tracking-tight">{pad(timeLeft.hours)}</Text>
        <Text className="text-slate-400 text-[8px] uppercase font-bold tracking-widest mt-1">h</Text>
      </View>
      <Text className="font-bold text-base pb-1 px-0.5 text-violet-400/40">:</Text>
      <View className="items-center px-1.5">
        <Text className="text-violet-400 font-extrabold text-lg leading-none tracking-tight">{pad(timeLeft.minutes)}</Text>
        <Text className="text-slate-400 text-[8px] uppercase font-bold tracking-widest mt-1">m</Text>
      </View>
      <Text className="font-bold text-base pb-1 px-0.5 text-violet-400/40">:</Text>
      <View className="items-center px-1.5">
        <Text className="text-cyan-400 font-extrabold text-lg leading-none tracking-tight" style={{
          textShadowColor: 'rgba(0, 229, 255, 0.4)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 6,
        }}>{pad(timeLeft.seconds)}</Text>
        <Text className="text-cyan-400/70 text-[8px] uppercase font-bold tracking-widest mt-1">s</Text>
      </View>
    </View>
  );
}
