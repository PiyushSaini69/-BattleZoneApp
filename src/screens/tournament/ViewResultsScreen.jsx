import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import { ArrowLeft, Trophy } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const GoldCoin = ({ size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
    <Circle cx="12" cy="12" r="7" fill="none" stroke="#FEF08A" strokeWidth="1" strokeDasharray="2 1" />
    <SvgText
      x="12"
      y="15.5"
      fontSize="10"
      fontWeight="900"
      fill="#FEF08A"
      textAnchor="middle"
    >
      C
    </SvgText>
  </Svg>
);

export default function ViewResultsScreen({ route, navigation }) {
  const { tournamentId, slug, title } = route.params;
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const [participants, setParticipants] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadResults = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch tournament details to check resultsDeclared status
      const tournRes = await request(`/tournaments/${slug}`);
      let resultsDeclared = false;
      if (tournRes.success && tournRes.data?.tournament) {
        setTournament(tournRes.data.tournament);
        resultsDeclared = tournRes.data.tournament.resultsDeclared;
      }
      
      // 2. Only fetch participants if results are declared
      if (resultsDeclared) {
        const res = await request(`/tournaments/${tournamentId}/participants`);
        if (res.success) {
          const sorted = [...res.data].sort((a, b) => {
            const rA = a.rank || 999;
            const rB = b.rank || 999;
            if (rA !== rB) return rA - rB;
            return (b.points || 0) - (a.points || 0);
          });
          setParticipants(sorted);
        } else {
          Alert.alert('Error', 'Failed to load results.');
        }
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, [tournamentId, slug]);

  const rank1 = participants.find(p => p.rank === 1);
  const rank2 = participants.find(p => p.rank === 2);
  const rank3 = participants.find(p => p.rank === 3);

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      {/* Header */}
      <View style={{ height: insets.top }} />
      <View className="bg-white/80 dark:bg-slate-950/40 px-4 py-3 border-b border-slate-200 dark:border-slate-900/60 flex-row items-center justify-between">
        <Pressable 
          onPress={() => navigation.goBack()} 
          className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <ArrowLeft size={18} color={isDark ? '#E2E8F0' : '#1E293B'} />
        </Pressable>
        <View className="items-center flex-1 mx-4">
          <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide text-center" numberOfLines={1}>
            Match Results
          </Text>
          <Text className="text-rose-500 dark:text-rose-400 text-[9px] uppercase font-bold tracking-widest mt-0.5" numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View className="w-9" />
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={isDark ? '#00E5FF' : '#7C3AED'} />
          <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-4">Syncing leaderboard...</Text>
        </View>
      ) : tournament && !tournament.resultsDeclared ? (
        // Pending Results UI
        <View className="flex-1 justify-center items-center px-6">
          <GlassCard className="p-8 items-center w-full max-w-sm" glowColor="purple">
            <View className="bg-purple-500/10 dark:bg-purple-500/20 p-4 rounded-full mb-4 animate-pulse">
              <Trophy size={48} color={isDark ? '#00E5FF' : '#7C3AED'} />
            </View>
            <Text className="text-slate-900 dark:text-white font-black text-lg text-center uppercase tracking-wider">
              Result Declaring Soon
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-xs text-center font-medium mt-3 leading-relaxed">
              The tournament administrators are currently compiling and validating the final match results.
            </Text>
            <Text className="text-rose-500 dark:text-rose-400 text-[10px] text-center font-black uppercase tracking-widest mt-4">
              Rankings & winnings will display here shortly!
            </Text>
            
            <Pressable
              onPress={loadResults}
              className="mt-6 w-full py-3 bg-purple-600 dark:bg-purple-500 rounded-xl items-center justify-center"
              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
            >
              <Text className="text-white font-black text-xs uppercase tracking-wider font-extrabold">REFRESH</Text>
            </Pressable>
          </GlassCard>
        </View>
      ) : (
        <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
          {/* Podium section */}
          {(rank1 || rank2 || rank3) && (
            <View className="flex-row items-end justify-center mb-6 mt-2" style={{ gap: 8 }}>
              {/* Rank 2 */}
              {rank2 ? (
                <View className="flex-1 items-center">
                  <GlassCard className="p-3 items-center w-full" glowColor="cyan">
                    <Trophy size={22} color="#94A3B8" />
                    <Text className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase mt-1">2ND RANK</Text>
                    <Text className="text-slate-900 dark:text-white font-extrabold text-xs mt-1 text-center" numberOfLines={1}>{rank2.displayName || rank2.username}</Text>
                    {rank2.prizeWon > 0 && (
                      <View className="flex-row items-center mt-1">
                        <GoldCoin size={10} />
                        <Text className="text-emerald-500 text-[10px] font-black ml-0.5">+{rank2.prizeWon}</Text>
                      </View>
                    )}
                  </GlassCard>
                  <View className="h-10 bg-slate-400/20 dark:bg-slate-800/40 w-12 rounded-t-lg mt-1 items-center justify-center">
                    <Text className="text-slate-400 font-extrabold text-sm">2</Text>
                  </View>
                </View>
              ) : <View className="flex-1" />}

              {/* Rank 1 */}
              {rank1 ? (
                <View className="flex-[1.2] items-center z-10">
                  <GlassCard className="p-4 items-center w-full border border-yellow-500/20" glowColor="yellow">
                    <Trophy size={30} color="#F59E0B" />
                    <Text className="text-[10px] font-black text-yellow-500 uppercase mt-1">CHAMPION</Text>
                    <Text className="text-slate-900 dark:text-white font-extrabold text-sm mt-1 text-center" numberOfLines={1}>{rank1.displayName || rank1.username}</Text>
                    {rank1.prizeWon > 0 && (
                      <View className="flex-row items-center mt-1">
                        <GoldCoin size={11} />
                        <Text className="text-emerald-500 text-xs font-black ml-0.5">+{rank1.prizeWon}</Text>
                      </View>
                    )}
                  </GlassCard>
                  <View className="h-14 bg-yellow-500/10 dark:bg-yellow-500/20 w-14 rounded-t-lg mt-1 items-center justify-center border-t border-x border-yellow-500/30">
                    <Text className="text-yellow-500 font-black text-base">1</Text>
                  </View>
                </View>
              ) : <View className="flex-[1.2]" />}

              {/* Rank 3 */}
              {rank3 ? (
                <View className="flex-1 items-center">
                  <GlassCard className="p-3 items-center w-full" glowColor="red">
                    <Trophy size={22} color="#B45309" />
                    <Text className="text-[10px] font-black text-amber-700 dark:text-amber-600 uppercase mt-1">3RD RANK</Text>
                    <Text className="text-slate-900 dark:text-white font-extrabold text-xs mt-1 text-center" numberOfLines={1}>{rank3.displayName || rank3.username}</Text>
                    {rank3.prizeWon > 0 && (
                      <View className="flex-row items-center mt-1">
                        <GoldCoin size={10} />
                        <Text className="text-emerald-500 text-[10px] font-black ml-0.5">+{rank3.prizeWon}</Text>
                      </View>
                    )}
                  </GlassCard>
                  <View className="h-7 bg-amber-700/10 dark:bg-amber-700/20 w-12 rounded-t-lg mt-1 items-center justify-center">
                    <Text className="text-amber-700 dark:text-amber-600 font-extrabold text-sm">3</Text>
                  </View>
                </View>
              ) : <View className="flex-1" />}
            </View>
          )}

          {/* Full Leaderboard List */}
          <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-widest px-0.5 mb-2">Rankings Leaderboard</Text>
          <GlassCard className="p-4" glowColor="purple">
            {participants.length === 0 ? (
              <Text className="text-slate-500 text-xs font-semibold text-center py-6">No participants found.</Text>
            ) : (
              participants.map((player, idx) => (
                <View 
                  key={player.slotNumber} 
                  className={`flex-row justify-between items-center py-3.5 ${
                    idx === participants.length - 1 ? '' : 'border-b border-slate-100 dark:border-slate-800/60'
                  }`}
                >
                  <View className="flex-row items-center flex-1 mr-2">
                    <Text className="text-rose-500 dark:text-cyan-400 font-black text-xs w-6">#{player.rank || '-'}</Text>
                    <View>
                      <Text className="text-slate-800 dark:text-slate-200 font-black text-sm">{player.displayName}</Text>
                      <Text className="text-slate-400 text-[9px] font-bold uppercase mt-0.5">Slot #{player.slotNumber}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center" style={{ gap: 12 }}>
                    <View className="items-end">
                      <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase">KILLS</Text>
                      <Text className="text-slate-900 dark:text-white font-black text-xs mt-0.5">{player.kills || 0}</Text>
                    </View>
                    {player.prizeWon > 0 && (
                      <View className="bg-emerald-500/10 dark:bg-emerald-500/25 px-2.5 py-1.5 rounded-lg flex-row items-center">
                        <GoldCoin size={10} />
                        <Text className="text-emerald-500 font-black text-[10.5px] ml-1">+{player.prizeWon}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            )}
          </GlassCard>
        </ScrollView>
      )}
    </LinearGradient>
  );
}
