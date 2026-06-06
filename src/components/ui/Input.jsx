import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  className = '',
  leftIcon,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const inputRef = useRef(null);

  const isPassword = secureTextEntry;

  return (
    <View className={`w-full ${className || 'mb-4'}`}>
      {label && (
        <Text 
          className="text-xs font-bold uppercase tracking-widest mb-2 ml-0.5"
          style={{ color: isDark ? 'rgba(148, 163, 184, 0.8)' : '#64748B' }}
        >
          {label}
        </Text>
      )}
      <Pressable 
        onPress={() => inputRef.current?.focus()}
        className="flex-row items-center rounded-xl px-4"
        style={[
          {
            backgroundColor: isDark ? '#0A0E1A' : '#F1F5F9',
            borderWidth: 1.5,
            borderColor: isFocused
              ? (isDark ? '#8B5CF6' : '#7C3AED')
              : error
                ? '#EF4444'
                : (isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'),
            paddingVertical: 14,
          },
          isFocused && {
            shadowColor: isDark ? '#8B5CF6' : '#7C3AED',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isDark ? 0.3 : 0.15,
            shadowRadius: 8,
            elevation: 4,
          }
        ]}
      >
        {leftIcon && (
          <View className="mr-3">
            {leftIcon}
          </View>
        )}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? 'rgba(100, 116, 139, 0.6)' : '#94A3B8'}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{ 
            flex: 1, 
            color: isDark ? '#F1F5F9' : '#0F172A', 
            fontSize: 15, 
            padding: 0,
            letterSpacing: 0.3,
          }}
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <Pressable onPress={() => setShowPassword(!showPassword)} className="pl-3">
            {showPassword ? (
              <EyeOff size={20} color={isDark ? 'rgba(148, 163, 184, 0.6)' : '#94A3B8'} />
            ) : (
              <Eye size={20} color={isDark ? 'rgba(148, 163, 184, 0.6)' : '#94A3B8'} />
            )}
          </Pressable>
        )}
      </Pressable>
      {error && (
        <Text 
          className="text-xs mt-1.5 ml-1 font-semibold"
          style={{ color: isDark ? '#F87171' : '#DC2626' }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
