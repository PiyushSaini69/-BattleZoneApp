import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import { Trophy, Award } from 'lucide-react-native';

export default function LeaderboardScreen() {
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
      case 2: return '#94A3B8'; // Silver
      case 3: return '#B45309'; // Bronze
      default: return '#1E293B'; // Slate
    }
  };

  const renderItem = ({ item, index }) => {
    const rank = index + 1;
    const isTopThree = rank <= 3;

    return (
      <GlassCard 
        className={`mb-3 py-3 px-4 flex-row items-center justify-between border-white/5 ${
          rank === 1 ? 'bg-purple-900/10 border-purple-500/20' : 'bg-slate-900/40'
        }`}
      >
        <View className="flex-row items-center">
          <View 
            className="w-7 h-7 rounded-full justify-center items-center mr-3"
            style={{ backgroundColor: getRankBadgeColor(rank) }}
          >
            {rank === 1 ? (
              <Trophy size={14} color="#000" />
            ) : (
              <Text className={`font-black text-xs ${isTopThree ? 'text-black' : 'text-slate-350'}`}>
                {rank}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-white font-extrabold text-sm">{item.username}</Text>
            <Text className="text-slate-450 text-[9px] uppercase font-bold mt-0.5">
              Ranked #{rank}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-[#C084FC] text-base font-black">
            {metric === 'earnings' ? `₹${item.earnings}` : metric === 'kills' ? `${item.kills} Kills` : `${item.points} pts`}
          </Text>
          <Text className="text-slate-450 text-[8px] uppercase font-bold mt-0.5">{metric}</Text>
        </View>
      </GlassCard>
    );
  };

  return (
    <View className="flex-1 bg-[#0B0F1A]">
      <View className="p-4 border-b border-slate-900 bg-[#0B0F1A]">
        <View className="flex-row justify-between mb-3">
          {periodFilters.map((p) => (
            <Pressable
              key={p.value}
              onPress={() => setPeriod(p.value)}
              className={`flex-1 mx-1 py-2 rounded-xl border items-center ${
                period === p.value ? 'bg-[#7C3AED] border-purple-500' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <Text className={`text-[9px] font-bold uppercase tracking-wider ${period === p.value ? 'text-white' : 'text-slate-450'}`}>
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
              className={`flex-1 mx-1 py-1.5 rounded-xl border items-center ${
                metric === m.value ? 'bg-[#7C3AED]/20 border-purple-500/50' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <Text className={`text-[8px] font-extrabold uppercase tracking-widest ${metric === m.value ? 'text-purple-300' : 'text-slate-450'}`}>
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
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" colors={["#7C3AED"]} />
        }
        ListHeaderComponent={
          leaderboard.length > 0 ? (
            <View className="mb-4 flex-row items-center">
              <Award size={16} color="#94A3B8" style={{ marginRight: 6 }} />
              <Text className="text-white font-extrabold text-xs uppercase tracking-wider">Top Warriors Ranked</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View className="py-20 items-center">
            <Text className="text-slate-450 text-xs font-semibold">No ranks computed for this period.</Text>
          </View>
        }
      />
    </View>
  );
}
