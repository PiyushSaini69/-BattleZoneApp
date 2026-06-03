import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import { Trophy, Swords, Award } from 'lucide-react-native';

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
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

  return (
    <ScrollView 
      className="flex-1 bg-[#0B0F1A]" 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" colors={["#7C3AED"]} />
      }
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <View className="flex-row justify-between items-center mb-6 mt-4">
        <View>
          <Text className="text-slate-450 text-[10px] font-bold uppercase tracking-wider">Welcome back,</Text>
          <Text className="text-white text-2xl font-black mt-1">
            {user ? user.username : 'Warrior'} 🎮
          </Text>
        </View>
        <Pressable 
          onPress={() => navigation.navigate('Profile')}
          className="w-12 h-12 bg-slate-900 rounded-full border justify-center items-center overflow-hidden"
          style={{ borderColor: 'rgba(124, 58, 237, 0.3)' }}
        >
          <Text className="text-white text-lg font-bold">
            {user ? user.username.slice(0, 2).toUpperCase() : 'W'}
          </Text>
        </Pressable>
      </View>

      <View className="flex-row flex-wrap justify-between mb-6">
        <GlassCard className="w-[48%] mb-4 p-3.5 items-center">
          <Swords size={22} color="#C084FC" />
          <Text className="text-white text-base font-black mt-1.5">{stats.tournamentsPlayed}</Text>
          <Text className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mt-0.5">Played</Text>
        </GlassCard>

        <GlassCard className="w-[48%] mb-4 p-3.5 items-center">
          <Trophy size={22} color="#FBBF24" />
          <Text className="text-white text-base font-black mt-1.5">{stats.tournamentsWon}</Text>
          <Text className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mt-0.5">Won</Text>
        </GlassCard>

        <GlassCard className="w-[48%] p-3.5 items-center">
          <Award size={22} color="#F87171" />
          <Text className="text-white text-base font-black mt-1.5">{stats.totalKills}</Text>
          <Text className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mt-0.5">Total Kills</Text>
        </GlassCard>

        <GlassCard className="w-[48%] p-3.5 items-center">
          <Trophy size={22} color="#22D3EE" />
          <Text className="text-white text-base font-black mt-1.5">{stats.points}</Text>
          <Text className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mt-0.5">Points</Text>
        </GlassCard>
      </View>

      <Text className="text-white font-extrabold text-sm mb-3 uppercase tracking-wider">Announcements</Text>
      {announcements.map((item) => (
        <GlassCard 
          key={item._id} 
          className={`mb-4 border-l-4 p-4 ${
            item.type === 'warning' ? 'border-l-amber-500' : 'border-l-[#7C3AED]'
          }`}
        >
          <Text className="text-white font-bold text-sm mb-1">{item.title}</Text>
          <Text className="text-slate-400 text-xs leading-relaxed">{item.content}</Text>
        </GlassCard>
      ))}

      <GlassCard 
        className="p-5 items-center mt-2 mb-6"
        style={{
          backgroundColor: 'rgba(124, 58, 237, 0.1)',
          borderColor: 'rgba(124, 58, 237, 0.2)',
        }}
      >
        <Trophy size={36} color="#7C3AED" />
        <Text className="text-white font-black text-lg mt-3 text-center">JOIN LIVE TOURNAMENTS</Text>
        <Text className="text-slate-450 text-xs text-center mt-1.5 mb-4 leading-relaxed">
          Compete against players across India for real prize money pools!
        </Text>
        <Pressable 
          onPress={() => navigation.navigate('TournamentsTab')}
          className="bg-[#7C3AED] px-6 py-3.5 rounded-xl border w-full"
          style={{
            borderColor: '#7C3AED',
            shadowColor: '#9333ea',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 4,
          }}
        >
          <Text className="text-white font-bold text-xs text-center uppercase tracking-wider">Explore Arenas</Text>
        </Pressable>
      </GlassCard>
    </ScrollView>
  );
}
