import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl, Alert, Image } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Countdown from '../../components/ui/Countdown';
import { Swords, Calendar, Users, DollarSign, CheckCircle, ArrowLeft, Award, Trophy } from 'lucide-react-native';
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

const cleanText = (str) => {
  if (!str) return '';
  return str.replace(/^[\s\uD800-\uDFFF\u2600-\u27BF❌📱🎯🚫⚖️🏁📋📜⏳📲⚠️🌐🛡️📢⭐🔸🔹•\-\d\.\*]+/u, '').trim();
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
  return { uri: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300' };
};

const getBRDescription = (tournamentType) => {
  if (tournamentType === 'duo') {
    return [
      'Room ID & Password will be shared 10–15 minutes before the match starts ⏳',
      'All match details, updates & announcements will be provided only in the Battle Zone app 📲',
      'Players must join on time, late entry may not be allowed ⚠️',
      'Stable internet connection is required before starting the match 🌐',
      '🏁 Match result will be updated within 30 minutes after match completion',
    ];
  }
  if (tournamentType === 'squad') {
    return [
      'Room ID & Password will be shared 10–15 minutes before the match starts ⏳',
      'All match details, updates & announcements will be provided only in the Battle Zone app 📲',
      'Squad leaders are responsible for their team entry ⚠️',
      'Players must join on time, late entry may not be allowed 🌐',
      'Stable internet connection is required before starting the match 📶',
      '🏁 Match result will be updated within 30 minutes after match completion',
    ];
  }
  // solo (default)
  return [
    'Room ID & Password will be shared 10–15 minutes before the match starts ⏳',
    'All match details, updates & announcements will be provided only in the Battle Zone app 📲',
    'Players must join on time, late entry may not be allowed ⚠️',
    'Stable internet connection is required before starting the match 🌐',
    '🏁 Match result will be updated within 30 minutes after match completion',
  ];
};

const getBRRules = (tournamentType) => {
  if (tournamentType === 'duo') {
    return {
      rules: [
        '❌ No Aim Bot, Hacks, Scripts or any unfair tools allowed',
        '❌ PC players are strictly not allowed in any match',
        '📱 Only Smartphone & Tablet users are eligible to participate',
        '🎯 Only players with Level 40+ are allowed to participate',
        '🔄 Players are not allowed to use revive machines',
        '🚫 Players are not allowed to use reviving points',
        '🎯 Headshot rate should not exceed 70%',
        '🚫 If any player is found using hacks or cheats, their payment will be cancelled without warning',
        '⚖️ Decision of Battle Zone management will be final in all cases',
      ],
      fairPlay: 'We believe in pure skill-based competition only ⚔️\nPlay fair, respect rules and enjoy the game 🏆',
    };
  }
  if (tournamentType === 'squad') {
    return {
      rules: [
        '❌ No Aim Bot, Hacks, Scripts or any unfair tools allowed',
        '❌ PC players are strictly not allowed in any match',
        '📱 Only Smartphone & Tablet users are eligible to participate',
        '🎯 Only players with Level 40+ are allowed to participate',
        '🔄 Players are not allowed to use revive machines',
        '🚫 Players are not allowed to use reviving points',
        '🎯 Headshot rate should not exceed 70%',
        '🚫 If any player is found using hacks or cheats, the entire squad payment will be cancelled without warning',
        '⚖️ Decision of Battle Zone management will be final in all cases',
      ],
      fairPlay: 'We believe in pure skill-based squad competition only ⚔️\nPlay fair, respect rules and enjoy the game 🏆',
    };
  }
  // solo (default)
  return {
    rules: [
      '❌ No Aim Bot, Hacks, Scripts or any unfair tools allowed',
      '❌ PC players are strictly not allowed in any match',
      '📱 Only Smartphone & Tablet users are eligible to participate',
      '🎯 Only players with Level 40+ are allowed to participate',
      '🎯 Headshot rate should not exceed 70%',
      '🚫 In SOLO mode, Dimetri (Dimitri) character is not allowed to use',
      '🚫 If any player is found using hacks or cheats, their payment will be cancelled without warning',
      '⚖️ Decision of Battle Zone management will be final in all cases',
    ],
    fairPlay: 'We believe in pure skill-based competition only ⚔️\nPlay fair, respect rules and enjoy the game 🏆',
  };
};

const getCSNormalDescription = (format) => {
  if (format === '4v4') {
    return [
      'Room ID & Password will be shared 10–15 minutes before the match starts ⏳',
      'All match details, updates & announcements will be provided only in the Battle Zone app 📲',
      'Squad leaders are responsible for their team entry ⚠️',
      'Players must join on time, late entry will not be allowed 🌐',
      'Stable internet connection is required before starting the match 📶',
      '🏁 Match result will be updated within 30 minutes after match completion',
    ];
  }
  // 1v1 and 2v2 description
  return [
    'Room ID & Password will be shared 10–15 minutes before the match starts ⏳',
    'All match details, updates & announcements will be provided only in the Battle Zone app 📲',
    'Players must join on time, late entry will not be allowed ⚠️',
    'Stable internet connection is required before starting the match 🌐',
    '🏁 Match result will be updated within 30 minutes after match completion',
  ];
};

const getCSNormalRules = (format) => {
  const commonRules = [
    '❌ No Aim Bot, Hacks, Scripts or any unfair tools allowed',
    '❌ PC players are strictly not allowed in any match',
    '📱 Only Smartphone & Tablet users are eligible to participate',
    '🎯 Only players with Level 40+ are allowed to participate',
    '🚫 Any player found using hacks or cheats will be disqualified and no payment will be given',
    '⚖️ Decision of Battle Zone management will be final in all cases',
  ];

  if (format === '2v2') {
    return {
      rules: commonRules,
      fairPlay: 'This is a pure skill-based 2 vs 2 competition ⚔️\nRespect rules and enjoy fair gaming 🏆',
    };
  }
  if (format === '4v4') {
    return {
      rules: commonRules,
      fairPlay: 'This is a pure skill-based 4 vs 4 competition ⚔️\nRespect rules and enjoy fair gaming 🏆',
    };
  }
  // Default to 1v1
  return {
    rules: commonRules,
    fairPlay: 'This is a pure skill-based 1v1 competition ⚔️\nRespect rules and enjoy fair gaming 🏆',
  };
};

const getCSSpecialDescription = (format) => {
  return [
    'Room ID & Password will be shared 10–15 minutes before the match starts ⏳',
    'All match details, updates & announcements will be provided only in the Battle Zone app 📲',
    'Players must join on time, late entry will not be allowed ⚠️',
    'A stable internet connection is required before starting the match 🌐',
    '🏁 Match results will be updated within 30 minutes after match completion',
  ];
};

const getCSSpecialRules = (format, mode) => {
  const isOneTap = mode === 'onetap';
  const matchTypeLine = isOneTap ? '🎯 This is a One Tap Match' : '🎯 This is an Only Headshot Match';
  
  const rules = [
    '❌ No Aim Bot, Hacks, Scripts, or any unfair tools allowed',
    '❌ PC players are strictly not allowed in any match',
    '📱 Only Smartphone & Tablet users are eligible to participate',
    '🎯 Only players with Level 40+ are allowed to participate',
    matchTypeLine,
  ];

  if (format === '1v1') {
    rules.push('🚫 Character skills will be OFF');
    rules.push('🚫 Loadout system will be OFF');
  } else {
    rules.push('🚫 Loadout system will be OFF');
    rules.push('🚫 Character skills will be ON');
  }

  rules.push('🚫 Any player found using hacks or cheats will be disqualified and no payment will be given');
  rules.push('⚖️ The decision of Battle Zone management will be final in all cases');

  let fairPlay = '';
  if (format === '1v1') {
    fairPlay = `This is a pure skill-based 1 vs 1 ${isOneTap ? 'onetap' : 'headshot'} competition ⚔️\nRespect the rules and enjoy fair gaming 🏆`;
  } else if (format === '2v2') {
    fairPlay = `This is a pure skill-based 2 vs 2 ${isOneTap ? 'onetap' : 'headshot'} competition ⚔️\nRespect the rules and enjoy fair gaming 🏆`;
  } else {
    fairPlay = `This is a pure skill-based 4 vs 4 ${isOneTap ? 'onetap' : 'headshot'} competition ⚔️\nRespect the rules and enjoy fair gaming 🏆`;
  }

  return { rules, fairPlay };
};

const getLWDescription = (format) => {
  return [
    'Room ID & Password will be shared 10–15 minutes before the match starts ⏳',
    'All match details, updates & announcements will be provided only in the Battle Zone app 📲',
    'Players must join on time, late entry will not be allowed ⚠️',
    'A stable internet connection is required before starting the match 🌐',
    '🏁 Match results will be updated within 30 minutes after match completion',
  ];
};

const getLWRules = (format, mode) => {
  const isHeadshot = mode === 'headshot';
  const isOneTap = mode === 'onetap';
  const fmtLabel = format === '2v2' ? '2 vs 2' : '1 vs 1';

  const rules = [
    '❌ No Aim Bot, Hacks, Scripts, or any unfair tools allowed',
    '❌ PC players are strictly not allowed in any match',
    '📱 Only Smartphone & Tablet users are eligible to participate',
    '🎯 Only players with Level 40+ are allowed to participate',
  ];

  if (isHeadshot) {
    rules.push('🎯 This is an Only Headshot Match');
    rules.push('🚫 Loadout system will be OFF');
  } else if (isOneTap) {
    rules.push('🎯 This is a One Tap Match');
    rules.push('🚫 Loadout system will be OFF');
  }

  rules.push('🚫 Character skills will be ON');
  rules.push('🚫 Any player found using hacks or cheats will be disqualified and no payment will be given');
  rules.push('⚖️ The decision of Battle Zone management will be final in all cases');

  const fairPlay = `This is a pure skill-based Lone Wolf ${fmtLabel} competition ⚔️\nRespect rules and enjoy fair gaming 🏆`;

  return { rules, fairPlay };
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
  

  const [showAllPrizes, setShowAllPrizes] = useState(false);

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
      const handleSlotUpdate = (data) => {
        if (data.tournamentId === tournament._id) {
          setTournament(prev => prev ? { ...prev, filledSlots: data.filledSlots } : null);
        }
      };
      const handleBracketUpdate = (data) => {
        if (data.tournamentId === tournament._id) {
          loadData();
        }
      };
      
      socket.on('tournament:slot_update', handleSlotUpdate);
      socket.on('tournament:bracket_update', handleBracketUpdate);
      return () => {
        socket.off('tournament:slot_update', handleSlotUpdate);
        socket.off('tournament:bracket_update', handleBracketUpdate);
      };
    }
  }, [socket, tournament]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const userRegistration = tournament && user 
    ? participants.find(p => p.userId?._id === user.id || p.userId === user.id || p.userId?._id === user._id)
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
      let details = `Slot Number: #${userRegistration.slotNumber}\n`;
      if (tournament.gameMode === 'battle_royale') {
        details += `UID: ${userRegistration.gameUID}`;
      } else {
        if (userRegistration.teamName) {
          details += `Team Name: ${userRegistration.teamName}\n`;
        }
        details += `UID: ${userRegistration.gameUID}`;
      }
      Alert.alert('Your Registration 🎮', details);
    } else {
      Alert.alert('Not Registered ⚠️', 'Join the lobby to secure your slot!');
    }
  };

  const getRightButtonConfig = () => {
    if (tournament.status === 'completed' || tournament.status === 'ended' || tournament.status === 'results') {
      return { text: 'VIEW RESULTS', disabled: false, styleClass: 'bg-rose-600 dark:bg-rose-500' };
    }
    if (isRegistered) {
      if (isLive) {
        return { text: 'ENTER LOBBY', disabled: false, styleClass: 'bg-violet-600 dark:bg-violet-500' };
      }
      return { text: 'LOBBY LOCKED', disabled: false, styleClass: 'bg-slate-500 dark:bg-slate-700' };
    }
    if (isFull) {
      return { text: 'MATCH FULL', disabled: true, styleClass: 'bg-slate-400 dark:bg-slate-800' };
    }
    return { text: 'REGISTER NOW', disabled: false, styleClass: 'bg-rose-600 dark:bg-rose-500' };
  };

  const rightBtn = getRightButtonConfig();

  const handleRightButtonPress = () => {
    if (tournament.status === 'completed' || tournament.status === 'ended' || tournament.status === 'results') {
      navigation.navigate('ViewResults', { tournamentId: tournament._id, slug: tournament.slug, title: tournament.title });
      return;
    }
    if (isRegistered) {
      if (isLive) {
        handleEnterLobby();
      } else {
        Alert.alert(
          'Lobby Locked 🔑', 
          'Room ID & Password will unlock here automatically 15 minutes before the match start time.'
        );
      }
    } else {
      handleRegisterPress();
    }
  };

  const isCSLW = tournament.gameMode === 'clash_squad' || tournament.gameMode === 'lone_wolf';
  const hasBracket = tournament.bracket && tournament.bracket.length > 0;

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      <ScrollView 
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{ height: insets.top }} />

        {/* Banner Overlays */}
        <View>
          {/* Back button above image */}
          <View className="flex-row items-center px-4 mb-3">
            <Pressable 
              onPress={() => navigation.goBack()} 
              className="p-2.5 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl border border-slate-300 dark:border-slate-700"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <ArrowLeft size={18} color={isDark ? '#E2E8F0' : '#1E293B'} strokeWidth={2.5} />
            </Pressable>
            <View className="flex-1 items-center mr-10">
              <Text className="text-slate-900 dark:text-white font-black text-base uppercase tracking-widest">Tournament Details</Text>
            </View>
          </View>

          <View className="relative px-4">
            <Image
              source={getGameBannerSource(tournament)}
              style={{ width: '100%', height: 200, borderRadius: 12 }}
              resizeMode="stretch"
            />
          </View>

          {/* Countdown just below banner */}
          <View className="flex-row items-center px-4 mt-3">
            <Text className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest mr-3">Time Left</Text>
            <View className="flex-1">
              <Countdown targetDate={tournament.scheduledAt} isDark={isDark} />
            </View>
          </View>
        </View>

        <View className="px-4 pb-2 mt-4">
          {/* Title */}
          <Text className="text-rose-600 dark:text-rose-400 text-lg font-black uppercase mb-4 tracking-wide">
            {tournament.title}
          </Text>

          {/* VIEW TAB 1: DETAILS */}
          <View>
              {/* Stats Grid */}
              <View className="mb-6">
                <View className="flex-row mb-3" style={{ gap: 12 }}>
                  <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 flex-1 items-center justify-center shadow-sm">
                    <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">TYPE</Text>
                    <Text className="font-extrabold text-slate-900 dark:text-white uppercase text-[13px] mt-1">{tournament.format || tournament.tournamentType}</Text>
                  </View>
                  <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 flex-1 items-center justify-center shadow-sm">
                    <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mode</Text>
                    <Text className="font-extrabold text-slate-900 dark:text-white capitalize text-[13px] mt-1">{tournament.gameMode?.replace('_', ' ')}</Text>
                  </View>
                  <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 flex-1 items-center justify-center shadow-sm">
                    <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Map</Text>
                    <Text className="font-extrabold text-slate-900 dark:text-white capitalize text-[13px] mt-1">{tournament.mode || tournament.mapType || 'Bermuda'}</Text>
                  </View>
                </View>

                <View className="flex-row" style={{ gap: 12 }}>
                  <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 flex-1 flex-row items-center justify-center shadow-sm">
                    <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ENTRY FEE: </Text>
                    <GoldCoin size={12} />
                    <Text className="font-extrabold text-slate-900 dark:text-white text-[13px] ml-1">{tournament.entryFee} Coins</Text>
                  </View>
                  <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 flex-1 items-center justify-center shadow-sm">
                    <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SCHEDULE</Text>
                    <Text className="font-extrabold text-slate-900 dark:text-white text-[11.5px] mt-1">{formatDate(tournament.scheduledAt)}</Text>
                  </View>
                </View>
              </View>

              {/* Prize Details Section */}
              {((isCSLW && Number(tournament.winnerPrize || tournament.prizePool) > 0) ||
                (!isCSLW && (Number(tournament.firstPrize) > 0 || Number(tournament.secondPrize) > 0 || Number(tournament.thirdPrize) > 0 || Number(tournament.perKillReward) > 0))) ? (
                <View className="mb-6 space-y-2.5">
                  <Text className="text-slate-500 dark:text-slate-400 font-black text-sm uppercase tracking-widest px-0.5">Prize Pools Distribution</Text>
                  <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                    {isCSLW ? (
                      <View className="flex-row items-center justify-center">
                        <Text className="text-emerald-500 font-black text-base">🏆 Winner Champion Prize: </Text>
                        <GoldCoin size={15} />
                        <Text className="text-emerald-500 font-black text-base ml-1">{tournament.winnerPrize || tournament.prizePool} Coins!</Text>
                      </View>
                    ) : (
                      <View className="space-y-2.5">
                        {Number(tournament.firstPrize) > 0 && (
                          <View className="flex-row items-center">
                            <Text className="text-slate-700 dark:text-slate-300 text-sm font-bold">🥇 Rank #1: </Text>
                            <GoldCoin size={13} />
                            <Text className="text-slate-700 dark:text-slate-300 text-sm font-bold ml-1.5">{tournament.firstPrize} Coins</Text>
                          </View>
                        )}
                        {Number(tournament.secondPrize) > 0 && (
                          <View className="flex-row items-center">
                            <Text className="text-slate-700 dark:text-slate-300 text-sm font-bold">🥈 Rank #2: </Text>
                            <GoldCoin size={13} />
                            <Text className="text-slate-700 dark:text-slate-300 text-sm font-bold ml-1.5">{tournament.secondPrize} Coins</Text>
                          </View>
                        )}
                        {Number(tournament.thirdPrize) > 0 && (
                          <View className="flex-row items-center">
                            <Text className="text-slate-700 dark:text-slate-300 text-sm font-bold">🥉 Rank #3: </Text>
                            <GoldCoin size={13} />
                            <Text className="text-slate-700 dark:text-slate-300 text-sm font-bold ml-1.5">{tournament.thirdPrize} Coins</Text>
                          </View>
                        )}
                        {Number(tournament.perKillReward) > 0 && (
                          <View className="flex-row items-center mt-1">
                            <Text className="text-rose-500 text-[11px] font-extrabold">💀 Per Kill Reward: </Text>
                            <GoldCoin size={12} />
                            <Text className="text-rose-500 text-[11px] font-extrabold ml-1">{tournament.perKillReward} Coins per elimination</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              ) : null}

              {/* Slots progress */}
              <View className="mb-6 space-y-2.5">
                <Text className="text-slate-500 dark:text-slate-400 font-black text-sm uppercase tracking-widest px-0.5">Lobby Slot Progress</Text>
                <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                  <View className="flex-row justify-between mb-2.5 px-0.5">
                    <Text className="text-slate-800 dark:text-slate-200 font-bold text-xs uppercase">Filled</Text>
                    <Text className="text-rose-500 font-bold text-xs">
                      {tournament.filledSlots}/{tournament.totalSlots} Slots ({spotsLeft} left)
                    </Text>
                  </View>
                  <View className="h-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-full overflow-hidden">
                    <View style={{ width: `${progress}%`, height: '100%', backgroundColor: '#EF4444' }} className="rounded-full" />
                  </View>
                </View>
              </View>

              {/* Match description */}
              {(tournament.description || (tournament.rules && tournament.rules.length > 0)) ? (
                <View className="mb-6 space-y-2.5">
                  <Text className="text-slate-500 dark:text-slate-400 font-black text-sm uppercase tracking-widest px-0.5">About This Match</Text>
                  <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                    {tournament.description ? (
                      <View className="mb-4">
                        <Text className="text-slate-950 dark:text-white font-extrabold text-sm mb-2.5">Description:</Text>
                        {(typeof tournament.description === 'string'
                          ? tournament.description.split('\n').map(line => line.trim()).filter(line => line.length > 0)
                          : (Array.isArray(tournament.description) ? tournament.description : [])
                        ).map((line, idx) => {
                          const startsWithStar = /^\s*\*+\s*/.test(line);
                          const cleanedLine = line.replace(/^\s*\*+\s*/, '').trim();
                          return (
                            <Text key={idx} className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-2">
                              {startsWithStar ? `${idx + 1}. ` : ''}{startsWithStar ? cleanedLine : line}
                            </Text>
                          );
                        })}
                      </View>
                    ) : null}

                    {tournament.rules && tournament.rules.length > 0 ? (
                      <View>
                        <Text className="text-slate-950 dark:text-white font-extrabold text-sm mb-2.5">Rules & Restrictions:</Text>
                        {tournament.rules.map((rule, idx) => {
                          const startsWithStar = /^\s*\*+\s*/.test(rule);
                          const cleanedRule = rule.replace(/^\s*\*+\s*/, '').trim();
                          return (
                            <Text key={idx} className="text-slate-500 text-sm mb-2">
                              {startsWithStar ? `${idx + 1}. ` : ''}{startsWithStar ? cleanedRule : rule}
                            </Text>
                          );
                        })}
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}

              {/* Players Joined / Match Results list */}
              <View className="mb-6 space-y-2.5">
                <Text className="text-slate-500 dark:text-slate-400 font-black text-sm uppercase tracking-widest px-0.5">
                  {(tournament.status === 'completed' && tournament.resultsDeclared) ? 'Match Leaderboard / Results' : `Registered Players (${participants.length})`}
                </Text>
                <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                  {(tournament.status === 'completed' && tournament.resultsDeclared) ? (
                    participants.some(p => p.rank > 0 || p.kills > 0 || p.prizeWon > 0) ? (
                      [...participants]
                        .sort((a, b) => {
                          const rA = a.rank || 999;
                          const rB = b.rank || 999;
                          if (rA !== rB) return rA - rB;
                          return (b.points || 0) - (a.points || 0);
                        })
                        .map((player, idx, arr) => (
                          <View 
                            key={player.slotNumber} 
                            className={`flex-row justify-between items-center py-2.5 ${
                              idx === arr.length - 1 ? '' : 'border-b border-slate-100 dark:border-slate-800/60'
                            }`}
                          >
                            <View className="flex-row items-center flex-1 mr-2">
                              <Text className="text-rose-500 dark:text-cyan-400 font-black text-xs w-6">#{player.rank || '-'}</Text>
                              <View>
                                <Text className="text-slate-800 dark:text-slate-200 font-bold text-sm">{player.displayName}</Text>
                                <Text className="text-slate-400 text-[9px] font-bold uppercase mt-0.5">Slot #{player.slotNumber}</Text>
                              </View>
                            </View>
                            <View className="flex-row items-center" style={{ gap: 12 }}>
                              <View className="items-end">
                                <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase">Kills</Text>
                                <Text className="text-slate-900 dark:text-white font-black text-xs mt-0.5">{player.kills || 0}</Text>
                              </View>
                              {player.prizeWon > 0 && (
                                <View className="bg-emerald-500/10 dark:bg-emerald-500/25 px-2 py-1 rounded-lg flex-row items-center">
                                  <GoldCoin size={10} />
                                  <Text className="text-emerald-500 font-black text-[10.5px] ml-1">+{player.prizeWon}</Text>
                                </View>
                              )}
                            </View>
                          </View>
                        ))
                    ) : (
                      <Text className="text-slate-500 dark:text-slate-400 text-sm font-semibold text-center py-6 leading-relaxed">
                        🏁 Match results are being calculated by the administrators. Please check back soon!
                      </Text>
                    )
                  ) : (
                    participants.length === 0 ? (
                      <Text className="text-slate-450 text-sm font-semibold text-center py-4">Lobby is currently empty.</Text>
                    ) : (
                      participants.map((player, idx) => (
                        <View 
                          key={player.slotNumber} 
                          className={`flex-row justify-between items-center py-2.5 ${
                            idx === participants.length - 1 ? '' : 'border-b border-slate-100 dark:border-slate-800/60'
                          }`}
                        >
                          <Text className="text-slate-800 dark:text-slate-200 font-bold text-sm">{player.displayName}</Text>
                          <Text className="text-slate-400 text-[10.5px] font-bold">Slot #{player.slotNumber}</Text>
                        </View>
                      ))
                    )
                  )}
                </View>
              </View>
            </View>

          {/* Spacing below the last card to clear bottom bar */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View 
        style={{ height: 56 + insets.bottom, paddingBottom: insets.bottom }}
        className="flex-row w-full border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0A0F1A]/95 absolute bottom-0 shadow-lg"
      >
        <Pressable 
          onPress={handleMyEntriesPress}
          className="flex-1"
          style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full h-full items-center justify-center"
          >
            <Text className="text-white font-black text-xs uppercase tracking-wider">MY ENTRIES</Text>
          </LinearGradient>
        </Pressable>
        <Pressable 
          onPress={handleRightButtonPress}
          disabled={rightBtn.disabled}
          className="flex-1"
          style={({ pressed }) => [{ opacity: pressed && !rightBtn.disabled ? 0.85 : 1 }]}
        >
          <LinearGradient
            colors={
              rightBtn.disabled
                ? (isDark ? ['#334155', '#1E293B'] : ['#CBD5E1', '#94A3B8'])
                : (rightBtn.styleClass.includes('rose')
                    ? ['#F43F5E', '#E11D48']
                    : (rightBtn.styleClass.includes('violet')
                        ? ['#8B5CF6', '#6D28D9']
                        : (isDark ? ['#475569', '#334155'] : ['#94A3B8', '#64748B'])))
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full h-full items-center justify-center"
          >
            <Text className="text-white font-black text-xs uppercase tracking-wider">
              {rightBtn.text}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
