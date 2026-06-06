import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { Trophy, Swords, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const [announcements, setAnnouncements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ tournamentsPlayed: 0, tournamentsWon: 0, totalKills: 0, points: 0 });

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
        const profileRes = await request('/user/profile');
        if (profileRes.success) {
          setStats(profileRes.data.stats || { tournamentsPlayed: 0, tournamentsWon: 0, totalKills: 0, points: 0 });
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

  const isDark = true; // Hardcoded dark theme focus for esports aesthetic

  return (
    <LinearGradient
      colors={['#060A13', '#0D1321']}
      className="flex-1"
    >
      <ScrollView 
        className="flex-1" 
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#00E5FF" 
            colors={["#00E5FF"]} 
            progressBackgroundColor="#0A0E1A"
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
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Welcome back,</Text>
            <Text 
              className="text-white text-2xl font-black mt-1 uppercase tracking-wide"
              style={{
                textShadowColor: 'rgba(0, 229, 255, 0.35)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              }}
            >
              {user ? user.username : 'Warrior'} 🎮
            </Text>
          </View>
          <Pressable 
            onPress={() => navigation.navigate('Profile')}
            className="w-12 h-12 bg-slate-950 rounded-full border-2 justify-center items-center overflow-hidden"
            style={{ 
              borderColor: '#00E5FF',
              shadowColor: '#00E5FF',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Text className="text-cyan-400 text-lg font-black">
              {user ? user.username.slice(0, 2).toUpperCase() : 'W'}
            </Text>
          </Pressable>
        </View>

        <View className="flex-row flex-wrap justify-between mb-4">
          <GlassCard className="w-[48%] mb-4 p-3.5 items-center" glowColor="purple">
            <Swords size={22} color="#A855F7" />
            <Text className="text-white text-lg font-black mt-1.5">{stats.tournamentsPlayed}</Text>
            <Text className="text-slate-400 text-[9px] uppercase font-extrabold tracking-wider mt-0.5">Played</Text>
          </GlassCard>

          <GlassCard className="w-[48%] mb-4 p-3.5 items-center" glowColor="emerald">
            <Trophy size={22} color="#10B981" />
            <Text className="text-white text-lg font-black mt-1.5">{stats.tournamentsWon}</Text>
            <Text className="text-slate-400 text-[9px] uppercase font-extrabold tracking-wider mt-0.5">Won</Text>
          </GlassCard>

          <GlassCard className="w-[48%] p-3.5 items-center" glowColor="red">
            <Award size={22} color="#EF4444" />
            <Text className="text-white text-lg font-black mt-1.5">{stats.totalKills}</Text>
            <Text className="text-slate-400 text-[9px] uppercase font-extrabold tracking-wider mt-0.5">Total Kills</Text>
          </GlassCard>

          <GlassCard className="w-[48%] p-3.5 items-center" glowColor="cyan">
            <Trophy size={22} color="#00E5FF" />
            <Text className="text-white text-lg font-black mt-1.5">{stats.points}</Text>
            <Text className="text-slate-400 text-[9px] uppercase font-extrabold tracking-wider mt-0.5">Points</Text>
          </GlassCard>
        </View>

        <Text className="text-white font-extrabold text-xs mb-3.5 uppercase tracking-widest px-1">Announcements</Text>
        {announcements.map((item) => (
          <GlassCard 
            key={item._id} 
            className="mb-4 p-4"
            glowColor={item.type === 'warning' ? 'red' : 'purple'}
          >
            <Text className="text-white font-black text-sm mb-1 uppercase tracking-wide">{item.title}</Text>
            <Text className="text-slate-400 text-xs leading-relaxed">{item.content}</Text>
          </GlassCard>
        ))}

        <GlassCard 
          className="p-5 items-center mt-2 mb-6"
          glowColor="cyan"
        >
          <Trophy size={38} color="#00E5FF" style={{
            shadowColor: '#00E5FF',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 8,
          }} />
          <Text className="text-white font-black text-lg mt-3 text-center uppercase tracking-wider">JOIN LIVE TOURNAMENTS</Text>
          <Text className="text-slate-400 text-xs text-center mt-1.5 mb-5 leading-relaxed px-2">
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
