import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

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

  const isPassword = secureTextEntry;

  return (
    <View className={`mb-4 w-full ${className}`}>
      {label && (
        <Text className="text-slate-450 text-sm font-semibold mb-1.5 ml-1">
          {label}
        </Text>
      )}
      <View 
        className={`flex-row items-center bg-slate-900 border rounded-xl px-4 py-3.5 ${
          isFocused ? 'border-[#7C3AED]' : error ? 'border-red-500' : 'border-slate-800'
        }`}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#64748B"
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{ flexGrow: 1, color: '#ffffff', fontSize: 16, padding: 0 }}
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <Pressable onPress={() => setShowPassword(!showPassword)} className="pl-2">
            {showPassword ? (
              <EyeOff size={20} color="#94A3B8" />
            ) : (
              <Eye size={20} color="#94A3B8" />
            )}
          </Pressable>
        )}
      </View>
      {error && (
        <Text className="text-red-400 text-xs mt-1 ml-1.5 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
}
