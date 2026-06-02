import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';

export default function Button({ 
  onPress, 
  title, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  className = '',
  textClassName = '',
  ...props 
}) {
  const getVariantStyles = () => {
    if (disabled) return 'bg-slate-800 opacity-50';
    switch (variant) {
      case 'primary':
        return 'bg-[#7C3AED] border border-purple-500 shadow-lg shadow-purple-500/30';
      case 'secondary':
        return 'bg-slate-800 border border-slate-700';
      case 'accent':
        return 'bg-cyan-500 border border-cyan-400 shadow-lg shadow-cyan-500/30';
      case 'danger':
        return 'bg-red-600 border border-red-500 shadow-lg shadow-red-500/30';
      case 'outline':
        return 'bg-transparent border border-white/20';
      default:
        return 'bg-[#7C3AED]';
    }
  };

  const getTextColorStyles = () => {
    switch (variant) {
      case 'outline':
        return 'text-white font-semibold';
      default:
        return 'text-white font-bold';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => pressed && !disabled ? { transform: [{ scale: 0.97 }] } : null}
      className={`rounded-xl py-3.5 px-6 flex-row justify-center items-center ${getVariantStyles()} ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <Text className={`text-base text-center ${getTextColorStyles()} ${textClassName}`}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
