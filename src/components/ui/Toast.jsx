import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { CheckCircle, XCircle } from 'lucide-react-native';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <View 
      className={`absolute bottom-8 left-4 right-4 z-50 px-4 py-3.5 rounded-xl border flex-row items-center bg-slate-900/95 shadow-2xl ${
        type === 'error' ? 'border-red-500/50' : 'border-purple-500/40'
      }`}
      style={{ elevation: 100 }}
    >
      <View className="mr-2">
        {type === 'error' ? (
          <XCircle size={18} color="#F87171" />
        ) : (
          <CheckCircle size={18} color="#C084FC" />
        )}
      </View>
      <Text className={`text-xs font-bold flex-1 ${
        type === 'error' ? 'text-red-400' : 'text-purple-300'
      }`}>
        {message}
      </Text>
    </View>
  );
}
