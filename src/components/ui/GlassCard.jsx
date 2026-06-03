import React from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';

export default function GlassCard({ children, className = '', style, ...props }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View 
      className={`rounded-2xl p-4 ${className}`}
      style={[
        {
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.85)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
          borderWidth: 1,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: isDark ? 0.5 : 0.06,
          shadowRadius: 15,
          elevation: isDark ? 10 : 3,
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

