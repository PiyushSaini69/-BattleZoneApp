import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import GlassCard from '../../components/ui/GlassCard';
import { useColorScheme } from 'nativewind';

export default function TermsScreen({ navigation }) {
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
            Terms & Conditions
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
              Welcome to BattleZone. By accessing or using our mobile application, you agree to comply with and be bound by these Terms and Conditions. Please review them carefully.
            </Text>

            <View className="mb-5 border-t border-slate-200/60 dark:border-white/5 pt-4">
              <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide mb-2">
                1. Eligibility & Accounts
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-2">
                • You must be at least 18 years old or the legal age of majority in your jurisdiction to participate in cash tournaments.
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-2">
                • You are responsible for maintaining the confidentiality of your credentials and account information.
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                • Multiple accounts owned by the same user to manipulate leaderboard points or match entries are strictly prohibited.
              </Text>
            </View>

            <View className="mb-5 border-t border-slate-200/60 dark:border-white/5 pt-4">
              <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide mb-2">
                2. Code of Conduct & Fair Play
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-2">
                • Cheating, hacking, exploiting glitches, teaming, or engaging in any form of unsportsmanlike behavior will result in an immediate and permanent account ban.
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                • Harassment, hate speech, or abuse targeted towards other warriors, admins, or support personnel will not be tolerated.
              </Text>
            </View>

            <View className="mb-5 border-t border-slate-200/60 dark:border-white/5 pt-4">
              <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide mb-2">
                3. Wallet, Deposits & Withdrawals
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-2">
                • Any funds deposited into the BattleZone wallet must be used to enter tournaments. Deposits are non-refundable.
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-2">
                • Withdrawals of winnings are subject to verification checkups. KYC documents may be requested at any time.
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                • If an account is suspended or banned due to cheating or violating fair play guidelines, all associated wallet balances will be forfeited.
              </Text>
            </View>

            <View className="mb-5 border-t border-slate-200/60 dark:border-white/5 pt-4">
              <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide mb-2">
                4. Tournament Disclaimers
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-2">
                • BattleZone is not responsible for network latency, server disconnects, game bugs, or other technical issues faced by users during live matches.
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                • Results declared by BattleZone match moderators based on submitted game screenshots and logs are final and binding.
              </Text>
            </View>

            <View className="border-t border-slate-200/60 dark:border-white/5 pt-4">
              <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide mb-2">
                5. Limitation of Liability
              </Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                • BattleZone is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted access or claim liability for any direct or indirect losses resulting from the use of the platform.
              </Text>
            </View>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
