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

  const isError = type === 'error';

  return (
    <View 
      className={`absolute bottom-8 left-4 right-4 z-50 px-4 py-4 rounded-2xl border flex-row items-center`}
      style={{
        backgroundColor: 'rgba(10, 14, 26, 0.92)',
        borderColor: isError ? 'rgba(244, 63, 94, 0.6)' : 'rgba(0, 229, 255, 0.6)',
        shadowColor: isError ? '#F43F5E' : '#00E5FF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 100,
      }}
    >
      <View className="mr-3">
        {isError ? (
          <XCircle size={20} color="#F43F5E" />
        ) : (
          <CheckCircle size={20} color="#00E5FF" />
        )}
      </View>
      <Text className={`text-sm font-bold flex-1 tracking-wide ${
        isError ? 'text-rose-400' : 'text-cyan-400'
      }`}>
        {message}
      </Text>
    </View>
  );
}
