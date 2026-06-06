import React from 'react';
import { View, Text } from 'react-native';

export default function Badge({ text, variant = 'info', className = '' }) {
  const getBgBorderStyles = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.45)', borderWidth: 1 };
      case 'danger':
        return { backgroundColor: 'rgba(244, 63, 94, 0.08)', borderColor: 'rgba(244, 63, 94, 0.45)', borderWidth: 1 };
      case 'warning':
        return { backgroundColor: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.45)', borderWidth: 1 };
      case 'info':
        return { backgroundColor: 'rgba(59, 130, 246, 0.08)', borderColor: 'rgba(59, 130, 246, 0.45)', borderWidth: 1 };
      case 'purple':
        return { backgroundColor: 'rgba(139, 92, 246, 0.08)', borderColor: 'rgba(139, 92, 246, 0.45)', borderWidth: 1 };
      case 'cyan':
        return { backgroundColor: 'rgba(0, 229, 255, 0.08)', borderColor: 'rgba(0, 229, 255, 0.45)', borderWidth: 1 };
      default:
        return {};
    }
  };

  const getClassNameStyles = () => {
    if (['success', 'danger', 'warning', 'info', 'purple', 'cyan'].includes(variant)) {
      return '';
    }
    return 'bg-slate-100/10 dark:bg-slate-800/40 border-slate-200/20 dark:border-slate-700/40';
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success': return 'text-emerald-400';
      case 'danger': return 'text-rose-450';
      case 'warning': return 'text-amber-400';
      case 'info': return 'text-blue-400';
      case 'purple': return 'text-violet-400';
      case 'cyan': return 'text-cyan-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <View 
      className={`border rounded-full px-3 py-1 self-start ${getClassNameStyles()} ${className}`}
      style={getBgBorderStyles()}
    >
      <Text className={`text-[10px] font-extrabold uppercase tracking-wider ${getTextColor()}`}>{text}</Text>
    </View>
  );
}
