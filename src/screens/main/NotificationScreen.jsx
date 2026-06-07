import React, { useContext } from 'react';
import { View, Text, ScrollView, Pressable, useColorScheme as useRNColorScheme } from 'react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Bell, Calendar, Trophy, Wallet, ShieldAlert } from 'lucide-react-native';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';

export default function NotificationScreen({ navigation }) {
  const { colorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const isDark = colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';

  const MOCK_NOTIFICATIONS = [
    {
      id: '1',
      title: '🎉 Welcome Bonus Credited!',
      content: 'Your wallet has been credited with ₹10 welcome bonus cash. Start registering for solo matches now!',
      time: '10 mins ago',
      type: 'bonus',
      icon: <Wallet size={16} color="#10B981" />
    },
    {
      id: '2',
      title: '🛡️ Account Verified Successfully',
      content: 'Your mobile phone and email identity checks are completed. Enjoy unrestricted withdrawals.',
      time: '2 hours ago',
      type: 'security',
      icon: <Calendar size={16} color="#8B5CF6" />
    },
    {
      id: '3',
      title: '⚔️ New Free Fire Tournament Open',
      content: 'Register for the FF-Solo Clash Squad premium league. Spots are filling up fast!',
      time: '1 day ago',
      type: 'game',
      icon: <Trophy size={16} color="#00E5FF" />
    },
    {
      id: '4',
      title: '⚠️ Fair Play Reminder',
      content: 'Any type of hacking, teaming up, or scripting will lead to a permanent profile ban and wallet lock.',
      time: '3 days ago',
      type: 'warning',
      icon: <ShieldAlert size={16} color="#EF4444" />
    }
  ];

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      <View 
        className="flex-row items-center justify-between p-4 border-b"
        style={{
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          paddingTop: 50,
        }}
      >
        <Pressable 
          onPress={() => navigation.goBack()}
          className="p-2 bg-slate-200 dark:bg-slate-900 rounded-full border"
          style={{
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
          }}
        >
          <ArrowLeft size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </Pressable>
        <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-widest">
          Notifications
        </Text>
        <View className="w-9" />
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {MOCK_NOTIFICATIONS.length === 0 ? (
          <View className="py-20 items-center">
            <Bell size={40} color={isDark ? 'rgba(255, 255, 255, 0.15)' : '#94A3B8'} style={{ marginBottom: 12 }} />
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
              No new alerts at the moment.
            </Text>
          </View>
        ) : (
          MOCK_NOTIFICATIONS.map((n) => (
            <GlassCard 
              key={n.id} 
              className="mb-4 p-4 flex-row items-start"
              glowColor={n.type === 'warning' ? 'red' : n.type === 'game' ? 'cyan' : 'purple'}
            >
              <View 
                className="p-2.5 rounded-xl mr-3.5 bg-slate-200/50 dark:bg-slate-900/60 border"
                style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' }}
              >
                {n.icon}
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-slate-900 dark:text-white font-extrabold text-xs uppercase tracking-wide">
                    {n.title}
                  </Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-[8px] font-bold">
                    {n.time}
                  </Text>
                </View>
                <Text className="text-slate-650 dark:text-slate-400 text-xs leading-relaxed">
                  {n.content}
                </Text>
              </View>
            </GlassCard>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}
