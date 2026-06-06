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
import { LinearGradient } from 'expo-linear-gradient';

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
      <LinearGradient colors={['#060A13', '#0D1321']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text className="text-slate-400 text-sm font-semibold">Loading tournament details...</Text>
      </LinearGradient>
    );
  }

  const isLive = tournament.status === 'live';
  const progress = Math.min((tournament.filledSlots / tournament.totalSlots) * 100, 100);

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
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="bg-slate-950/40 border-b border-slate-900/60 p-6 items-center">
          <View className="flex-row space-x-1.5 mb-3.5">
            <Badge text={tournament.game.replace('_', ' ')} variant="cyan" />
            <Badge text={tournament.tournamentType} variant="purple" />
            <Badge text={tournament.status} variant={tournament.status === 'registering' ? 'success' : isLive ? 'danger' : 'info'} />
          </View>
          <Text className="text-white text-xl font-black text-center mb-4 uppercase tracking-wider">{tournament.title}</Text>
          <Countdown targetDate={tournament.scheduledAt} className="w-full max-w-xs" />
        </View>

        <View className="p-4">
          <GlassCard className="p-5 flex-row flex-wrap justify-between mb-6" glowColor="purple">
            <View className="w-[48%] mb-4 flex-row items-center">
              <Calendar size={18} color="#A855F7" style={{ marginRight: 8 }} />
              <View>
                <Text className="text-slate-400 text-[8px] uppercase font-bold tracking-wider">Scheduled</Text>
                <Text className="text-white text-xs font-bold mt-0.5" numberOfLines={1}>
                  {new Date(tournament.scheduledAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View className="w-[48%] mb-4 flex-row items-center">
              <Swords size={18} color="#EF4444" style={{ marginRight: 8 }} />
              <View>
                <Text className="text-slate-400 text-[8px] uppercase font-bold tracking-wider">Game Mode</Text>
                <Text className="text-white text-xs font-bold mt-0.5 capitalize">
                  {tournament.gameMode.replace('_', ' ')}
                </Text>
              </View>
            </View>

            <View className="w-[48%] flex-row items-center">
              <DollarSign size={18} color="#10B981" style={{ marginRight: 8 }} />
              <View>
                <Text className="text-slate-400 text-[8px] uppercase font-bold tracking-wider">Prize Pool</Text>
                <Text className="text-emerald-400 text-sm font-black mt-0.5">₹{tournament.prizePool}</Text>
              </View>
            </View>

            <View className="w-[48%] flex-row items-center">
              <Users size={18} color="#00E5FF" style={{ marginRight: 8 }} />
              <View>
                <Text className="text-slate-400 text-[8px] uppercase font-bold tracking-wider">Entry Fee</Text>
                <Text className="text-white text-sm font-black mt-0.5">
                  {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}
                </Text>
              </View>
            </View>
          </GlassCard>

          {isRegistered ? (
            <GlassCard 
              className="p-5 items-center mb-6"
              glowColor="purple"
            >
              <View className="flex-row items-center mb-3">
                <CheckCircle size={16} color="#10B981" style={{ marginRight: 6 }} />
                <Text className="text-emerald-400 font-extrabold text-xs uppercase tracking-wide">You are Registered</Text>
              </View>
              <Text className="text-slate-400 text-[10px] text-center mb-4 leading-relaxed">
                Slot: <Text className="text-white font-bold">#{userRegistration.slotNumber}</Text> • ID: <Text className="text-white font-bold">{userRegistration.gameUID}</Text>
              </Text>
              {isLive ? (
                <Button 
                  title="Enter Live Match Lobby" 
                  onPress={handleEnterLobby} 
                  variant="primary"
                  className="w-full"
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
              variant="primary"
              className="mb-6"
            />
          )}

          <GlassCard className="p-4 mb-6" glowColor="purple">
            <View className="flex-row justify-between mb-2 px-0.5">
              <Text className="text-white font-bold text-xs uppercase tracking-wider">Tournament Slots</Text>
              <Text className="text-cyan-400 font-extrabold text-xs">
                {tournament.filledSlots}/{tournament.totalSlots} Slots
              </Text>
            </View>
            <View className="h-2 bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
              <LinearGradient
                colors={['#8B5CF6', '#00E5FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: `${progress}%`, height: '100%' }}
                className="rounded-full"
              />
            </View>
          </GlassCard>

          <GlassCard className="p-5" glowColor="purple">
            <Text className="text-white font-extrabold text-xs uppercase tracking-wider mb-4 px-0.5">Players Joined ({participants.length})</Text>
            {participants.length === 0 ? (
              <Text className="text-slate-400 text-xs font-semibold text-center py-4">Be the first warrior to enter the arena!</Text>
            ) : (
              participants.map((player) => (
                <View 
                  key={player._id} 
                  className="flex-row justify-between items-center py-3 border-b border-slate-800/60"
                >
                  <Text className="text-white font-bold text-xs">{player.userId?.username || 'Gamer'}</Text>
                  <Text className="text-slate-400 text-[9px] font-bold uppercase">Slot #{player.slotNumber}</Text>
                </View>
              ))
            )}
          </GlassCard>
        </View>

        <Modal transparent visible={showRegisterModal} animationType="slide">
          <View 
            className="flex-1 justify-center items-center p-6"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          >
            <GlassCard 
              className="w-full max-w-sm p-6 bg-[#060A13]"
              glowColor="purple"
            >
              <Text className="text-[#00E5FF] text-base font-black text-center mb-2 uppercase tracking-wide">Join Arena</Text>
              <Text className="text-slate-400 text-xs text-center mb-6 leading-relaxed px-1">
                To guarantee score tracking accuracy, enter your precise character UID/ID for <Text className="text-white font-bold uppercase">{tournament.game.replace('_', ' ')}</Text>.
              </Text>

              <Input
                label="Character UID / Player ID"
                value={gameUID}
                onChangeText={setGameUID}
                placeholder="E.g., 556799014"
              />

              <View className="bg-slate-950 rounded-xl p-3.5 mb-6 flex-row justify-between items-center border border-slate-900">
                <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wide">Entry Cost</Text>
                <Text className="text-white text-base font-black">
                  {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Pressable 
                  onPress={() => setShowRegisterModal(false)}
                  style={{ flex: 1, marginRight: 8, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)', borderWidth: 1, borderRadius: 12, paddingVertical: 12 }}
                >
                  <Text className="text-slate-300 text-center font-bold text-xs uppercase tracking-wide">Cancel</Text>
                </Pressable>
                <Pressable 
                  onPress={handleConfirmRegistration}
                  disabled={loading}
                  style={{ flex: 1, marginLeft: 8, backgroundColor: '#7C3AED', borderColor: '#8B5CF6', borderWidth: 1, borderRadius: 12, paddingVertical: 12 }}
                >
                  <Text className="text-white text-center font-bold text-xs uppercase tracking-wide">Pay & Join</Text>
                </Pressable>
              </View>
            </GlassCard>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
}
