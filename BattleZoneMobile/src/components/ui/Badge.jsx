import React from 'react';
import { View, Text } from 'react-native';

export default function Badge({ text, variant = 'info', className = '' }) {
  const getBgBorderStyles = () => {
    switch (variant) {
      case 'success': return 'bg-emerald-500/10 border-emerald-500/30';
      case 'danger': return 'bg-red-500/10 border-red-500/30';
      case 'warning': return 'bg-amber-500/10 border-amber-500/30';
      case 'info': return 'bg-blue-500/10 border-blue-500/30';
      case 'purple': return 'bg-purple-500/10 border-purple-500/30';
      case 'cyan': return 'bg-cyan-500/10 border-cyan-500/30';
      default: return 'bg-slate-800 border-slate-700';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success': return 'text-emerald-400';
      case 'danger': return 'text-red-400';
      case 'warning': return 'text-amber-400';
      case 'info': return 'text-blue-400';
      case 'purple': return 'text-purple-400';
      case 'cyan': return 'text-cyan-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <View className={`border rounded-full px-3 py-1 self-start ${getBgBorderStyles()} ${className}`}>
      <Text className={`text-[10px] font-bold capitalize ${getTextColor()}`}>{text}</Text>
    </View>
  );
}
