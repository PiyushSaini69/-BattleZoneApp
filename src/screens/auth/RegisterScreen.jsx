import React, { useState, useContext } from 'react';
import { ScrollView, View, Text, Pressable, Alert, Image } from 'react-native';
import { useColorScheme } from 'nativewind';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';

export default function RegisterScreen({ navigation }) {
  const { register, authError, setAuthError } = useContext(AuthContext);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
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

    const trimmedUsername = username.trim();
    if (!trimmedUsername || trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      setLocalError('Username must be between 3 and 20 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      setLocalError('Username can only contain alphanumeric characters and underscores.');
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Please provide a valid email address.');
      return;
    }

    if (!password || password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasUpper || !hasNum || !hasSpecial) {
      setLocalError('Password must contain at least 1 uppercase letter, 1 number, and 1 special character.');
      return;
    }

    if (phone && !/^[0-9]{10}$/.test(phone)) {
      setLocalError('Phone number must be exactly 10 digits.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(trimmedUsername, email, password, phone, referralCode);
      if (res.success) {
        Alert.alert(
          'Verification Sent 📧', 
          'A secure verification code has been sent to your email. Please verify your account to activate it.',
          [
            { 
              text: 'Verify Now', 
              onPress: () => navigation.navigate('VerifyEmail', { 
                email: email, 
                devOtp: res.data?.otpValue || '' 
              }) 
            }
          ]
        );
      }
    } catch (err) {
      console.log('Registration error details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-[#0B0F1A]" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
      <View className="items-center mb-6 mt-8">
        <Image 
          source={isDark ? require('../../../assets/logolight.jpeg') : require('../../../assets/logodark.jpeg')}
          style={{ width: 180, height: 50 }}
          resizeMode="contain"
        />
        <Text className="text-slate-500 dark:text-slate-400 text-[10px] mt-2 text-center uppercase tracking-widest font-semibold">
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
            <Text className="text-red-600 dark:text-red-400 text-xs font-semibold text-center">
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
        <Text className="text-slate-600 dark:text-slate-400 text-sm">Already have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text className="text-[#7C3AED] font-bold text-sm">Sign In</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
