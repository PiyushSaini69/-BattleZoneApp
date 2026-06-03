import React from 'react';
import { View } from 'react-native';

export default function GlassCard({ children, className = '', style, ...props }) {
  return (
    <View 
      className={`rounded-2xl p-4 ${className}`}
      style={[
        {
          backgroundColor: 'rgba(15, 23, 42, 0.8)', // bg-slate-900/80 equivalent
          borderColor: 'rgba(255, 255, 255, 0.1)', // border-white/10 equivalent
          borderWidth: 1,
          shadowColor: '#000000', // shadow-black/50 equivalent
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.5,
          shadowRadius: 15,
          elevation: 10,
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

