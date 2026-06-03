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
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.2)',
        }}
      >
        <Text className="text-red-400 font-bold text-xs text-center uppercase tracking-wide">LIVE / IN PROGRESS</Text>
      </View>
    );
  }

  return (
    <View 
      className={`flex-row items-center justify-center border px-3 py-2 rounded-xl ${className}`}
      style={{
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        borderColor: 'rgba(124, 58, 237, 0.2)',
      }}
    >
      <View className="items-center px-1.5">
        <Text className="text-[#7C3AED] font-bold text-base leading-none">{pad(timeLeft.days)}</Text>
        <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase tracking-wider mt-0.5">d</Text>
      </View>
      <Text className="font-bold text-base pb-1" style={{ color: 'rgba(192, 132, 252, 0.4)' }}>:</Text>
      <View className="items-center px-1.5">
        <Text className="text-[#7C3AED] font-bold text-base leading-none">{pad(timeLeft.hours)}</Text>
        <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase tracking-wider mt-0.5">h</Text>
      </View>
      <Text className="font-bold text-base pb-1" style={{ color: 'rgba(192, 132, 252, 0.4)' }}>:</Text>
      <View className="items-center px-1.5">
        <Text className="text-[#7C3AED] font-bold text-base leading-none">{pad(timeLeft.minutes)}</Text>
        <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase tracking-wider mt-0.5">m</Text>
      </View>
      <Text className="font-bold text-base pb-1" style={{ color: 'rgba(192, 132, 252, 0.4)' }}>:</Text>
      <View className="items-center px-1.5">
        <Text className="text-cyan-400 font-bold text-base leading-none">{pad(timeLeft.seconds)}</Text>
        <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase tracking-wider mt-0.5">s</Text>
      </View>
    </View>
  );
}
