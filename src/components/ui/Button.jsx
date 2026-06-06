import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

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

  const isGradientVariant = ['primary', 'accent'].includes(variant) && !disabled;

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return ['#7C3AED', '#8B5CF6', '#6D28D9'];
      case 'accent':
        return ['#0891B2', '#00E5FF', '#06B6D4'];
      default:
        return ['#7C3AED', '#8B5CF6'];
    }
  };

  const getFlatStyles = () => {
    if (disabled) return {
      backgroundColor: isDark ? '#1E293B' : '#E2E8F0',
    };
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : '#E2E8F0',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#CBD5E1',
          borderWidth: 1,
        };
      case 'danger':
        return {
          backgroundColor: '#DC2626',
          borderColor: '#EF4444',
          borderWidth: 1,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#CBD5E1',
          borderWidth: 1,
        };
      default:
        return {};
    }
  };

  const getShadowStyle = () => {
    if (disabled) return { opacity: 0.5 };
    const shadows = {};
    if (variant === 'primary') {
      shadows.shadowColor = '#7C3AED';
      shadows.shadowOffset = { width: 0, height: 6 };
      shadows.shadowOpacity = 0.4;
      shadows.shadowRadius = 12;
      shadows.elevation = 8;
    } else if (variant === 'accent') {
      shadows.shadowColor = '#00E5FF';
      shadows.shadowOffset = { width: 0, height: 6 };
      shadows.shadowOpacity = 0.35;
      shadows.shadowRadius = 12;
      shadows.elevation = 8;
    } else if (variant === 'danger') {
      shadows.shadowColor = '#DC2626';
      shadows.shadowOffset = { width: 0, height: 4 };
      shadows.shadowOpacity = 0.35;
      shadows.shadowRadius = 8;
      shadows.elevation = 6;
    }
    return shadows;
  };

  const getTextColor = () => {
    if (disabled) return isDark ? '#475569' : '#94A3B8';
    switch (variant) {
      case 'secondary':
        return isDark ? '#F1F5F9' : '#1E293B';
      case 'outline':
        return isDark ? '#F1F5F9' : '#1E293B';
      default:
        return '#FFFFFF';
    }
  };

  const content = loading ? (
    <ActivityIndicator 
      color={variant === 'outline' || variant === 'secondary' ? (isDark ? '#ffffff' : '#0f172a') : '#ffffff'} 
      size="small" 
    />
  ) : (
    <Text 
      style={{ 
        color: getTextColor(), 
        fontWeight: '800', 
        fontSize: 14, 
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
      }}
      className={textClassName}
    >
      {title}
    </Text>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        getShadowStyle(),
        pressed && !disabled ? { transform: [{ scale: 0.96 }] } : {},
      ]}
      className={className}
      {...props}
    >
      {isGradientVariant ? (
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 14,
            paddingVertical: 15,
            paddingHorizontal: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {content}
        </LinearGradient>
      ) : (
        <View
          style={[
            {
              borderRadius: 14,
              paddingVertical: 15,
              paddingHorizontal: 24,
              alignItems: 'center',
              justifyContent: 'center',
            },
            getFlatStyles(),
          ]}
        >
          {content}
        </View>
      )}
    </Pressable>
  );
}

// We need this for non-gradient rendering
import { View } from 'react-native';
