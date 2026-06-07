import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl, Image, useColorScheme as useRNColorScheme } from 'react-native';
import { request } from '../../services/api';
import { SocketContext } from '../../context/SocketContext';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Countdown from '../../components/ui/Countdown';
import Header from '../../components/ui/Header';
import { CONFIG } from '../../config';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
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

const formatDate = (dateStr) => {
  try {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strTime = String(hours).padStart(2, '0') + ':' + minutes + ' ' + ampm;
    
    return `${day}/${month}/${year} at ${strTime}`;
  } catch (e) {
    return dateStr;
  }
};

export default function TournamentsScreen({ navigation, route }) {
  const socket = useContext(SocketContext);
  const [tournaments, setTournaments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(route?.params?.activeTab || 'upcoming'); // ongoing, upcoming, results
  const myMatchesOnly = route?.params?.myMatchesOnly || false;

  useEffect(() => {
    if (route?.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route?.params?.activeTab]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      navigation.setParams({ myMatchesOnly: undefined });
    });
    return unsubscribe;
  }, [navigation]);

  const { colorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const isDark = colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';

  const filteredTournaments = tournaments.filter((t) => {
    if (activeTab === 'ongoing') {
      return t.status === 'live';
    } else if (activeTab === 'upcoming') {
      return t.status === 'registering' || t.status === 'upcoming' || t.status === 'scheduled';
    } else if (activeTab === 'results') {
      return t.status === 'completed' || t.status === 'ended' || t.status === 'results';
    }
    return true;
  });

  const fetchTournaments = async () => {
    try {
      const url = myMatchesOnly ? '/tournaments/my' : '/tournaments?game=free_fire';
      const res = await request(url);
      if (res.success) {
        setTournaments(res.data.tournaments);
      }
    } catch (e) {
      console.log('Error fetching tournaments:', e.message);
      setTournaments([]);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [myMatchesOnly]);

  useEffect(() => {
    if (socket) {
      socket.on('tournament:slot_update', (data) => {
        setTournaments((prev) =>
          prev.map((t) => (t._id === data.tournamentId ? { ...t, filledSlots: data.filledSlots } : t))
        );
      });
      return () => {
        socket.off('tournament:slot_update');
      };
    }
  }, [socket]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTournaments();
    setRefreshing(false);
  };

  const getGameBannerSource = (item) => {
    if (item.game === 'free_fire') {
      if (item.gameMode === 'clash_squad') {
        const banner = item.bannerImage || '';
        const format = item.format || '';
        const rule = item.mode || '';
        const isOneTap = banner.includes('onetap') || rule === 'onetap';
        const isHS = banner.includes('headshot') || rule === 'headshot';
        if (banner.includes('1v1') || format === '1v1' || item.tournamentType === 'solo') {
          if (isOneTap) return require('../../../assets/cs_1v1_onetap.jpg');
          if (isHS) return require('../../../assets/cs_1v1_headshot.jpg');
          return require('../../../assets/cs_1v1_normal.jpg');
        }
        if (banner.includes('2v2') || format === '2v2' || item.tournamentType === 'duo') {
          if (isOneTap) return require('../../../assets/cs_2v2_onetap.jpg');
          if (isHS) return require('../../../assets/cs_2v2_headshot.jpg');
          return require('../../../assets/cs_2v2_normal.jpg');
        }
        if (banner.includes('4v4') || format === '4v4' || item.tournamentType === 'squad') {
          if (isOneTap) return require('../../../assets/cs_4v4_onetap.jpg');
          if (isHS) return require('../../../assets/cs_4v4_headshot.jpg');
          return require('../../../assets/cs_4v4_normal.jpg');
        }
        return require('../../../assets/clash_squad.jpg');
      } else if (item.gameMode === 'lone_wolf') {
        const banner = item.bannerImage || '';
        const format = item.format || '';
        const rule = item.mode || '';
        if (banner.includes('2v2') || format === '2v2' || item.tournamentType === 'duo') {
          if (banner.includes('headshot') || banner.includes('onetap') || rule === 'headshot' || rule === 'onetap') {
            return require('../../../assets/lw_2v2_headshot.jpg');
          }
          return require('../../../assets/lw_2v2_normal.jpg');
        }
        if (banner.includes('headshot') || banner.includes('onetap') || rule === 'headshot' || rule === 'onetap') {
          return require('../../../assets/lw_1v1_headshot.jpg');
        }
        return require('../../../assets/lw_1v1_normal.jpg');
      } else if (item.gameMode === 'battle_royale') {
        const banner = item.bannerImage || '';
        if (banner.includes('squad') || item.tournamentType === 'squad') {
          return require('../../../assets/br_squad.jpg');
        }
        if (banner.includes('duo') || item.tournamentType === 'duo') {
          return require('../../../assets/br_duo.jpg');
        }
        if (banner.includes('solo') || item.tournamentType === 'solo') {
          return require('../../../assets/br_solo.jpg');
        }
      }
      return require('../../../assets/free_fire_banner.jpg');
    }
    switch (item.game) {
      case 'bgmi': return { uri: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300' };
      case 'valorant': return { uri: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=300' };
      case 'cod_mobile': return { uri: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=300' };
      default: return { uri: CONFIG.DEFAULT_BANNER };
    }
  };

const TournamentCard = ({ item, navigation, isDark }) => {
  const progress = Math.min((item.filledSlots / item.totalSlots) * 100, 100);
  const spotsLeft = item.totalSlots - item.filledSlots;
  const isFull = spotsLeft <= 0;
  const isCSLW = item.gameMode === 'clash_squad' || item.gameMode === 'lone_wolf';

  return (
    <GlassCard className="mb-5 overflow-hidden p-0" glowColor="purple">
      <View className="relative">
        <Image 
          source={getGameBannerSource(item)}
          style={{ width: '100%', height: 160 }}
          resizeMode="stretch"
        />

        {/* Map Overlay Text */}
        <Text 
          className="text-yellow-400 font-black text-2xl italic tracking-widest uppercase absolute bottom-2 right-4 z-10"
          style={{
            textShadowColor: '#000',
            textShadowOffset: { width: 1.5, height: 1.5 },
            textShadowRadius: 1,
          }}
        >
          {item.map || 'Bermuda'}
        </Text>
      </View>

      <View className="p-4 bg-white/95 dark:bg-[#0A0F1A]/95">
        {/* Header Row: Title, Time */}
        <View className="mb-4">
          <Text className="text-slate-900 dark:text-white text-sm font-black uppercase" numberOfLines={1}>
            {item.title}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold mt-1">
            Time: {formatDate(item.scheduledAt)}
          </Text>
        </View>

        {/* Stats Grid: Row 1 */}
        <View className="flex-row justify-between mb-4">
          <View className="items-start flex-1">
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1">
              {isCSLW ? 'Winner Prize' : 'Prize Pool'}
            </Text>
            <View className="flex-row items-center">
              <GoldCoin size={14} />
              <Text className="text-slate-900 dark:text-white text-xs font-black ml-1">
                {isCSLW ? (item.winnerPrize || item.prizePool) : item.prizePool}
              </Text>
            </View>
          </View>
          <View className="items-start flex-1">
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1">
              {isCSLW ? 'Rule Mode' : 'Per Kill'}
            </Text>
            {isCSLW ? (
              <Text className="text-slate-905 dark:text-white text-xs font-black uppercase mt-0.5">{item.mode || 'Normal'}</Text>
            ) : (
              <View className="flex-row items-center">
                <GoldCoin size={14} />
                <Text className="text-slate-900 dark:text-white text-xs font-black ml-1">
                  {item.perKillReward || item.perKill || 0}
                </Text>
              </View>
            )}
          </View>
          <View className="items-start flex-1">
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1">Entry Fee</Text>
            <View className="flex-row items-center">
              <GoldCoin size={14} />
              <Text className="text-slate-900 dark:text-white text-xs font-black ml-1">{item.entryFee}</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid: Row 2 */}
        <View className="flex-row justify-between mb-4">
          <View className="items-start flex-1">
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1">Type</Text>
            <Text className="text-slate-900 dark:text-white text-xs font-bold capitalize">{item.tournamentType || 'Solo'}</Text>
          </View>
          <View className="items-start flex-1">
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1">Map</Text>
            <Text className="text-slate-900 dark:text-white text-xs font-bold capitalize">{item.map || 'Bermuda'}</Text>
          </View>
          <View className="items-start flex-1">
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1">Mode</Text>
            <Text className="text-slate-900 dark:text-white text-xs font-bold capitalize">{item.gameMode?.replace('_', ' ') || 'Classic'}</Text>
          </View>
        </View>

        {/* Progress and Action Button Row */}
        <View className="flex-row justify-between items-center border-t border-slate-200 dark:border-slate-800/60 pt-4 mt-1">
          {/* Progress Bar (Left Column) */}
          <View className="flex-1 mr-4">
            <View className="h-1.5 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden mb-1.5 border border-slate-300/40 dark:border-slate-900">
              <View 
                style={{ width: `${progress}%`, height: '100%', backgroundColor: '#7C3AED' }} 
                className="rounded-full"
              />
            </View>
            <View className="flex-row justify-between items-center">
              <Text className={`text-[9px] font-bold ${isFull ? 'text-rose-500 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {isFull ? 'No Spots Left! Match is Full.' : `Only ${spotsLeft} spots left!`}
              </Text>
              <Text className="text-slate-900 dark:text-white text-[10px] font-black">{item.filledSlots}/{item.totalSlots}</Text>
            </View>
          </View>

          {/* Action Buttons (Right Column) */}
          <View className="flex-row">
            <Pressable
              onPress={() => navigation.navigate('TournamentDetail', { slug: item.slug })}
              className={`py-3 px-6 rounded-xl items-center justify-center ${
                isFull 
                  ? 'bg-slate-350 dark:bg-slate-800' 
                  : 'bg-emerald-500 dark:bg-emerald-600'
              }`}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.85 : 1,
                  shadowColor: isFull ? 'transparent' : '#10B981',
                  shadowOffset: { width: 0, height: 1.5 },
                  shadowOpacity: isFull ? 0 : 0.2,
                  shadowRadius: 3,
                  elevation: isFull ? 0 : 2
                }
              ]}
            >
              <Text className="text-white font-extrabold text-[12px] uppercase tracking-wider">
                {isFull ? 'FULL' : 'JOIN'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </GlassCard>
  );
};

const renderItem = ({ item }) => {
  return <TournamentCard item={item} navigation={navigation} isDark={isDark} />;
};

  const getEmptyMessage = () => {
    if (myMatchesOnly) {
      switch (activeTab) {
        case 'ongoing':
          return "You haven't joined any live contests.";
        case 'upcoming':
          return "You haven't registered for any upcoming contests.";
        case 'results':
          return "No completed matches in your history.";
        default:
          return "No contests found in your list.";
      }
    }
    switch (activeTab) {
      case 'ongoing':
        return 'No live tournaments ongoing at the moment.';
      case 'upcoming':
        return 'No upcoming tournaments scheduled yet.';
      case 'results':
        return 'No completed tournament results available yet.';
      default:
        return 'No tournaments active currently.';
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      <View className="px-4">
        <Header navigation={navigation} />
      </View>

      {/* Top Tab Bar */}
      <View className="flex-row bg-[#7C3AED] dark:bg-[#6D28D9] w-full mb-5 shadow-lg border-b border-violet-500/10">
        {['ongoing', 'upcoming', 'results'].map((tabId) => {
          const isActive = activeTab === tabId;
          const label = tabId === 'ongoing' ? 'ONGOING' : tabId === 'upcoming' ? 'UPCOMING' : 'RESULTS';
          return (
            <Pressable
              key={tabId}
              onPress={() => setActiveTab(tabId)}
              className="flex-1 py-4 items-center justify-center relative"
              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
            >
              <Text 
                className={`text-white text-xs tracking-wider uppercase font-black ${
                  isActive ? 'opacity-100' : 'opacity-70'
                }`}
              >
                {label}
              </Text>
              {isActive && (
                <View className="absolute bottom-0 w-16 h-[3px] bg-white rounded-full" />
              )}
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filteredTournaments}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={isDark ? "#00E5FF" : "#7C3AED"} 
            colors={[isDark ? "#00E5FF" : "#7C3AED"]} 
            progressBackgroundColor={isDark ? "#0A0E1A" : "#FFFFFF"}
          />
        }
        ListEmptyComponent={
          <View className="py-20 items-center px-4">
            <Text className="text-slate-500 dark:text-slate-400 text-sm font-semibold text-center leading-relaxed">
              {getEmptyMessage()}
            </Text>
          </View>
        }
      />
    </LinearGradient>
  );
}
