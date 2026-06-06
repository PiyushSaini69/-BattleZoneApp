import React, { useState, useContext } from 'react';
import { ScrollView, View, Text, Pressable, Modal, Image, ActivityIndicator, NativeModules } from 'react-native';
import { useColorScheme } from 'nativewind';
import { CONFIG } from '../../config';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';

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
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=ninja",
    title: "Fortnite Esports Legend",
    color: "#3B82F6"
  },
  {
    id: "g2",
    googleId: "2233445566",
    name: "Shroud (Michael Grzesiek)",
    email: "shroud@battlezone.gg",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=shroud",
    title: "FPS Aim God & Free Fire Pro",
    color: "#475569"
  },
  {
    id: "g3",
    googleId: "3344556677",
    name: "Valkyrae (Rachell)",
    email: "valkyrae@battlezone.gg",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=valkyrae",
    title: "Esports Queen & Co-Owner",
    color: "#F43F5E"
  },
  {
    id: "g4",
    googleId: "4455667788",
    name: "S1mple (Oleksandr)",
    email: "s1mple@battlezone.gg",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=s1mple",
    title: "CS:GO GOAT & MVP Champion",
    color: "#F59E0B"
  }
];

export default function LoginScreen({ navigation }) {
  const { login, googleLogin, authError, setAuthError } = useContext(AuthContext);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [showGamerChooser, setShowGamerChooser] = useState(false);

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
        // Fallback to dev chooser if it is a developer setup/SHA-1 configuration issue
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
    <ScrollView className="flex-1 bg-slate-50 dark:bg-[#0B0F1A]" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
      <View className="items-center mb-8">
        <Image 
          source={isDark ? require('../../../assets/logolight.jpeg') : require('../../../assets/logodark.jpeg')}
          style={{ width: 180, height: 50 }}
          resizeMode="contain"
        />
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
            {((localError || authError || '').toLowerCase().includes('verify your email')) && (
              <Pressable 
                onPress={() => navigation.navigate('VerifyEmail', { email })}
                className="mt-2 py-2 items-center bg-cyan-500/10 border border-cyan-500/20 rounded-lg"
              >
                <Text className="text-[#06B6D4] text-[10px] font-bold uppercase tracking-widest">
                  ⚡ Click here to verify email
                </Text>
              </Pressable>
            )}
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
          <Text className="text-purple-600 dark:text-purple-400 font-semibold text-xs">Forgot Password?</Text>
        </Pressable>

        <Button
          title="Sign In"
          onPress={handleLoginSubmit}
          loading={loading}
        />

        {/* Google Login Divider and Button */}
        <View className="relative my-5 items-center justify-center flex-row">
          <View className="w-full border-t border-slate-200 dark:border-white/10 absolute"></View>
          <Text className="px-3 text-[9px] font-bold uppercase tracking-widest bg-slate-50 dark:bg-[#111827] text-slate-400 z-10">
            OR SECURE CONNECT
          </Text>
        </View>

        <Pressable
          onPress={handleGoogleLoginPress}
          disabled={googleLoading}
          className="w-full py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex-row items-center justify-center transition"
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? 'rgba(0,0,0,0.05)' : 'transparent',
            }
          ]}
        >
          {googleLoading ? (
            <ActivityIndicator size="small" color="#7C3AED" />
          ) : (
            <View className="flex-row items-center justify-center">
              <View className="mr-2 border border-red-500/20 bg-red-500/10 w-5 h-5 rounded-full items-center justify-center">
                <Text className="text-red-500 font-bold text-[10px]">G</Text>
              </View>
              <Text className="text-slate-700 dark:text-white font-bold text-xs uppercase tracking-wider">
                Continue with Google
              </Text>
            </View>
          )}
        </Pressable>
      </GlassCard>

      <View className="flex-row justify-center items-center py-4">
        <Text className="text-slate-600 dark:text-slate-400 text-sm">Don't have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text className="text-[#7C3AED] font-bold text-sm">Sign Up</Text>
        </Pressable>
      </View>

      {/* Mock Google Account Chooser Modal */}
      <Modal
        visible={showGamerChooser}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={() => setShowGamerChooser(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View className="bg-white dark:bg-[#0B0F1A] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Google Dev Accounts
              </Text>
              <Pressable onPress={() => setShowGamerChooser(false)} className="p-1">
                <Text className="text-slate-400 font-bold text-xs uppercase">Close</Text>
              </Pressable>
            </View>

            <Text className="text-slate-500 dark:text-slate-400 text-xs mb-5 leading-relaxed">
              Choose one of these simulated esports profiles to instantly test Google authentication & onboarding on mobile:
            </Text>

            <View className="gap-3">
              {MOCK_GAMERS.map((gamer) => (
                <Pressable
                  key={gamer.id}
                  onPress={() => handleSelectMockGamer(gamer)}
                  className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 flex-row items-center"
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? 'rgba(124, 58, 237, 0.1)' : undefined,
                    }
                  ]}
                >
                  <Image
                    source={{ uri: gamer.avatar }}
                    className="w-10 h-10 rounded-full bg-slate-200 dark:bg-black/20 mr-3"
                  />
                  <View className="flex-1">
                    <Text className="font-bold text-xs text-slate-900 dark:text-white">{gamer.name}</Text>
                    <Text className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{gamer.email}</Text>
                    <Text className="text-[9px] uppercase tracking-wide font-semibold mt-1" style={{ color: gamer.color }}>
                      {gamer.title}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
