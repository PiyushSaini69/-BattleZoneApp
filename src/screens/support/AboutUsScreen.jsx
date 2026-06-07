import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Trophy, Shield, Zap, BarChart3, Users } from 'lucide-react-native';
import GlassCard from '../../components/ui/GlassCard';
import { useColorScheme } from 'nativewind';

export default function AboutUsScreen({ navigation }) {
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
            About Us
          </Text>
        </View>

        {/* Content */}
        <ScrollView 
          className="flex-1 px-4" 
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Hero Card */}
          <GlassCard glowColor="cyan" className="p-5 mb-5">
            <Text className="text-sky-500 dark:text-sky-400 font-black text-xl uppercase tracking-wider mb-2">
              BATTLE ZONE
            </Text>
            <Text className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
              BattleZone is the ultimate competitive arena designed for mobile gamers. We provide a seamless and secure environment to compete in daily esports tournaments, challenge top players, track your career statistics, and earn premium rewards. Whether you are a casual player looking to improve or a professional striving to dominate, BattleZone is your battlefield.
            </Text>
          </GlassCard>

          {/* Mission Card */}
          <GlassCard glowColor="purple" className="p-5 mb-5">
            <View className="flex-row items-center mb-3">
              <Users size={18} color={isDark ? '#D8B4FE' : '#7C3AED'} />
              <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide ml-2">
                Our Mission
              </Text>
            </View>
            <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Our mission is to democratize mobile esports. We believe that every passionate gamer deserves a platform to exhibit their talent, gain recognition, and compete in a transparent and fair environment. We are building the infrastructure to empower the next generation of esports athletes.
            </Text>
          </GlassCard>

          {/* Key Features Section */}
          <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest ml-1 mb-3">
            Core Pillars
          </Text>

          {/* Feature: Tournaments */}
          <View className="bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-4 mb-3 flex-row items-start">
            <View className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl mr-3">
              <Trophy size={16} color="#F59E0B" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 dark:text-white font-black text-xs uppercase mb-1">
                Elite Tournaments
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Compete in diverse match modes and tournament types daily. Prove your mettle against other warriors and take home your share of grand prize pools.
              </Text>
            </View>
          </View>

          {/* Feature: Fair Play */}
          <View className="bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-4 mb-3 flex-row items-start">
            <View className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl mr-3">
              <Shield size={16} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 dark:text-white font-black text-xs uppercase mb-1">
                Fair Play & Anti-Cheat
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Zero tolerance for cheating. Our active moderators and verification protocols ensure that all scores and results represent pure, unfiltered gaming skill.
              </Text>
            </View>
          </View>

          {/* Feature: Stats */}
          <View className="bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-4 mb-3 flex-row items-start">
            <View className="p-2 bg-sky-50 dark:bg-sky-950/30 rounded-xl mr-3">
              <BarChart3 size={16} color="#0EA5E9" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 dark:text-white font-black text-xs uppercase mb-1">
                Real-Time Statistics
              </Text>
              <View className="flex-1">
                <Text className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Keep tabs on your tournament history, overall K/D ratios, match placements, and coins won. Watch your performance graph grow as you master your game.
                </Text>
              </View>
            </View>
          </View>

          {/* Feature: Fast Rewards */}
          <View className="bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-4 mb-5 flex-row items-start">
            <View className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-xl mr-3">
              <Zap size={16} color="#8B5CF6" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 dark:text-white font-black text-xs uppercase mb-1">
                Instant Redeems
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Earn coins directly from tournament placements and redeem them swiftly via our wallet system. Your achievements are directly turned into rewards.
              </Text>
            </View>
          </View>

          {/* Footer Info */}
          <View className="items-center justify-center mt-2">
            <Text className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-wider">
              BattleZone App v1.0.0
            </Text>
            <Text className="text-slate-350 dark:text-slate-700 text-[9px] font-extrabold mt-1 text-center">
              © {new Date().getFullYear()} BattleZone. All Rights Reserved.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
