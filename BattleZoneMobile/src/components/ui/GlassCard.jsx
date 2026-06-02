import React from 'react';
import { View } from 'react-native';

export default function GlassCard({ children, className = '', ...props }) {
  return (
    <View 
      className={`bg-slate-900/80 border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/50 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
