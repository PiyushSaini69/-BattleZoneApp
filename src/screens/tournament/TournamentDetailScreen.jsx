import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl, Alert, Modal } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Countdown from '../../components/ui/Countdown';
import { Swords, Calendar, Users, DollarSign, CheckCircle } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function TournamentDetailScreen({ route, navigation }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { slug } = route.params;
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [gameUID, setGameUID] = useState('');

  const loadData = async () => {
    try {
      const res = await request(`/tournaments/${slug}`);
      if (res.success) {
        setTournament(res.data.tournament);
        
        const partRes = await request(`/tournaments/${res.data.tournament._id}/participants`);
        if (partRes.success) setParticipants(partRes.data);
      }
    } catch (e) {
      console.log('Error loading tournament details:', e.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  useEffect(() => {
    if (socket && tournament) {
      socket.on('tournament:slot_update', (data) => {
        if (data.tournamentId === tournament._id) {
          setTournament(prev => prev ? { ...prev, filledSlots: data.filledSlots } : null);
        }
      });
      return () => {
        socket.off('tournament:slot_update');
      };
    }
  }, [socket, tournament]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const userRegistration = tournament && user 
    ? participants.find(p => p.userId._id === user.id || p.userId === user.id)
    : null;

  const isRegistered = !!userRegistration;

  const handleRegisterPress = () => {
    if (!user) {
      Alert.alert('Authentication Required ⚠️', 'Please login to join this tournament.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }

    const prefill = user.gameUIDs ? (user.gameUIDs.freeFire || '') : '';
    setGameUID(prefill);
    setShowRegisterModal(true);
  };

  const handleConfirmRegistration = async () => {
    if (!gameUID.trim()) {
      Alert.alert('UID Required ⚠️', 'Please enter your gaming character UID to proceed.');
      return;
    }

    setLoading(true);
    try {
      const res = await request(`/tournaments/${tournament._id}/register`, {
        method: 'POST',
        body: JSON.stringify({ gameUID })
      });
      if (res.success) {
        Alert.alert('Registration Successful! 🎉', `Slot assigned successfully! Slot #${res.data.slotNumber}`);
        setShowRegisterModal(false);
        await loadData();
      }
    } catch (err) {
      Alert.alert('Registration Failed ❌', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterLobby = () => {
    navigation.navigate('MatchRoom', { tournamentId: tournament._id });
  };

  if (!tournament) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-[#0B0F1A] justify-center items-center">
        <Text className="text-slate-550 dark:text-slate-400 text-sm font-semibold">Loading tournament details...</Text>
      </View>
    );
  }

  const isLive = tournament.status === 'live';
  const progress = Math.min((tournament.filledSlots / tournament.totalSlots) * 100, 100);

  return (
    <ScrollView 
      className="flex-1 bg-slate-50 dark:bg-[#0B0F1A]"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" colors={["#7C3AED"]} />
      }
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-950 p-6 items-center">
        <View className="flex-row space-x-1.5 mb-3">
          <Badge text={tournament.game.replace('_', ' ')} variant="cyan" />
          <Badge text={tournament.tournamentType} variant="purple" />
          <Badge text={tournament.status} variant={tournament.status === 'registering' ? 'success' : isLive ? 'danger' : 'info'} />
        </View>
        <Text className="text-slate-900 dark:text-white text-xl font-black text-center mb-4">{tournament.title}</Text>
        <Countdown targetDate={tournament.scheduledAt} className="w-full max-w-xs" />
      </View>

      <View className="p-4">
        <GlassCard className="p-5 flex-row flex-wrap justify-between mb-6">
          <View className="w-[48%] mb-4 flex-row items-center">
            <Calendar size={18} color="#C084FC" style={{ marginRight: 8 }} />
            <View>
              <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase font-bold mt-0.5">Scheduled</Text>
              <Text className="text-slate-900 dark:text-white text-xs font-bold mt-0.5" numberOfLines={1}>
                {new Date(tournament.scheduledAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View className="w-[48%] mb-4 flex-row items-center">
            <Swords size={18} color="#F87171" style={{ marginRight: 8 }} />
            <View>
              <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase font-bold mt-0.5">Game Mode</Text>
              <Text className="text-slate-900 dark:text-white text-xs font-bold mt-0.5 capitalize">
                {tournament.gameMode.replace('_', ' ')}
              </Text>
            </View>
          </View>

          <View className="w-[48%] flex-row items-center">
            <DollarSign size={18} color="#34D399" style={{ marginRight: 8 }} />
            <View>
              <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase font-bold mt-0.5">Prize Pool</Text>
              <Text className="text-emerald-555 dark:text-emerald-400 text-sm font-black mt-0.5">₹{tournament.prizePool}</Text>
            </View>
          </View>

          <View className="w-[48%] flex-row items-center">
            <Users size={18} color="#22D3EE" style={{ marginRight: 8 }} />
            <View>
              <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase font-bold mt-0.5">Entry Fee</Text>
              <Text className="text-slate-900 dark:text-white text-sm font-black mt-0.5">
                {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}
              </Text>
            </View>
          </View>
        </GlassCard>

        {isRegistered ? (
          <GlassCard 
            className="p-4 items-center mb-6"
            style={{
              backgroundColor: isDark ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.08)',
              borderColor: isDark ? 'rgba(124, 58, 237, 0.3)' : 'rgba(124, 58, 237, 0.15)',
            }}
          >
            <View className="flex-row items-center mb-3">
              <CheckCircle size={16} color="#34D399" style={{ marginRight: 6 }} />
              <Text className="text-emerald-555 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wide">You are Registered</Text>
            </View>
            <Text className="text-slate-500 dark:text-slate-400 text-[10px] text-center mb-4 leading-relaxed">
              Slot: <Text className="text-slate-900 dark:text-white font-bold">#{userRegistration.slotNumber}</Text> • ID: <Text className="text-slate-900 dark:text-white font-bold">{userRegistration.gameUID}</Text>
            </Text>
            {isLive ? (
              <Button 
                title="Enter Live Match Lobby" 
                onPress={handleEnterLobby} 
                className="w-full bg-emerald-600 border border-emerald-550 shadow-md"
              />
            ) : (
              <Button 
                title="Lobby Locked (Wait Details)" 
                disabled 
                className="w-full"
              />
            )}
          </GlassCard>
        ) : (
          <Button 
            title={tournament.filledSlots >= tournament.totalSlots ? "Tournament Full" : "Register to Compete"} 
            disabled={tournament.filledSlots >= tournament.totalSlots}
            onPress={handleRegisterPress}
            className="shadow-xl mb-6"
          />
        )}

        <GlassCard className="p-4 mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">Tournament Slots</Text>
            <Text className="text-purple-600 dark:text-[#C084FC] font-extrabold text-xs">
              {tournament.filledSlots}/{tournament.totalSlots} Slots
            </Text>
          </View>
          <View className="h-1.5 bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-850 rounded-full overflow-hidden">
            <View className="h-full bg-[#7C3AED] rounded-full" style={{ width: `${progress}%` }} />
          </View>
        </GlassCard>

        <GlassCard className="p-5">
          <Text className="text-slate-900 dark:text-white font-extrabold text-xs uppercase tracking-wider mb-4">Players Joined ({participants.length})</Text>
          {participants.length === 0 ? (
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold text-center py-4">Be the first warrior to enter the arena!</Text>
          ) : (
            participants.map((player) => (
              <View 
                key={player._id} 
                className="flex-row justify-between items-center py-3 border-b border-slate-200 dark:border-slate-800"
              >
                <Text className="text-slate-900 dark:text-white font-bold text-xs">{player.userId?.username || 'Gamer'}</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase">Slot #{player.slotNumber}</Text>
              </View>
            ))
          )}
        </GlassCard>
      </View>

      <Modal transparent visible={showRegisterModal} animationType="slide">
        <View 
          className="flex-1 justify-center items-center p-6"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        >
          <GlassCard 
            className="w-full max-w-sm p-6"
            style={{ 
              backgroundColor: isDark ? '#020617' : '#ffffff',
              borderColor: isDark ? 'rgba(124, 58, 237, 0.35)' : 'rgba(124, 58, 237, 0.15)',
              borderWidth: 1 
            }}
          >
            <Text className="text-[#7C3AED] dark:text-[#C084FC] text-base font-black text-center mb-2 uppercase tracking-wide">Join Arena</Text>
            <Text className="text-slate-600 dark:text-slate-400 text-xs text-center mb-6 leading-relaxed">
              To guarantee score tracking accuracy, enter your precise character UID/ID for <Text className="text-[#7C3AED] dark:text-white font-bold uppercase">{tournament.game.replace('_', ' ')}</Text>.
            </Text>

            <Input
              label="Character UID / Player Name"
              value={gameUID}
              onChangeText={setGameUID}
              placeholder="E.g., 556799014"
            />

            <View className="bg-slate-100 dark:bg-slate-900 rounded-xl p-3.5 mb-6 flex-row justify-between items-center">
              <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">Entry Cost</Text>
              <Text className="text-slate-900 dark:text-white text-base font-black">
                {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Pressable 
                onPress={() => setShowRegisterModal(false)}
                style={{ flex: 1, marginRight: 8, backgroundColor: isDark ? '#1e293b' : '#f1f5f9', borderColor: isDark ? '#334155' : '#cbd5e1', borderWidth: 1, borderRadius: 12, paddingVertical: 12 }}
              >
                <Text className="text-slate-700 dark:text-slate-300 text-center font-bold text-xs uppercase">Cancel</Text>
              </Pressable>
              <Pressable 
                onPress={handleConfirmRegistration}
                disabled={loading}
                style={{ flex: 1, marginLeft: 8, backgroundColor: '#7c3aed', borderColor: '#a78bfa', borderWidth: 1, borderRadius: 12, paddingVertical: 12 }}
              >
                <Text className="text-white text-center font-bold text-xs uppercase">Pay & Join</Text>
              </Pressable>
            </View>
          </GlassCard>
        </View>
      </Modal>
    </ScrollView>
  );
}
