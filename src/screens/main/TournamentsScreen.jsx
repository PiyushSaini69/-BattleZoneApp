import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl, Image } from 'react-native';
import { request } from '../../services/api';
import { SocketContext } from '../../context/SocketContext';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Countdown from '../../components/ui/Countdown';
import { CONFIG } from '../../config';
import { LinearGradient } from 'expo-linear-gradient';

export default function TournamentsScreen({ navigation }) {
  const socket = useContext(SocketContext);
  const [tournaments, setTournaments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTournaments = async () => {
    try {
      const res = await request(`/tournaments?game=free_fire`);
      if (res.success) {
        setTournaments(res.data.tournaments);
      }
    } catch (e) {
      console.log('Error fetching tournaments:', e.message);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

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

  const getGameBanner = (game) => {
    switch (game) {
      case 'bgmi': return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300';
      case 'free_fire': return 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=300';
      case 'valorant': return 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=300';
      case 'cod_mobile': return 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=300';
      default: return CONFIG.DEFAULT_BANNER;
    }
  };

  const renderItem = ({ item }) => {
    const progress = Math.min((item.filledSlots / item.totalSlots) * 100, 100);

    return (
      <GlassCard className="mb-5 overflow-hidden p-0" glowColor="purple">
        <View className="relative">
          <Image 
            source={{ uri: getGameBanner(item.game) }}
            style={{ width: '100%', height: 120 }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(10, 14, 26, 0.95)']}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 60 }}
          />
          <View className="absolute top-3 right-3 flex-row gap-1.5">
            <Badge text={item.tournamentType} variant="purple" />
            <Badge text={item.status} variant={item.status === 'registering' ? 'success' : item.status === 'live' ? 'danger' : 'info'} />
          </View>
        </View>

        <View className="p-4 bg-[#0A0F1A]/95">
          <Text className="text-white text-base font-extrabold mb-1" numberOfLines={1}>
            {item.title}
          </Text>
          <Text className="text-slate-400 text-[10px] font-bold uppercase mb-3">
            {item.game.replace('_', ' ')} • {item.gameMode.replace('_', ' ')}
          </Text>

          <View className="mb-4">
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-wide">Slots Filled</Text>
              <Text className="text-white text-xs font-black">{item.filledSlots}/{item.totalSlots}</Text>
            </View>
            <View className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
              <LinearGradient
                colors={['#8B5CF6', '#00E5FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: `${progress}%`, height: '100%' }}
                className="rounded-full"
              />
            </View>
          </View>

          <View 
            className="flex-row justify-between items-center border-t border-slate-800/60 pt-3.5 mb-4"
          >
            <View>
              <Text className="text-slate-400 text-[8px] uppercase font-bold tracking-widest">Prize Pool</Text>
              <Text className="text-[#00E5FF] text-base font-black">₹{item.prizePool}</Text>
            </View>
            <View className="items-end">
              <Text className="text-slate-400 text-[8px] uppercase font-bold tracking-widest">Entry Fee</Text>
              <Text className="text-white text-base font-black">
                {item.entryFee === 0 ? 'FREE' : `₹${item.entryFee}`}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-3">
              <Countdown targetDate={item.scheduledAt} />
            </View>
            <Pressable
              onPress={() => navigation.navigate('TournamentDetail', { slug: item.slug })}
              className="bg-cyan-500 rounded-xl px-5 py-2.5"
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  shadowColor: '#00E5FF',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3
                }
              ]}
            >
              <Text className="text-black font-extrabold text-[10px] uppercase tracking-widest">Details</Text>
            </Pressable>
          </View>
        </View>
      </GlassCard>
    );
  };

  return (
    <LinearGradient
      colors={['#060A13', '#0D1321']}
      className="flex-1"
    >
      <FlatList
        data={tournaments}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#00E5FF" 
            colors={["#00E5FF"]} 
            progressBackgroundColor="#0A0E1A"
          />
        }
        ListEmptyComponent={
          <View className="py-20 items-center">
            <Text className="text-slate-400 text-sm font-semibold">No tournaments active currently.</Text>
          </View>
        }
      />
    </LinearGradient>
  );
}
