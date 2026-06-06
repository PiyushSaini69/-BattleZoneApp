import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import GlassCard from '../../components/ui/GlassCard';
import { useColorScheme } from 'nativewind';

export default function PrivacyScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-slate-200/60 dark:border-white/5">
          <Pressable 
            onPress={() => navigation.goBack()}
            className="p-2 mr-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 active:bg-slate-200 active:dark:bg-white/10"
          >
            <ArrowLeft size={18} color={isDark ? '#00E5FF' : '#7C3AED'} />
          </Pressable>
          <Text className="text-slate-900 dark:text-white text-base font-black uppercase tracking-widest">
            Privacy Policy
          </Text>
        </View>

        {/* Content */}
        <ScrollView 
          className="flex-1 px-4" 
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <GlassCard glowColor="purple" className="p-5">
            <Text className="text-slate-700 dark:text-slate-300 text-xs mb-4 leading-relaxed">
              At BattleZone, we value your privacy and are committed to protecting your personal data. This Privacy Policy details how we collect, use, and share your information when you use our esports mobile app.
            </Text>

            <View className="mb-5 border-t border-slate-200/60 dark:border-white/5 pt-4">
              <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide mb-2">
                1. Information We Collect
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-2">
                • **Account Data:** When you sign up, we collect your first name, last name, username, email, phone number, and password.
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-2">
                • **Google Sign-In:** If you link your account with Google, we access basic profile details such as your Google ID, name, email address, and avatar image.
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                • **Transaction Data:** We record your entry fee payments, match wins, coin conversions, and withdrawal history.
              </Text>
            </View>

            <View className="mb-5 border-t border-slate-200/60 dark:border-white/5 pt-4">
              <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide mb-2">
                2. How We Use Your Information
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-2">
                • To verify your identity and manage esports tournament sign-ups and bracket listings.
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-2">
                • To process transaction details and facilitate payouts for leaderboard or tournament winners.
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                • To detect, investigate, and prevent cheating, multi-accounting, and anti-cheat guidelines violations.
              </Text>
            </View>

            <View className="mb-5 border-t border-slate-200/60 dark:border-white/5 pt-4">
              <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide mb-2">
                3. Sharing Your Information
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-2">
                • **Leaderboards & Brackets:** Your username and in-game statistics are visible publicly on global leaderboards and tournament brackets.
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                • **Legal Obligations:** We may share details if required by law or to protect against fraud or security vulnerabilities.
              </Text>
            </View>

            <View className="mb-5 border-t border-slate-200/60 dark:border-white/5 pt-4">
              <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide mb-2">
                4. Data Security
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                • We implement standard industry security protocols (SSL/TLS, passwords hashing, and tokenized session store) to protect your personal details against unauthorized access.
              </Text>
            </View>

            <View className="border-t border-slate-200/60 dark:border-white/5 pt-4">
              <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide mb-2">
                5. Your Data Rights
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                • You can update your profile information in the app or contact support to request deletion of your account and related data at any time.
              </Text>
            </View>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
