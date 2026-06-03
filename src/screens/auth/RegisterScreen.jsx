import React, { useState, useContext } from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';

export default function RegisterScreen({ navigation }) {
  const { register, authError, setAuthError } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleRegisterSubmit = async () => {
    setLocalError('');
    setAuthError('');

    if (!username || !email || !password) {
      setLocalError('Username, email, and password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(username, email, password, phone, referralCode);
      if (res.success) {
        Alert.alert('Success 🎉', 'Registration completed successfully! Please login to your account.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (err) {
      console.log('Registration error details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#0B0F1A]" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
      <View className="items-center mb-6 mt-8">
        <Text className="text-4xl font-extrabold text-white tracking-widest text-center">
          BATTLE<Text className="text-[#7C3AED]">ZONE</Text>
        </Text>
        <Text className="text-slate-400 text-[10px] mt-2 text-center uppercase tracking-widest font-semibold">
          Create Your Account
        </Text>
      </View>

      <GlassCard className="mb-6">
        {(localError || authError) && (
          <View 
            className="border rounded-xl p-3.5 mb-4"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'rgba(239, 68, 68, 0.2)',
            }}
          >
            <Text className="text-red-400 text-xs font-semibold text-center">
              {localError || authError}
            </Text>
          </View>
        )}

        <Input
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="warrior123"
        />

        <Input
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="yourname@domain.com"
          keyboardType="email-address"
        />

        <Input
          label="Phone Number (Optional)"
          value={phone}
          onChangeText={setPhone}
          placeholder="10-digit number"
          keyboardType="phone-pad"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <Input
          label="Referral Code (Optional)"
          value={referralCode}
          onChangeText={setReferralCode}
          placeholder="E.g., PRO99"
        />

        <Button
          title="Sign Up"
          onPress={handleRegisterSubmit}
          loading={loading}
          className="mt-4"
        />
      </GlassCard>

      <View className="flex-row justify-center items-center py-4 mb-8">
        <Text className="text-slate-400 text-sm">Already have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text className="text-[#7C3AED] font-bold text-sm">Sign In</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
