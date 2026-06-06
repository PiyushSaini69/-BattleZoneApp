import React from 'react';
import { View, Text } from 'react-native';

export default function Badge({ text, variant = 'info', className = '' }) {
  const getBgBorderStyles = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', borderWidth: 1 };
      case 'danger':
        return { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', borderWidth: 1 };
      case 'warning':
        return { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', borderWidth: 1 };
      case 'info':
        return { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)', borderWidth: 1 };
      case 'purple':
        return { backgroundColor: 'rgba(168, 85, 247, 0.1)', borderColor: 'rgba(168, 85, 247, 0.3)', borderWidth: 1 };
      case 'cyan':
        return { backgroundColor: 'rgba(6, 182, 212, 0.1)', borderColor: 'rgba(6, 182, 212, 0.3)', borderWidth: 1 };
      default:
        return {};
    }
  };

  const getClassNameStyles = () => {
    if (['success', 'danger', 'warning', 'info', 'purple', 'cyan'].includes(variant)) {
      return '';
    }
    return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success': return 'text-emerald-600 dark:text-emerald-400';
      case 'danger': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-amber-600 dark:text-amber-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
      case 'purple': return 'text-purple-600 dark:text-purple-400';
      case 'cyan': return 'text-cyan-600 dark:text-cyan-400';
      default: return 'text-slate-600 dark:text-slate-300';
    }
  };

  return (
    <View 
      className={`border rounded-full px-3 py-1 self-start ${getClassNameStyles()} ${className}`}
      style={getBgBorderStyles()}
    >
      <Text className={`text-[10px] font-bold capitalize ${getTextColor()}`}>{text}</Text>
    </View>
  );
}
