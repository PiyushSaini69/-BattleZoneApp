import React from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';

const GLOW_COLORS = {
  cyan: { shadow: '#00E5FF', border: 'rgba(0, 229, 255, 0.25)', bg: 'rgba(0, 229, 255, 0.04)' },
  purple: { shadow: '#8B5CF6', border: 'rgba(139, 92, 246, 0.25)', bg: 'rgba(139, 92, 246, 0.04)' },
  magenta: { shadow: '#EC4899', border: 'rgba(236, 72, 153, 0.25)', bg: 'rgba(236, 72, 153, 0.04)' },
  emerald: { shadow: '#10B981', border: 'rgba(16, 185, 129, 0.25)', bg: 'rgba(16, 185, 129, 0.04)' },
  red: { shadow: '#EF4444', border: 'rgba(239, 68, 68, 0.25)', bg: 'rgba(239, 68, 68, 0.04)' },
};

export default function GlassCard({ children, className = '', style, glowColor, ...props }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const glow = glowColor && GLOW_COLORS[glowColor];

  return (
    <View 
      className={`rounded-2xl p-4 ${className}`}
      style={[
        {
          backgroundColor: isDark 
            ? (glow ? `rgba(10, 15, 30, 0.85)` : 'rgba(10, 15, 30, 0.8)') 
            : (glow ? `rgba(255, 255, 255, 0.92)` : 'rgba(255, 255, 255, 0.88)'),
          borderColor: isDark 
            ? (glow ? glow.border : 'rgba(255, 255, 255, 0.08)') 
            : (glow ? glow.border : 'rgba(0, 0, 0, 0.06)'),
          borderWidth: 1,
          shadowColor: glow ? glow.shadow : '#000000',
          shadowOffset: { width: 0, height: glow ? 4 : 8 },
          shadowOpacity: isDark ? (glow ? 0.35 : 0.45) : (glow ? 0.15 : 0.05),
          shadowRadius: glow ? 12 : 16,
          elevation: isDark ? (glow ? 8 : 10) : (glow ? 4 : 3),
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
