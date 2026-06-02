import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl, Image } from 'react-native';
import { request } from '../../services/api';
import { SocketContext } from '../../context/SocketContext';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Countdown from '../../components/ui/Countdown';
import { CONFIG } from '../../config';

export default function TournamentsScreen({ navigation }) {
  const socket = useContext(SocketContext);
  const [tournaments, setTournaments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedGame, setSelectedGame] = useState('');

  const gameFilters = [
    { label: 'All Games', value: '' },
    { label: 'BGMI', value: 'bgmi' },
    { label: 'Free Fire', value: 'free_fire' },
    { label: 'Valorant', value: 'valorant' },
    { label: 'COD Mobile', value: 'cod_mobile' },
  ];

  const fetchTournaments = async (game = '') => {
    try {
      const res = await request(`/tournaments?game=${game}`);
      if (res.success) {
        setTournaments(res.data.tournaments);
      }
    } catch (e) {
      console.log('Error fetching tournaments:', e.message);
    }
  };

  useEffect(() => {
    fetchTournaments(selectedGame);
  }, [selectedGame]);

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
    await fetchTournaments(selectedGame);
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
      <GlassCard className="mb-5 overflow-hidden p-0 border-white/5 bg-slate-900/60">
        <Image 
          source={{ uri: getGameBanner(item.game) }}
          style={{ width: '100%', height: 110 }}
          resizeMode="cover"
        />
        
        <View className="absolute top-3 right-3 flex-row space-x-1.5">
          <Badge text={item.tournamentType} variant="purple" />
          <Badge text={item.status} variant={item.status === 'registering' ? 'success' : item.status === 'live' ? 'danger' : 'info'} />
        </View>

        <View className="p-4">
          <Text className="text-white text-base font-extrabold mb-1" numberOfLines={1}>
            {item.title}
          </Text>
          <Text className="text-slate-450 text-[10px] font-bold uppercase mb-3">
            {item.game.replace('_', ' ')} • {item.gameMode.replace('_', ' ')}
          </Text>

          <View className="mb-4">
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-slate-450 text-[10px] font-bold uppercase">Filled Slots</Text>
              <Text className="text-white text-xs font-black">{item.filledSlots}/{item.totalSlots}</Text>
            </View>
            <View className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <View className="h-full bg-[#7C3AED] rounded-full" style={{ width: `${progress}%` }} />
            </View>
          </View>

          <View className="flex-row justify-between items-center border-t border-slate-800/80 pt-3 mb-4">
            <View>
              <Text className="text-slate-450 text-[8px] uppercase font-bold tracking-wider">Prize Pool</Text>
              <Text className="text-emerald-400 text-base font-black">₹{item.prizePool}</Text>
            </View>
            <View className="items-end">
              <Text className="text-slate-450 text-[8px] uppercase font-bold tracking-wider">Entry Fee</Text>
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
              className="bg-[#7C3AED] px-4 py-2.5 rounded-xl border border-purple-500 shadow-md shadow-purple-500/20"
            >
              <Text className="text-white font-bold text-[10px] uppercase tracking-wider">Details</Text>
            </Pressable>
          </View>
        </View>
      </GlassCard>
    );
  };

  return (
    <View className="flex-1 bg-[#0B0F1A]">
      <View className="py-3 border-b border-slate-900 bg-[#0B0F1A]">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={gameFilters}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => {
            const isActive = selectedGame === item.value;
            return (
              <Pressable
                onPress={() => setSelectedGame(item.value)}
                className={`mr-2.5 px-3 py-2 rounded-xl border ${
                  isActive ? 'bg-[#7C3AED] border-purple-500' : 'bg-slate-900 border-slate-800'
                }`}
              >
                <Text className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-450'}`}>
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={tournaments}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" colors={["#7C3AED"]} />
        }
        ListEmptyComponent={
          <View className="py-20 items-center">
            <Text className="text-slate-450 text-sm font-semibold">No tournaments active currently.</Text>
          </View>
        }
      />
    </View>
  );
}
