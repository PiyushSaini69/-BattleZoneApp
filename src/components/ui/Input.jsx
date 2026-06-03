import React, { useState } from 'react';
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
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const isPassword = secureTextEntry;

  return (
    <View className={`mb-4 w-full ${className}`}>
      {label && (
        <Text className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-1.5 ml-1">
          {label}
        </Text>
      )}
      <View 
        className={`flex-row items-center bg-slate-100 dark:bg-slate-900 border rounded-xl px-4 py-3.5 ${
          isFocused 
            ? 'border-purple-600 dark:border-[#7C3AED]' 
            : error 
              ? 'border-red-500' 
              : 'border-slate-200 dark:border-slate-800'
        }`}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{ flexGrow: 1, color: isDark ? '#ffffff' : '#0F172A', fontSize: 16, padding: 0 }}
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <Pressable onPress={() => setShowPassword(!showPassword)} className="pl-2">
            {showPassword ? (
              <EyeOff size={20} color={isDark ? "#94A3B8" : "#64748B"} />
            ) : (
              <Eye size={20} color={isDark ? "#94A3B8" : "#64748B"} />
            )}
          </Pressable>
        )}
      </View>
      {error && (
        <Text className="text-red-650 dark:text-red-400 text-xs mt-1 ml-1.5 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
}
