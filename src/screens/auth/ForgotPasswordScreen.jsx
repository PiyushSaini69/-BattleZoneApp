import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { request } from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';
import { useColorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgotPasswordScreen({ navigation }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
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
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            alwaysBounceVertical={true}
          >
            <View style={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
              <View className="items-center mb-8 mt-8">
                <Text 
                  className="text-3xl font-black text-slate-900 dark:text-white tracking-widest text-center"
                  style={isDark ? {
                    textShadowColor: 'rgba(139, 92, 246, 0.4)',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8,
                  } : {}}
                >
                  RESET <Text className="text-violet-400">PASSWORD</Text>
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-[10px] mt-2 text-center uppercase tracking-widest font-extrabold">
                  Account Recovery Portal
                </Text>
              </View>

              <GlassCard className="mb-6" glowColor="purple">
                {error !== '' && (
                  <View 
                    className="border rounded-xl p-3.5 mb-4"
                    style={{
                      backgroundColor: 'rgba(244, 63, 94, 0.08)',
                      borderColor: 'rgba(244, 63, 94, 0.35)',
                    }}
                  >
                    <Text className="text-rose-455 text-xs font-bold text-center">{error}</Text>
                  </View>
                )}

                {step === 1 ? (
                  <>
                    <Text className="text-slate-600 dark:text-slate-400 text-xs mb-6 text-center leading-relaxed font-semibold">
                      Enter your registered email address below. We will send you a secure link to reset your password.
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
                    <Text className="text-slate-600 dark:text-slate-400 text-xs mb-6 text-center leading-relaxed font-semibold">
                      We have sent a reset link containing a token to <Text className="text-slate-900 dark:text-white font-extrabold">{email}</Text>. Copy the token from that link and enter it below.
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
                        className="mb-4 items-center flex-row justify-center bg-amber-500/10 border border-amber-500/30 rounded-xl p-3"
                      >
                        <Text className="text-amber-500 text-xs font-bold text-center">
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
                      <Text className="text-violet-400 font-bold text-xs uppercase tracking-wide underline">Resend Token / Back</Text>
                    </Pressable>
                  </>
                )}
              </GlassCard>

              <Pressable onPress={() => navigation.navigate('Login')} className="self-center py-4 mb-4">
                <Text className="text-cyan-400 font-extrabold text-sm uppercase tracking-wide">Back to Login</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
