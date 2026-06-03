import React, { useState, useContext } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';

export default function LoginScreen({ navigation }) {
  const { login, authError, setAuthError } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleLoginSubmit = async () => {
    setLocalError('');
    setAuthError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      console.log('Login error details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-[#0B0F1A]" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
      <View className="items-center mb-8">
        <Text className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-widest text-center">
          BATTLE<Text className="text-[#7C3AED]">ZONE</Text>
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 text-[10px] mt-2 text-center uppercase tracking-widest font-semibold">
          Esports Tournament Hub
        </Text>
      </View>

      <GlassCard className="mb-6">
        <Text className="text-slate-900 dark:text-white text-lg font-bold mb-6 text-center uppercase tracking-wider">Welcome Warrior</Text>

        {(localError || authError) && (
          <View 
            className="border rounded-xl p-3.5 mb-4"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'rgba(239, 68, 68, 0.2)',
            }}
          >
            <Text className="text-red-600 dark:text-red-400 text-xs font-semibold text-center">
              {localError || authError}
            </Text>
          </View>
        )}

        <Input
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="yourname@domain.com"
          keyboardType="email-address"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <Pressable 
          onPress={() => navigation.navigate('ForgotPassword')}
          className="self-end mb-6"
        >
          <Text className="text-purple-650 dark:text-purple-400 font-semibold text-xs">Forgot Password?</Text>
        </Pressable>

        <Button
          title="Sign In"
          onPress={handleLoginSubmit}
          loading={loading}
        />
      </GlassCard>

      <View className="flex-row justify-center items-center py-4">
        <Text className="text-slate-650 dark:text-slate-400 text-sm">Don't have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text className="text-[#7C3AED] font-bold text-sm">Sign Up</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
