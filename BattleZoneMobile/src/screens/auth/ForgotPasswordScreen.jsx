import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { request } from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify OTP & Reset Password
  const [error, setError] = useState('');

  const handleRequestOTP = async () => {
    setError('');
    if (!email) {
      setError('Email is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      if (res.success) {
        Alert.alert('OTP Sent 📧', 'A password reset OTP has been sent to your email.');
        setStep(2);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    if (!otp || !newPassword) {
      setError('OTP and new password are required.');
      return;
    }

    setLoading(true);
    try {
      // Endpoint mapping for custom password reset with OTP
      const res = await request('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword })
      });
      Alert.alert('Success 🎉', 'Password reset completed successfully! Please login with your new credentials.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#0B0F1A]" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
      <View className="items-center mb-8">
        <Text className="text-3xl font-extrabold text-white tracking-widest text-center">
          RESET <Text className="text-[#7C3AED]">PASSWORD</Text>
        </Text>
      </View>

      <GlassCard className="mb-6">
        {error !== '' && (
          <View className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 mb-4">
            <Text className="text-red-400 text-xs font-semibold text-center">{error}</Text>
          </View>
        )}

        {step === 1 ? (
          <>
            <Text className="text-slate-400 text-xs mb-6 text-center leading-relaxed">
              Enter your registered email address below. We will send you an OTP to verify your identity and reset your password.
            </Text>
            
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="yourname@domain.com"
              keyboardType="email-address"
            />

            <Button
              title="Send Verification OTP"
              onPress={handleRequestOTP}
              loading={loading}
              className="mt-2"
            />
          </>
        ) : (
          <>
            <Text className="text-slate-400 text-xs mb-6 text-center leading-relaxed">
              We have sent an OTP to <Text className="text-white font-bold">{email}</Text>. Enter the OTP and your new password below.
            </Text>

            <Input
              label="OTP Code"
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter 6-digit OTP"
              keyboardType="number-pad"
            />

            <Input
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="••••••••"
              secureTextEntry
            />

            <Button
              title="Reset Password"
              onPress={handleResetPassword}
              loading={loading}
              className="mt-2"
            />

            <Pressable 
              onPress={() => setStep(1)}
              className="mt-4 self-center"
            >
              <Text className="text-slate-400 font-semibold text-xs underline">Resend OTP / Back</Text>
            </Pressable>
          </>
        )}
      </GlassCard>

      <Pressable onPress={() => navigation.navigate('Login')} className="self-center py-4">
        <Text className="text-[#7C3AED] font-bold text-sm">Back to Login</Text>
      </Pressable>
    </ScrollView>
  );
}
