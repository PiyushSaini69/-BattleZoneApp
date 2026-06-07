import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl, Alert, Image } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Countdown from '../../components/ui/Countdown';
import { Swords, Calendar, Users, DollarSign, CheckCircle, ArrowLeft } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const getGameBannerSource = (item) => {
  if (item.game === 'free_fire') {
    if (item.gameMode === 'clash_squad') {
      return require('../../../assets/clash_squad.jpg');
    } else if (item.gameMode === 'lone_wolf') {
      return require('../../../assets/lone_wolf.jpg');
    }
    return require('../../../assets/free_fire_banner.jpg');
  }
  switch (item.game) {
    case 'bgmi': return { uri: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300' };
    case 'valorant': return { uri: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=300' };
    case 'cod_mobile': return { uri: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=300' };
    default: return { uri: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=300' };
  }
};

export default function TournamentDetailScreen({ route, navigation }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { slug } = route.params;
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);



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

  useEffect(() => {
    if (route.params?.openRegister && tournament && user) {
      const isFull = tournament.filledSlots >= tournament.totalSlots;
      if (!isRegistered && !isFull) {
        navigation.navigate('RegisterTournament', { slug: tournament.slug, tournamentId: tournament._id });
        navigation.setParams({ openRegister: undefined });
      }
    }
  }, [tournament, isRegistered, user, route.params?.openRegister]);

  const handleRegisterPress = () => {
    if (!user) {
      Alert.alert('Authentication Required ⚠️', 'Please login to join this tournament.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }

    navigation.navigate('RegisterTournament', { slug: tournament.slug, tournamentId: tournament._id });
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
  const spotsLeft = tournament.totalSlots - tournament.filledSlots;
  const isFull = spotsLeft <= 0;

  const handleMyEntriesPress = () => {
    if (isRegistered) {
      Alert.alert(
        'Your Registration Details 🎮', 
        `Slot Number: #${userRegistration.slotNumber}\nCharacter UID: ${userRegistration.gameUID}\n\nEnsure your in-game character matches this UID for score tracking accuracy.`
      );
    } else {
      Alert.alert(
        'Not Registered ⚠️', 
        'You have not registered for this tournament yet. Click "REGISTER NOW" to secure your slot!'
      );
    }
  };

  const getRightButtonConfig = () => {
    if (isRegistered) {
      if (isLive) {
        return { text: 'ENTER LOBBY', disabled: false, styleClass: 'bg-violet-600 dark:bg-violet-500' };
      }
      return { text: 'LOBBY LOCKED', disabled: false, styleClass: 'bg-slate-500 dark:bg-slate-700' };
    }
    if (isFull) {
      return { text: 'MATCH FULL', disabled: true, styleClass: 'bg-slate-550 dark:bg-slate-800' };
    }
    return { text: 'REGISTER NOW', disabled: false, styleClass: 'bg-cyan-500 dark:bg-cyan-600' };
  };

  const rightBtn = getRightButtonConfig();

  const handleRightButtonPress = () => {
    if (isRegistered) {
      if (isLive) {
        handleEnterLobby();
      } else {
        Alert.alert(
          'Lobby Locked 🔑', 
          'Room details (ID & Password) will unlock here automatically 10-15 minutes before the match start time.'
        );
      }
    } else {
      handleRegisterPress();
    }
  };



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
            tintColor="#00E5FF" 
            colors={["#00E5FF"]} 
            progressBackgroundColor="#0A0E1A"
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Status Bar Spacing */}
        <View style={{ height: insets.top }} />

        <View className="relative">
          <Image 
            source={getGameBannerSource(tournament)}
            style={{ width: '100%', height: 210 }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', isDark ? 'rgba(6, 10, 19, 0.98)' : 'rgba(248, 250, 252, 0.98)']}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 80 }}
          />

          {/* Back Button */}
          <Pressable 
            onPress={() => navigation.goBack()}
            className="absolute top-3 left-3 z-20 p-2"
          >
            <ArrowLeft size={22} color="#ffffff" strokeWidth={2.5} />
          </Pressable>
          
          {/* Rules Overlay Card */}
          <View 
            className="absolute top-3 right-4 bg-black/85 border border-amber-600/70 rounded-xl p-2.5 z-10"
            style={{ maxWidth: '60%' }}
          >
            <Text className="text-white text-[7.5px] font-black tracking-wide mb-0.5">I'D LEV 40+ ✅</Text>
            <Text className="text-white text-[7.5px] font-black tracking-wide mb-0.5">HUD POV ALLOWED ✅</Text>
            <Text className="text-white text-[7.5px] font-black tracking-wide mb-0.5">M79 LAUNCHER BAN ❌</Text>
            <Text className="text-white text-[7.5px] font-black tracking-wide mb-0.5">TEAMUP NOT ALLOWED ❌</Text>
            <Text className="text-white text-[7.5px] font-black tracking-wide mb-0.5">HACKERS BAN ❌</Text>
            <Text className="text-white text-[7.5px] font-black tracking-wide">DOUBLE VECTOR BAN ❌</Text>
          </View>

          {/* Map Overlay Text */}
          <Text 
            className="text-yellow-400 font-black text-2xl italic tracking-widest uppercase absolute bottom-2 right-6 z-10"
            style={{
              textShadowColor: '#000',
              textShadowOffset: { width: 1.5, height: 1.5 },
              textShadowRadius: 1,
            }}
          >
            {tournament.map || 'Bermuda'}
          </Text>
        </View>

        <View className="px-4 pb-2">
          {/* Title Header */}
          <Text className="text-sky-600 dark:text-[#00E5FF] text-lg font-black uppercase mb-4 tracking-wide">
            {tournament.title.toUpperCase().startsWith('FREE FIRE') 
              ? tournament.title.toUpperCase() 
              : `${tournament.game.replace('_', ' ').toUpperCase()} #${tournament._id.slice(-6).toUpperCase()}`}
          </Text>

          {/* Stat Badges Row 1: Type, Version, Map */}
          <View className="flex-row space-x-2.5 mb-3">
            <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 flex-1 items-center justify-center shadow-sm">
              <Text className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Type: <Text className="font-extrabold text-slate-900 dark:text-white capitalize">{tournament.tournamentType || 'Solo'}</Text>
              </Text>
            </View>
            <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 flex-1 items-center justify-center shadow-sm">
              <Text className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Version: <Text className="font-extrabold text-slate-900 dark:text-white uppercase">{tournament.version || 'TPP'}</Text>
              </Text>
            </View>
            <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 flex-1 items-center justify-center shadow-sm">
              <Text className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Map: <Text className="font-extrabold text-slate-900 dark:text-white capitalize">{tournament.map || 'Bermuda'}</Text>
              </Text>
            </View>
          </View>

          {/* Stat Badges Row 2: Match Type, Entry Fee */}
          <View className="flex-row space-x-2.5 mb-3">
            <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 flex-1 items-center justify-center shadow-sm">
              <Text className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Match Type: <Text className="font-extrabold text-slate-900 dark:text-white">{tournament.entryFee === 0 ? 'Free' : 'Paid'}</Text>
              </Text>
            </View>
            <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 flex-1 flex-row items-center justify-center shadow-sm">
              <Text className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Entry Fee: </Text>
              <GoldCoin size={12} />
              <Text className="font-extrabold text-slate-900 dark:text-white text-[10px] ml-1.5">{tournament.entryFee} Coins</Text>
            </View>
          </View>

          {/* Stat Badges Row 3: Match Schedule */}
          <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 mb-5 items-center justify-center shadow-sm">
            <Text className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Match Schedule: <Text className="font-extrabold text-slate-900 dark:text-white">{formatDate(tournament.scheduledAt)}</Text>
            </Text>
          </View>

          {/* Prize Details Section */}
          <Text className="text-[#0284C7] dark:text-[#38BDF8] font-black text-sm uppercase tracking-wide mb-3 px-0.5">Prize Details</Text>
          <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-5 shadow-sm">
            <Text className="text-slate-700 dark:text-slate-300 text-xs font-bold mb-2">
              .WINNER - {Math.round(tournament.prizePool * 0.6)} COINS + KILLS COINS
            </Text>
            <Text className="text-slate-700 dark:text-slate-300 text-xs font-bold">
              #2 - {Math.round(tournament.prizePool * 0.4)} COINS + KILLS COINS
            </Text>
          </View>

          {/* About this Match Section */}
          <Text className="text-[#0284C7] dark:text-[#38BDF8] font-black text-sm uppercase tracking-wide mb-3 px-0.5">About this Match</Text>
          <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-5 shadow-sm">
            <Pressable onPress={() => Alert.alert('How to Join 📖', '1. Wait for registration window.\n2. Click "MY ENTRIES" to double check your UID.\n3. Access match room 10-15 mins before match starts to copy Room ID & Password.\n4. Open Free Fire, find the Custom Match screen, search the Room ID, enter the Password, and sit in your slot!')}>
              <Text className="text-sky-600 dark:text-sky-400 font-bold text-xs underline mb-3.5">
                How To Join Free Fire Custom Room
              </Text>
            </Pressable>
            
            <Text className="text-slate-800 dark:text-slate-200 text-xs font-black mb-2">Restrictions:</Text>
            <Text className="text-slate-600 dark:text-slate-400 text-xs font-semibold mb-1.5">- Double Vector not allowed (Single Vector allowed)</Text>
            <Text className="text-slate-600 dark:text-slate-400 text-xs font-semibold mb-1.5">- M79 Launcher Ban</Text>
            <Text className="text-slate-600 dark:text-slate-400 text-xs font-semibold mb-4">- Gun Attributes On</Text>

            <Text className="text-slate-800 dark:text-slate-200 text-xs font-black mb-2">Tournament Rules:--</Text>
            <Text className="text-slate-600 dark:text-slate-400 text-xs font-semibold leading-relaxed">
              Ensure to play fair. Hacking or teaming up results in immediate lobby disqualification. You must submit score screen proofs within the Match lobby channel post-game.
            </Text>
          </View>

          {/* Slots Availability Section */}
          <Text className="text-[#0284C7] dark:text-[#38BDF8] font-black text-sm uppercase tracking-wide mb-3 px-0.5">Tournament Slots</Text>
          <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-5 shadow-sm">
            <View className="flex-row justify-between mb-2 px-0.5">
              <Text className="text-slate-800 dark:text-slate-200 font-extrabold text-[10px] uppercase tracking-wider">Filled Status</Text>
              <Text className="text-cyan-500 dark:text-cyan-400 font-extrabold text-[10px]">
                {tournament.filledSlots}/{tournament.totalSlots} Slots ({spotsLeft} left)
              </Text>
            </View>
            <View className="h-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-full overflow-hidden">
              <View 
                style={{ width: `${progress}%`, height: '100%', backgroundColor: '#7C3AED' }} 
                className="rounded-full"
              />
            </View>
          </View>

          {/* Players Joined Section */}
          <Text className="text-[#0284C7] dark:text-[#38BDF8] font-black text-sm uppercase tracking-wide mb-3 px-0.5">Players Joined ({participants.length})</Text>
          <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            {participants.length === 0 ? (
              <Text className="text-slate-400 text-xs font-semibold text-center py-4">Be the first warrior to enter the tournament!</Text>
            ) : (
              participants.map((player) => (
                <View 
                  key={player._id} 
                  className="flex-row justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/60"
                >
                  <Text className="text-slate-800 dark:text-slate-200 font-bold text-xs">{player.userId?.username || 'Gamer'}</Text>
                  <Text className="text-slate-400 text-[9px] font-bold uppercase">Slot #{player.slotNumber}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="flex-row h-14 w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0F1A] absolute bottom-0 shadow-lg">
        <Pressable 
          onPress={handleMyEntriesPress}
          className="flex-1 bg-[#10B981] items-center justify-center"
          style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
        >
          <Text className="text-white font-black text-xs uppercase tracking-wider">MY ENTRIES</Text>
        </Pressable>
        <Pressable 
          onPress={handleRightButtonPress}
          disabled={rightBtn.disabled}
          className={`flex-1 items-center justify-center ${rightBtn.styleClass}`}
          style={({ pressed }) => [{ opacity: pressed && !rightBtn.disabled ? 0.85 : 1 }]}
        >
          <Text className="text-white font-black text-xs uppercase tracking-wider">
            {rightBtn.text}
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
