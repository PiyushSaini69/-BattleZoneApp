import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { request } from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(''); // Serves as the reset token input
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Request Link/Token, 2 = Verify & Reset Password
  const [error, setError] = useState('');
  const [devResetToken, setDevResetToken] = useState('');

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
        Alert.alert('Link Sent 📧', "If that email is registered, we've sent a password reset link.");
        if (res.data?.tokenValue) {
          setDevResetToken(res.data.tokenValue);
        }
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
      setError('Reset token and new password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, token: otp.trim(), newPassword })
      });
      if (res.success) {
        Alert.alert('Success 🎉', 'Password reset completed successfully! Please login with your new credentials.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-[#0B0F1A]" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
      <View className="items-center mb-8">
        <Text className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-widest text-center">
          RESET <Text className="text-[#7C3AED]">PASSWORD</Text>
        </Text>
      </View>

      <GlassCard className="mb-6">
        {error !== '' && (
          <View 
            className="border rounded-xl p-3.5 mb-4"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'rgba(239, 68, 68, 0.2)',
            }}
          >
            <Text className="text-red-600 dark:text-red-400 text-xs font-semibold text-center">{error}</Text>
          </View>
        )}

        {step === 1 ? (
          <>
            <Text className="text-slate-600 dark:text-slate-400 text-xs mb-6 text-center leading-relaxed">
              Enter your registered email address below. We will send you a secure link and reset token to reset your password.
            </Text>
            
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="yourname@domain.com"
              keyboardType="email-address"
            />

            <Button
              title="Send Reset Link"
              onPress={handleRequestOTP}
              loading={loading}
              className="mt-2"
            />
          </>
        ) : (
          <>
            <Text className="text-slate-600 dark:text-slate-400 text-xs mb-6 text-center leading-relaxed">
              We have sent a reset link containing a token to <Text className="text-slate-900 dark:text-white font-bold">{email}</Text>. Copy the token from that link and enter it below.
            </Text>

            <Input
              label="Reset Token"
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter recovery token"
            />

            {/* Development Helper Badge */}
            {devResetToken !== '' && (
              <Pressable 
                onPress={() => setOtp(devResetToken)}
                className="mb-4 items-center flex-row justify-center bg-amber-500/10 border border-amber-500/20 rounded-xl p-3"
              >
                <Text className="text-amber-600 dark:text-amber-400 text-xs font-bold text-center">
                  🛠️ Dev Auto-fill Token: <Text className="underline font-mono text-[10px]">{devResetToken.substring(0, 10)}...</Text>
                </Text>
              </Pressable>
            )}

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
              onPress={() => {
                setStep(1);
                setOtp('');
                setDevResetToken('');
              }}
              className="mt-4 self-center"
            >
              <Text className="text-slate-600 dark:text-slate-400 font-semibold text-xs underline">Resend Token / Back</Text>
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
