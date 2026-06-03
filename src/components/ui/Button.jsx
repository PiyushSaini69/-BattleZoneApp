import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'nativewind';

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
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getVariantStyles = () => {
    if (disabled) return 'bg-slate-200 dark:bg-slate-850';
    switch (variant) {
      case 'primary':
        return 'bg-[#7C3AED] border border-purple-500';
      case 'secondary':
        return 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700';
      case 'accent':
        return 'bg-cyan-500 border border-cyan-400';
      case 'danger':
        return 'bg-red-600 border border-red-500';
      case 'outline':
        return 'bg-transparent border border-slate-300 dark:border-slate-700';
      default:
        return 'bg-[#7C3AED]';
    }
  };

  const getVariantInlineStyle = () => {
    const styles = {};
    if (disabled) {
      styles.opacity = 0.5;
    }
    
    if (!disabled) {
      if (variant === 'primary') {
        styles.shadowColor = '#7C3AED';
        styles.shadowOffset = { width: 0, height: 4 };
        styles.shadowOpacity = 0.3;
        styles.shadowRadius = 6;
        styles.elevation = 4;
      } else if (variant === 'accent') {
        styles.shadowColor = '#06B6D4';
        styles.shadowOffset = { width: 0, height: 4 };
        styles.shadowOpacity = 0.3;
        styles.shadowRadius = 6;
        styles.elevation = 4;
      } else if (variant === 'danger') {
        styles.shadowColor = '#DC2626';
        styles.shadowOffset = { width: 0, height: 4 };
        styles.shadowOpacity = 0.3;
        styles.shadowRadius = 6;
        styles.elevation = 4;
      }
    }
    return styles;
  };

  const getTextColorStyles = () => {
    if (disabled) return 'text-slate-400 dark:text-slate-500 font-bold';
    switch (variant) {
      case 'secondary':
        return 'text-slate-800 dark:text-white font-bold';
      case 'outline':
        return 'text-slate-850 dark:text-white font-semibold';
      default:
        return 'text-white font-bold';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => {
        const baseStyle = getVariantInlineStyle();
        if (pressed && !disabled) {
          return { ...baseStyle, transform: [{ scale: 0.97 }] };
        }
        return baseStyle;
      }}
      className={`rounded-xl py-3.5 px-6 flex-row justify-center items-center ${getVariantStyles()} ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'secondary' ? (isDark ? '#ffffff' : '#0f172a') : '#ffffff'} size="small" />
      ) : (
        <Text className={`text-base text-center ${getTextColorStyles()} ${textClassName}`}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
