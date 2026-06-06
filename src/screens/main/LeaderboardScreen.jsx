import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl, useColorScheme as useRNColorScheme } from 'react-native';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Header from '../../components/ui/Header';
import { Trophy, Award } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

export default function LeaderboardScreen({ navigation }) {
  const { colorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const isDark = colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';
  const [leaderboard, setLeaderboard] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState('alltime'); // daily, weekly, monthly, alltime
  const [metric, setMetric] = useState('points'); // points, earnings, kills

  const periodFilters = [
    { label: 'All-Time', value: 'alltime' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Weekly', value: 'weekly' },
  ];

  const metricFilters = [
    { label: 'Points', value: 'points' },
    { label: 'Earnings', value: 'earnings' },
    { label: 'Kills', value: 'kills' },
  ];

  const fetchLeaderboard = async () => {
    try {
      const res = await request(`/leaderboard?period=${period}&metric=${metric}`);
      if (res.success) {
        setLeaderboard(res.data);
      }
    } catch (e) {
      console.log('Error fetching leaderboard:', e.message);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [period, metric]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard();
    setRefreshing(false);
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1: return '#FBBF24'; // Gold
      case 2: return '#E2E8F0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#1E293B'; // Dark Slate
    }
  };

  const getRankGlowColor = (rank) => {
    switch (rank) {
      case 1: return 'purple';
      case 2: return 'cyan';
      case 3: return 'magenta';
      default: return undefined;
    }
  };

  const renderItem = ({ item, index }) => {
    const rank = index + 1;
    const isTopThree = rank <= 3;

    return (
      <GlassCard 
        className="mb-3 py-3.5 px-4 flex-row items-center justify-between"
        glowColor={getRankGlowColor(rank)}
      >
        <View className="flex-row items-center">
          <View 
            className="w-8 h-8 rounded-full justify-center items-center mr-3"
            style={{ 
              backgroundColor: getRankBadgeColor(rank),
              shadowColor: getRankBadgeColor(rank),
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: isTopThree ? 0.6 : 0,
              shadowRadius: 6,
              elevation: isTopThree ? 3 : 0,
            }}
          >
            {rank === 1 ? (
              <Trophy size={14} color="#000" />
            ) : (
              <Text className={`font-black text-xs ${isTopThree ? 'text-black' : 'text-slate-700 dark:text-slate-300'}`}>
                {rank}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-slate-900 dark:text-white font-extrabold text-sm">{item.username}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] uppercase font-bold tracking-wide mt-0.5">
              Ranked #{rank}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-violet-600 dark:text-violet-400 text-base font-black">
            {metric === 'earnings' ? `₹${item.earnings}` : metric === 'kills' ? `${item.kills} Kills` : `${item.points} pts`}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase font-bold tracking-wider mt-0.5">{metric}</Text>
        </View>
      </GlassCard>
    );
  };

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      <View className="px-4">
        <Header navigation={navigation} />
      </View>
      <View className="px-4 pb-3 border-b border-slate-200 dark:border-slate-900 bg-transparent">
        <View className="flex-row justify-between mb-3">
          {periodFilters.map((p) => (
            <Pressable
              key={p.value}
              onPress={() => setPeriod(p.value)}
              className={`flex-1 mx-1 py-2.5 rounded-xl border items-center ${
                period === p.value 
                  ? 'bg-violet-600 border-violet-500' 
                  : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-900'
              }`}
              style={period === p.value ? {
                shadowColor: '#8B5CF6',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 5,
                elevation: 3,
              } : {}}
            >
              <Text className={`text-[9px] font-black uppercase tracking-wider ${period === p.value ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="flex-row justify-between">
          {metricFilters.map((m) => (
            <Pressable
              key={m.value}
              onPress={() => setMetric(m.value)}
              className={`flex-1 mx-1 py-2 rounded-xl border items-center ${
                metric === m.value 
                  ? 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/40' 
                  : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-900'
              }`}
            >
              <Text className={`text-[8px] font-black uppercase tracking-widest ${metric === m.value ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {m.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item._id || item.username}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={isDark ? "#00E5FF" : "#7C3AED"} 
            colors={[isDark ? "#00E5FF" : "#7C3AED"]} 
            progressBackgroundColor={isDark ? "#0A0E1A" : "#FFFFFF"}
          />
        }
        ListHeaderComponent={
          leaderboard.length > 0 ? (
            <View className="mb-4 flex-row items-center px-1">
              <Award size={16} color="#94A3B8" style={{ marginRight: 6 }} />
              <Text className="text-slate-900 dark:text-white font-extrabold text-xs uppercase tracking-widest">Top Warriors Ranked</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View className="py-20 items-center">
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold">No ranks computed for this period.</Text>
          </View>
        }
      />
    </LinearGradient>
  );
}
