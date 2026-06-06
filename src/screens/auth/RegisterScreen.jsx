import React, { useState, useEffect, useContext, useRef } from 'react';
import { ScrollView, View, Text, Pressable, Alert, Image, KeyboardAvoidingView, Platform, NativeModules, ActivityIndicator, Modal, TextInput, Keyboard } from 'react-native';
import { useColorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { CONFIG } from '../../config';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';
import GoogleIcon from '../../components/ui/GoogleIcon';
import { LinearGradient } from 'expo-linear-gradient';

let GoogleSignin = null;
let isGoogleSigninSupported = false;

try {
  // Dynamically require to prevent native link Invariant Violation crash on Expo Go
  const moduleRes = require('@react-native-google-signin/google-signin');
  GoogleSignin = moduleRes.GoogleSignin;
  isGoogleSigninSupported = !!NativeModules.RNGoogleSignin;
} catch (e) {
  console.log('Google Sign-In native module not available or linked in this environment.');
}

if (isGoogleSigninSupported && GoogleSignin) {
  try {
    GoogleSignin.configure({
      webClientId: CONFIG.GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  } catch (err) {
    console.warn('Google Sign-In configuration error:', err);
  }
}

const MOCK_GAMERS = [
  {
    id: "g1",
    googleId: "1122334455",
    name: "Ninja (Tyler Blevins)",
    email: "ninja@battlezone.gg",
    avatar: "https://api.dicebear.com/7.x/pixel-art/png?seed=ninja",
    title: "Fortnite Esports Legend",
    color: "#3B82F6"
  },
  {
    id: "g2",
    googleId: "2233445566",
    name: "Shroud (Michael Grzesiek)",
    email: "shroud@battlezone.gg",
    avatar: "https://api.dicebear.com/7.x/pixel-art/png?seed=shroud",
    title: "FPS Aim God & Free Fire Pro",
    color: "#475569"
  },
  {
    id: "g3",
    googleId: "3344556677",
    name: "Valkyrae (Rachell)",
    email: "valkyrae@battlezone.gg",
    avatar: "https://api.dicebear.com/7.x/pixel-art/png?seed=valkyrae",
    title: "Esports Queen & Co-Owner",
    color: "#F43F5E"
  },
  {
    id: "g4",
    googleId: "4455667788",
    name: "S1mple (Oleksandr)",
    email: "s1mple@battlezone.gg",
    avatar: "https://api.dicebear.com/7.x/pixel-art/png?seed=s1mple",
    title: "CS:GO GOAT & MVP Champion",
    color: "#F59E0B"
  }
];

export default function RegisterScreen({ navigation }) {
  const { register, googleLogin, authError, setAuthError } = useContext(AuthContext);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGamerChooser, setShowGamerChooser] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (localError || authError) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [localError, authError]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleRegisterSubmit = async () => {
    setLocalError('');
    setAuthError('');

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedFirstName) {
      setLocalError('First name is required.');
      return;
    }

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

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (!phone || !/^(?:\+91)?[0-9]{10}$/.test(phone)) {
      setLocalError('Phone number must be exactly 10 digits or start with +91 followed by 10 digits.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(trimmedUsername, email, password, phone, referralCode, trimmedFirstName, trimmedLastName, confirmPassword);
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

  const handleSelectMockGamer = async (gamer) => {
    setShowGamerChooser(false);
    setGoogleLoading(true);
    setLocalError('');
    setAuthError('');

    try {
      await googleLogin(
        `mock_google_token_${gamer.googleId}_${gamer.email}_${gamer.name}`,
        {
          googleId: gamer.googleId,
          email: gamer.email,
          name: gamer.name,
          avatar: gamer.avatar
        }
      );
    } catch (err) {
      console.log('Google login error details:', err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleLoginPress = async () => {
    setLocalError('');
    setAuthError('');

    if (isGoogleSigninSupported) {
      setGoogleLoading(true);
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const idToken = userInfo.idToken || userInfo.data?.idToken;

        if (!idToken) {
          throw new Error('Google Sign-In failed: No ID Token received from Google.');
        }

        const userObj = userInfo.user || userInfo.data?.user;
        await googleLogin(idToken, {
          googleId: userObj?.id || '',
          email: userObj?.email || '',
          name: userObj?.name || '',
          avatar: userObj?.photo || null
        });
      } catch (err) {
        console.log('Google login native error:', err);
        if (err.code === 'DEVELOPER_ERROR' || err.message?.toLowerCase().includes('developer')) {
          console.warn('Google Sign-in returned DEVELOPER_ERROR. Falling back to simulated Dev Accounts.');
          setShowGamerChooser(true);
        } else if (err.code !== 'SIGN_IN_CANCELLED') {
          setLocalError(`Google login error: ${err.message || err.code}`);
        }
      } finally {
        setGoogleLoading(false);
      }
    } else {
      console.log('Google Native Sign-In not supported in this environment (e.g. Expo Go). Opening simulated Dev Accounts.');
      setShowGamerChooser(true);
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <ScrollView 
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            alwaysBounceVertical={true}
          >
            {!isKeyboardVisible && <View className="flex-1" />}
            {/* Left-aligned Welcome Header (Single Line) */}
            <View className="mb-4 mt-2 px-1 self-start">
              <Text 
                className="text-xl font-black text-violet-650 dark:text-violet-400 uppercase tracking-widest"
                style={{
                  textShadowColor: 'rgba(139, 92, 246, 0.35)',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 6,
                }}
              >
                Welcome to Sign Up
              </Text>
            </View>

            <GlassCard className="mb-4 p-3.5" glowColor="purple">
              {(localError || authError) && (
                <View 
                  className="border rounded-xl p-3 mb-3"
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

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Input
                    label="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    className="mb-2.5"
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label="Last Name (Optional)"
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                    className="mb-2.5"
                  />
                </View>
              </View>

              <Input
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                className="mb-2.5"
              />

              <Input
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                className="mb-2.5"
              />

              <Input
                label="Phone Number"
                value={phone}
                onChangeText={text => {
                  // Allow numbers and optionally a single + at the start
                  const cleaned = text.replace(/[^0-9+]/g, '');
                  setPhone(cleaned);
                }}
                placeholder="e.g. 9876543210 or +919876543210"
                keyboardType="phone-pad"
                className="mb-2.5"
              />

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Input
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                    className="mb-2.5"
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label="Confirm"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm"
                    secureTextEntry
                    className="mb-2.5"
                  />
                </View>
              </View>

              {/* Promo Code Input with APPLY Button */}
              <View className="mb-4 w-full">
                <Text className="text-slate-400 text-xs font-extrabold mb-1.5 ml-0.5 uppercase tracking-widest">
                  Promo Code (Optional)
                </Text>
                <View 
                  className="flex-row items-center rounded-xl px-4"
                  style={{
                    backgroundColor: isDark ? '#0A0E1A' : '#F1F5F9',
                    borderWidth: 1.5,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                    paddingVertical: 2,
                  }}
                >
                  <TextInput
                    value={referralCode}
                    onChangeText={setReferralCode}
                    placeholder="Promo Code (Optional)"
                    placeholderTextColor="rgba(148, 163, 184, 0.4)"
                    style={{ 
                      flex: 1, 
                      color: isDark ? '#ffffff' : '#000000', 
                      fontSize: 14, 
                      paddingVertical: 9,
                      letterSpacing: 0.3,
                    }}
                    autoCapitalize="none"
                  />
                  {referralCode.trim().length > 0 && (
                    <Pressable 
                      onPress={() => Alert.alert('Promo Code', 'Promo code successfully applied!')}
                      className="bg-amber-500 rounded-lg px-3 py-1.5 ml-2"
                    >
                      <Text className="text-slate-950 font-black text-[9px] uppercase tracking-wider">APPLY</Text>
                    </Pressable>
                  )}
                </View>
              </View>

              {/* Agreement Consent text */}
              <View className="items-center mt-1 mb-3">
                <Text className="text-slate-400 text-[10px] text-center font-bold leading-relaxed">
                  By Registering, I agree to BattleZone's{'\n'}
                  <Text 
                    onPress={() => navigation.navigate('Terms')}
                    className="text-amber-500 font-extrabold underline"
                  >
                    Terms and Conditions
                  </Text>
                  {' '}<Text className="font-bold text-slate-400">and</Text>{' '}
                  <Text 
                    onPress={() => navigation.navigate('Privacy')}
                    className="text-amber-500 font-extrabold underline"
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </View>

              <Button
                title="Sign Up"
                onPress={handleRegisterSubmit}
                loading={loading}
              />
            </GlassCard>

            {/* Footer section matching Gampley design */}
            <View className="items-center w-full py-1 mb-4">
              <View className="flex-row justify-center items-center mb-3">
                <Text className="text-slate-400 text-xs font-bold">Already have an account? </Text>
                <Pressable onPress={() => navigation.navigate('Login')}>
                  <Text className="text-amber-500 font-black text-xs uppercase tracking-wider">Login</Text>
                </Pressable>
              </View>

              <Text className="text-slate-500 text-[9px] font-extrabold uppercase tracking-widest mb-3">
                or SignUp
              </Text>

              {/* Google Sign-In Button */}
              <Pressable
                onPress={handleGoogleLoginPress}
                disabled={googleLoading}
                className="w-full py-3.5 border rounded-xl flex-row items-center justify-center"
                style={({ pressed }) => [
                  {
                    backgroundColor: isDark 
                      ? (pressed ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)')
                      : (pressed ? 'rgba(0, 0, 0, 0.05)' : '#ffffff'),
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  }
                ]}
              >
                {googleLoading ? (
                  <ActivityIndicator size="small" color="#7C3AED" />
                ) : (
                  <View className="flex-row items-center justify-center">
                    <GoogleIcon size={16} style={{ marginRight: 8 }} />
                    <Text className="text-slate-750 dark:text-white font-extrabold text-xs uppercase tracking-wider">
                      Continue with Google
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
            {!isKeyboardVisible && <View className="flex-1" />}
            {isKeyboardVisible && <View style={{ height: 420 }} />}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* Mock Google Account Chooser Modal */}
      <Modal
        visible={showGamerChooser}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={() => setShowGamerChooser(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View className="bg-white dark:bg-[#0A0E1A] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Google Dev Accounts
              </Text>
              <Pressable onPress={() => setShowGamerChooser(false)} className="p-1">
                <Text className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase">Close</Text>
              </Pressable>
            </View>

            <Text className="text-slate-500 dark:text-slate-400 text-xs mb-5 leading-relaxed">
              Choose one of these simulated esports profiles to instantly test Google registration on mobile:
            </Text>

            <View className="gap-3">
              {MOCK_GAMERS.map((gamer) => (
                <Pressable
                  key={gamer.id}
                  onPress={() => handleSelectMockGamer(gamer)}
                  className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 flex-row items-center"
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? 'rgba(0, 229, 255, 0.1)' : undefined,
                    }
                  ]}
                >
                  <Image
                    source={{ uri: gamer.avatar }}
                    className="w-10 h-10 rounded-full bg-slate-200 dark:bg-black/20 mr-3"
                  />
                  <View className="flex-1">
                    <Text className="font-extrabold text-xs text-slate-900 dark:text-white">{gamer.name}</Text>
                    <Text className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{gamer.email}</Text>
                    <Text className="text-[9px] uppercase tracking-wide font-extrabold mt-1" style={{ color: gamer.color }}>
                      {gamer.title}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
