import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Pressable, 
  ActivityIndicator, 
  RefreshControl,
  useColorScheme as useRNColorScheme
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { request } from '../../services/api';
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

export default function MyStatisticsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const isDark = colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      const res = await request('/tournaments/my');
      if (res.success) {
        setRegistrations(res.data.registrations || []);
      }
    } catch (err) {
      console.log('Error loading my statistics:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const renderRow = ({ item, index }) => {
    const tournament = item.tournamentId;
    if (!tournament) return null;

    const entryFee = tournament.entryFee || 0;
    const prizeWon = item.prizeWon || 0;

    return (
      <View 
        className="flex-row items-center bg-white dark:bg-slate-900 py-3.5 px-4 mb-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800/60"
      >
        {/* Index */}
        <View style={{ width: 25 }}>
          <Text className="text-slate-400 dark:text-slate-500 text-xs font-bold">{index + 1}</Text>
        </View>

        {/* Match Info */}
        <View className="flex-1 pr-2">
          <Text className="text-slate-900 dark:text-white text-xs font-black uppercase" numberOfLines={1}>
            {tournament.title}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-bold mt-1">
            Played on {formatDate(tournament.scheduledAt || item.createdAt)}
          </Text>
        </View>

        {/* Paid */}
        <View style={{ width: 70 }} className="flex-row items-center justify-end">
          <GoldCoin size={13} />
          <Text className="text-slate-900 dark:text-white text-xs font-black ml-1.5">{entryFee}</Text>
        </View>

        {/* Won */}
        <View style={{ width: 70 }} className="flex-row items-center justify-end">
          <GoldCoin size={13} />
          <Text className="text-slate-900 dark:text-white text-xs font-black ml-1.5">{prizeWon}</Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      {/* Header */}
      <View 
        className="flex-row items-center justify-between p-4 border-b bg-white dark:bg-slate-950"
        style={{
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          paddingTop: insets.top > 0 ? insets.top + 10 : 20,
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
          My Statistics
        </Text>
        <View className="w-9" />
      </View>

      {/* Table Headers */}
      <View 
        className="flex-row items-center bg-slate-900 dark:bg-slate-950 py-3 px-4"
        style={{
          borderBottomWidth: 1.5,
          borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'
        }}
      >
        <View style={{ width: 25 }}>
          <Text className="text-white text-[10px] font-black uppercase tracking-wider">#</Text>
        </View>
        <View className="flex-1">
          <Text className="text-white text-[10px] font-black uppercase tracking-wider">Match Info</Text>
        </View>
        <View style={{ width: 70 }} className="items-end">
          <Text className="text-white text-[10px] font-black uppercase tracking-wider">Paid</Text>
        </View>
        <View style={{ width: 70 }} className="items-end">
          <Text className="text-white text-[10px] font-black uppercase tracking-wider">Won</Text>
        </View>
      </View>

      {/* List content */}
      <View className="flex-1 p-3">
        {loading && !refreshing ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={isDark ? '#00E5FF' : '#7C3AED'} />
          </View>
        ) : (
          <FlatList
            data={registrations}
            keyExtractor={(item) => item._id}
            renderItem={renderRow}
            contentContainerStyle={{ paddingBottom: 60 }}
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
              <View className="py-20 items-center justify-center">
                <Text className="text-slate-500 dark:text-slate-400 text-sm font-semibold text-center">
                  You haven't participated in any matches yet.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </LinearGradient>
  );
}
