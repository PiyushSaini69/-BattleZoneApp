import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';
import { useColorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function VerifyEmailScreen({ route, navigation }) {
  const { verifyEmailOtp, resendVerificationOtp, authError, setAuthError } = useContext(AuthContext);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Extract route params safely
  const initialEmail = route.params?.email || '';
  const initialDevOtp = route.params?.devOtp || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300 seconds)
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [devOtp, setDevOtp] = useState(initialDevOtp);

  // Sync email from params if it changes
  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
    if (route.params?.devOtp) {
      setDevOtp(route.params.devOtp);
    }
  }, [route.params]);

  // Countdown timer hook
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifySubmit = async () => {
    setLocalError('');
    setSuccessMsg('');
    setAuthError('');

    if (!email) {
      setLocalError('Email address is required.');
      return;
    }
    if (!otp || otp.length !== 6) {
      setLocalError('Please enter a valid 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyEmailOtp(email, otp);
      if (res && res.success) {
        setSuccessMsg(res.message || 'Email verified successfully!');
        
        // Auto-login succeeds, which updates AuthContext user state and triggers navigation automatically via AppNavigator.
        Alert.alert('Success 🎉', 'Email verified successfully! Logging you in...', [
          { text: 'OK' }
        ]);
      }
    } catch (err) {
      setLocalError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLocalError('');
    setSuccessMsg('');
    setAuthError('');
    setResendLoading(true);

    try {
      const res = await resendVerificationOtp(email);
      if (res && res.success) {
        setSuccessMsg(res.message || 'Verification code resent successfully.');
        setTimeLeft(300); // Reset timer to 5 mins
        setIsTimerActive(true);

        if (res.data?.otpValue) {
          setDevOtp(res.data.otpValue);
        }
        Alert.alert('Success 📧', 'A new verification code has been sent.');
      }
    } catch (err) {
      setLocalError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <ScrollView 
            className="flex-1" 
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
            keyboardShouldPersistTaps="handled"
          >
        <View className="items-center mb-8 mt-8">
          <Text 
            className="text-3xl font-black text-slate-900 dark:text-white tracking-widest text-center"
            style={isDark ? {
              textShadowColor: 'rgba(0, 229, 255, 0.4)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 8,
            } : {}}
          >
            VERIFY <Text className="text-cyan-400">ACCOUNT</Text>
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-[10px] mt-2 text-center uppercase tracking-widest font-extrabold">
            Confirm Email Ownership
          </Text>
        </View>

        <GlassCard className="mb-6" glowColor="purple">
          {(localError || authError) && (
            <View 
              className="border rounded-xl p-3.5 mb-4"
              style={{
                backgroundColor: 'rgba(244, 63, 94, 0.08)',
                borderColor: 'rgba(244, 63, 94, 0.35)',
              }}
            >
              <Text className="text-rose-455 text-xs font-bold text-center">
                {localError || authError}
              </Text>
            </View>
          )}

          {successMsg && (
            <View 
              className="border rounded-xl p-3.5 mb-4"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                borderColor: 'rgba(16, 185, 129, 0.35)',
              }}
            >
              <Text className="text-emerald-400 text-xs font-bold text-center">
                {successMsg}
              </Text>
            </View>
          )}

          <Input
            label="Registered Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="yourname@domain.com"
            keyboardType="email-address"
            editable={!initialEmail}
            style={initialEmail ? { opacity: 0.7 } : {}}
          />

          <View className="flex-row justify-between items-center mb-2 px-1">
            <Text className="text-xs font-extrabold uppercase tracking-wide text-slate-700 dark:text-slate-400">
              6-Digit Verification OTP
            </Text>
            {isTimerActive ? (
              <Text className="text-xs text-amber-500 font-extrabold uppercase tracking-wider">
                Expires: {formatTime(timeLeft)}
              </Text>
            ) : (
              <Text className="text-xs text-rose-500 font-extrabold uppercase tracking-wider">Expired</Text>
            )}
          </View>

          <Input
            value={otp}
            onChangeText={(val) => setOtp(val.replace(/[^0-9]/g, ''))}
            placeholder="e.g. 524901"
            keyboardType="number-pad"
            maxLength={6}
            className="text-center font-mono tracking-widest text-xl font-black py-4"
          />

          <Button
            title="Verify Account"
            onPress={handleVerifySubmit}
            loading={loading}
            className="mt-2"
          />

          <View className="relative my-6 items-center justify-center flex-row">
            <View className="w-full border-t border-slate-200 dark:border-white/10 absolute"></View>
            <Text className="px-3 text-[9px] font-bold uppercase tracking-widest bg-slate-50 dark:bg-[#0D1321] text-slate-500 z-10">
              Haven't received a code?
            </Text>
          </View>

          <Pressable
            onPress={handleResendOtp}
            disabled={isTimerActive || resendLoading}
            className="w-full py-3.5 border rounded-xl flex-row items-center justify-center transition"
            style={({ pressed }) => [
              {
                backgroundColor: isTimerActive 
                  ? 'rgba(0,0,0,0.02)' 
                  : pressed 
                    ? 'rgba(0, 229, 255, 0.1)' 
                    : 'transparent',
                borderColor: isTimerActive 
                  ? 'rgba(255,255,255,0.05)' 
                  : 'rgba(0, 229, 255, 0.3)',
                borderWidth: 1,
                opacity: isTimerActive ? 0.4 : 1
              }
            ]}
          >
            {resendLoading ? (
              <ActivityIndicator size="small" color="#00E5FF" />
            ) : (
              <Text className={`font-extrabold text-xs uppercase tracking-wider ${isTimerActive ? 'text-slate-500' : 'text-cyan-400'}`}>
                {isTimerActive ? `Resend in ${formatTime(timeLeft)}` : 'Resend Verification Code'}
              </Text>
            )}
          </Pressable>
        </GlassCard>

        <Pressable onPress={() => navigation.navigate('Login')} className="self-center py-4 mb-4">
          <Text className="text-cyan-400 font-extrabold text-sm uppercase tracking-wide">Back to Login</Text>
        </Pressable>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
