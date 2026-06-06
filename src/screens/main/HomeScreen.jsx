import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl, useColorScheme as useRNColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { Trophy, Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const GoldCoin = ({ size = 18 }) => (
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

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const [announcements, setAnnouncements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);

  const loadHomeData = async () => {
    try {
      const res = await request('/admin/announcements');
      if (res.success) setAnnouncements(res.data);
    } catch (e) {
      setAnnouncements([
        { _id: '1', title: '🎁 Welcome Warriors!', content: 'Join today and get ₹10 bonus cash instantly! Register for premium solo tournaments.', type: 'promo' },
        { _id: '2', title: '🛡️ Fair Play Guidelines', content: 'Our anti-cheat is active. Teaming or hacking leads to permanent bans and wallet forfeit.', type: 'warning' }
      ]);
    }

    if (user) {
      try {
        const walletRes = await request('/wallet');
        if (walletRes.success) {
          setBalance(walletRes.data.totalBalance || 0);
        }
      } catch (e) {}
    }
  };

  useEffect(() => {
    loadHomeData();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const { colorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const isDark = colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      <ScrollView 
        className="flex-1" 
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={isDark ? "#00E5FF" : "#7C3AED"} 
            colors={[isDark ? "#00E5FF" : "#7C3AED"]} 
            progressBackgroundColor={isDark ? "#0A0E1A" : "#FFFFFF"}
          />
        }
        contentContainerStyle={{ 
          padding: 16, 
          paddingTop: insets.top > 0 ? insets.top + 10 : 20, 
          paddingBottom: 100 
        }}
      >
        <View className="flex-row justify-between items-center mb-6 mt-1">
          <View>
            <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Welcome back,</Text>
            <Text 
              className="text-slate-900 dark:text-white text-2xl font-black mt-1 uppercase tracking-wide"
              style={{
                textShadowColor: isDark ? 'rgba(0, 229, 255, 0.35)' : 'rgba(124, 58, 237, 0.15)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              }}
            >
              {user ? (user.displayName || user.username) : 'Warrior'}
            </Text>
          </View>
          <View className="flex-row items-center">
            {/* Wallet Balance Pill */}
            <Pressable
              onPress={() => navigation.navigate('WalletTab')}
              className="flex-row items-center bg-slate-200 dark:bg-slate-950 px-3.5 py-2 rounded-full border border-slate-300 dark:border-slate-800"
              style={{ marginRight: 10 }}
            >
              <GoldCoin size={18} />
              <Text className="text-slate-900 dark:text-white text-xs font-black" style={{ marginLeft: 6 }}>
                {balance.toFixed(2)}
              </Text>
            </Pressable>

            {/* Notification Bell */}
            <Pressable
              onPress={() => navigation.navigate('Notification')}
              className="p-2.5 bg-slate-200 dark:bg-slate-950 rounded-full border border-slate-350 dark:border-slate-800"
              style={{ marginRight: 10 }}
            >
              <Bell size={16} color={isDark ? '#FFFFFF' : '#0F172A'} />
            </Pressable>

            {/* Profile Avatar */}
            <Pressable 
              onPress={() => navigation.navigate('ProfileTab')}
              className="w-12 h-12 bg-slate-200 dark:bg-slate-950 rounded-full border-2 justify-center items-center overflow-hidden"
              style={{ 
                borderColor: isDark ? '#00E5FF' : '#7C3AED',
                shadowColor: isDark ? '#00E5FF' : '#7C3AED',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: isDark ? 0.5 : 0.2,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <Text className="text-cyan-600 dark:text-cyan-400 text-lg font-black">
                {user ? user.username.slice(0, 2).toUpperCase() : 'W'}
              </Text>
            </Pressable>
          </View>
        </View>


        <Text className="text-slate-900 dark:text-white font-extrabold text-xs mb-3.5 uppercase tracking-widest px-1">Announcements</Text>
        {announcements.map((item) => (
          <GlassCard 
            key={item._id} 
            className="mb-4 p-4"
            glowColor={item.type === 'warning' ? 'red' : 'purple'}
          >
            <Text className="text-slate-900 dark:text-white font-black text-sm mb-1 uppercase tracking-wide">{item.title}</Text>
            <Text className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{item.content}</Text>
          </GlassCard>
        ))}

        <GlassCard 
          className="p-5 items-center mt-2 mb-6"
          glowColor="cyan"
        >
          <Trophy size={38} color={isDark ? "#00E5FF" : "#0891B2"} style={isDark ? {
            shadowColor: '#00E5FF',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 8,
          } : {}} />
          <Text className="text-slate-900 dark:text-white font-black text-lg mt-3 text-center uppercase tracking-wider">JOIN LIVE TOURNAMENTS</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-xs text-center mt-1.5 mb-5 leading-relaxed px-2">
            Compete against players across India for real prize money pools!
          </Text>
          <Button 
            title="Explore Arenas"
            onPress={() => navigation.navigate('TournamentsTab')}
            variant="primary"
            className="w-full"
          />
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}
