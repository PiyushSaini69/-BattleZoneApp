import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl, Alert, useColorScheme as useRNColorScheme, TextInput, Modal, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Countdown from '../../components/ui/Countdown';
import { Plus, ArrowLeft, Check, X, Search, Trash2, ShieldAlert, Award, UserPlus, CreditCard, DollarSign, Activity } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { CONFIG } from '../../config';

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
  switch (item.game) {
    case 'bgmi': return { uri: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300' };
    case 'valorant': return { uri: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=300' };
    case 'cod_mobile': return { uri: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=300' };
    default: return { uri: CONFIG.DEFAULT_BANNER };
  }
};

export default function AdminDashboardScreen({ navigation }) {
  const { colorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const isDark = colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  // Tab state
  const [activeTab, setActiveTab] = useState('stats'); // stats, matches, brackets, users, payouts
  const [matchesSubTab, setMatchesSubTab] = useState('upcoming'); // ongoing, upcoming, results

  // Core MERN states
  const [stats, setStats] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filters & Searches
  const [userSearch, setUserSearch] = useState('');


  // Modals state
  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [selectedRoomT, setSelectedRoomT] = useState(null);
  const [roomIdInput, setRoomIdInput] = useState('');
  const [roomPasswordInput, setRoomPasswordInput] = useState('');

  // Results screen navigation handles the state

  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [adjustingUser, setAdjustingUser] = useState(null);
  const [adjAmount, setAdjAmount] = useState('100');
  const [adjType, setAdjType] = useState('deposit'); // deposit, winning, bonus
  const [adjAction, setAdjAction] = useState('credit'); // credit, debit
  const [adjDesc, setAdjDesc] = useState('Admin adjustment');



  const loadAdminData = async () => {
    try {
      const statsRes = await request('/admin/dashboard');
      if (statsRes.success) setStats(statsRes.data);

      const tourneysRes = await request('/tournaments?includeDrafts=true&limit=200');
      if (tourneysRes.success) setTournaments(tourneysRes.data.tournaments);

      const wdRes = await request('/admin/withdrawals');
      if (wdRes.success) setWithdrawals(wdRes.data.withdrawals);
      
      if (activeTab === 'users') {
        const usersRes = await request(`/admin/users?search=${userSearch}`);
        if (usersRes.success) setUsers(usersRes.data.users);
      }
    } catch (e) {
      console.log('Error loading admin details:', e.message);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [activeTab, userSearch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAdminData();
    setRefreshing(false);
  };

  // 1. Tournaments Actions
  const handlePublishTournament = async (tId) => {
    try {
      const res = await request(`/admin/tournaments/${tId}/room`, {
        method: 'PATCH',
        body: JSON.stringify({ roomId: 'TBD', roomPassword: 'TBD' })
      });
      if (res.success) {
        Alert.alert('Success', 'Tournament is now open for registrations!');
        await loadAdminData();
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const submitRoomDetails = async () => {
    if (!roomIdInput || !roomPasswordInput) {
      Alert.alert('Validation Error', 'Room ID and Password are required.');
      return;
    }
    try {
      const res = await request(`/admin/tournaments/${selectedRoomT._id}/room`, {
        method: 'PATCH',
        body: JSON.stringify({ roomId: roomIdInput, roomPassword: roomPasswordInput })
      });
      if (res.success) {
        Alert.alert('Success', 'Room credentials published to players!');
        setRoomModalVisible(false);
        setSelectedRoomT(null);
        setMatchesSubTab('ongoing');
        await loadAdminData();
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const handleCancelTournament = async (tId) => {
    Alert.alert('Cancel Tournament 🚫', 'This will refund the entry fee to all registered players. Are you sure?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: async () => {
        try {
          const res = await request(`/admin/tournaments/${tId}/cancel`, { method: 'PATCH' });
          if (res.success) {
            Alert.alert('Success', 'Tournament cancelled and entry fees refunded!');
            await loadAdminData();
          }
        } catch (e) {
          Alert.alert('Error', e.message);
        }
      }}
    ]);
  };

  const handleCompleteTournament = async (tId) => {
    Alert.alert('Complete Match 🏆', 'Are you sure you want to mark this match as completed?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Complete', style: 'default', onPress: async () => {
        try {
          const res = await request(`/admin/tournaments/${tId}/complete`, { method: 'PATCH' });
          if (res.success) {
            Alert.alert('Success', 'Match marked as completed successfully!');
            await loadAdminData();
          }
        } catch (e) {
          Alert.alert('Error', e.message);
        }
      }}
    ]);
  };

  // Results declared via separate DeclareResultsScreen



  // 3. User adjustments & ban
  const handleToggleBan = async (user) => {
    const isBanned = user.isBanned;
    const action = isBanned ? 'unban' : 'ban';
    
    const triggerRequest = async (reason = '') => {
      try {
        const res = await request(`/admin/users/${user._id}/${action}`, {
          method: 'PATCH',
          body: !isBanned ? JSON.stringify({ reason }) : undefined
        });
        if (res.success) {
          Alert.alert('Success', `User successfully ${action}ned.`);
          await loadAdminData();
        }
      } catch (e) {
        Alert.alert('Error', e.message);
      }
    };

    if (!isBanned) {
      Alert.prompt('Ban User 🚫', 'Enter reason for suspension:', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Ban Account', onPress: (text) => triggerRequest(text) }
      ]);
    } else {
      Alert.alert('Unban User', `Are you sure you want to restore access for ${user.username}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore Access', onPress: () => triggerRequest() }
      ]);
    }
  };

  const submitWalletAdjustment = async () => {
    if (isNaN(adjAmount) || parseFloat(adjAmount) <= 0) {
      Alert.alert('Error', 'Adjustment amount must be a positive number.');
      return;
    }
    try {
      const res = await request(`/admin/users/${adjustingUser._id}/adjust-wallet`, {
        method: 'POST',
        body: JSON.stringify({
          amount: parseFloat(adjAmount),
          walletType: adjType,
          action: adjAction,
          description: adjDesc
        })
      });
      if (res.success) {
        Alert.alert('Success', 'User wallet updated successfully!');
        setWalletModalVisible(false);
        setAdjustingUser(null);
        await loadAdminData();
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  // 4. Withdrawal queue
  const handleApprove = async (id) => {
    Alert.alert('Approve Withdrawal ✅', 'Mark this payout request as completed?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve Payout', onPress: async () => {
        try {
          const res = await request(`/admin/withdrawals/${id}/approve`, {
            method: 'PATCH',
            body: JSON.stringify({ transferReference: `MOB-REF-${Math.floor(Math.random() * 9000000)}` })
          });
          if (res.success) {
            Alert.alert('Success', 'Withdrawal completed successfully!');
            await loadAdminData();
          }
        } catch (e) {
          Alert.alert('Error', e.message);
        }
      }}
    ]);
  };

  const handleReject = async (id) => {
    Alert.alert(
      'Reject Withdrawal ❌', 
      'Select a preset rejection reason:', 
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Invalid UPI ID', onPress: () => submitRejection(id, 'Invalid UPI ID details.') },
        { text: 'Name Mismatch', onPress: () => submitRejection(id, 'Account holder name mismatch.') },
        { text: 'Flagged Activity', onPress: () => submitRejection(id, 'Wallet flagged for suspicious matches.') },
      ]
    );
  };

  const submitRejection = async (id, reason) => {
    try {
      const res = await request(`/admin/withdrawals/${id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason })
      });
      if (res.success) {
        Alert.alert('Success', 'Withdrawal request rejected.');
        await loadAdminData();
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      {/* Top Navbar */}
      <View 
        className="bg-slate-100/60 dark:bg-slate-950/40 p-4 border-b border-slate-200 dark:border-slate-900/60 flex-row items-center justify-between"
        style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 16 }}
      >
        {navigation.canGoBack() ? (
          <Pressable onPress={() => navigation.goBack()} className="p-1">
            <ArrowLeft size={20} color={isDark ? '#fff' : '#0f172a'} />
          </Pressable>
        ) : (
          <View className="w-8" />
        )}
        <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide">Admin Control</Text>
        <Pressable 
          onPress={() => navigation.navigate('CreateTournament')}
          className="bg-rose-600 w-8 h-8 rounded-lg items-center justify-center border border-rose-500 shadow-lg"
        >
          <Plus size={16} color="#fff" />
        </Pressable>
      </View>

      {/* Segmented Tab Navigator */}
      <View className="bg-slate-200/50 dark:bg-slate-900/40 py-2 border-b border-slate-200 dark:border-slate-800">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}>
          {[
            { id: 'stats', label: 'Dashboard' },
            { id: 'matches', label: 'Matches' },
            { id: 'payouts', label: 'Payouts' }
          ].map(tab => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl border ${
                activeTab === tab.id 
                  ? 'bg-rose-600 border-rose-500' 
                  : (isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200')
              }`}
            >
              <Text className={`text-[10px] font-extrabold uppercase tracking-wide ${activeTab === tab.id ? 'text-white' : 'text-slate-500'}`}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Core Scroll Area */}
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={isDark ? '#EF4444' : '#E11D48'} 
            colors={[isDark ? '#EF4444' : '#E11D48']} 
          />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
      >
        
        {/* VIEW 1: STATS */}
        {activeTab === 'stats' && (
          <View className="space-y-4">
            <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-widest px-0.5 mb-2">Platform Matches</Text>
            
            <View className="flex-row justify-between mb-4" style={{ gap: 8 }}>
              <GlassCard className="flex-1 p-3.5 items-center justify-center" glowColor="red">
                <View className="flex-row items-center" style={{ gap: 4 }}>
                  <GoldCoin size={14} />
                  <Text className="text-slate-950 dark:text-white text-base font-black">{stats?.revenue?.total || 0}</Text>
                </View>
                <Text className="text-slate-500 text-[8px] uppercase font-bold text-center mt-1">Revenue</Text>
              </GlassCard>
              <GlassCard className="flex-1 p-3.5 items-center" glowColor="red">
                <Text className="text-slate-950 dark:text-white text-base font-black">{stats?.tournaments?.total || 0}</Text>
                <Text className="text-slate-500 text-[8px] uppercase font-bold text-center mt-1">Matches</Text>
              </GlassCard>
              <GlassCard className="flex-1 p-3.5 items-center" glowColor="red">
                <Text className="text-slate-950 dark:text-white text-base font-black">{stats?.registrations?.total || 0}</Text>
                <Text className="text-slate-500 text-[8px] uppercase font-bold text-center mt-1">Regs</Text>
              </GlassCard>
            </View>

            <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-widest px-0.5 mb-2">Recent Registrations</Text>
            {stats?.registrations?.recent && stats.registrations.recent.length === 0 ? (
              <GlassCard className="p-6 items-center"><Text className="text-slate-500 text-xs font-semibold">No recent registrations.</Text></GlassCard>
            ) : (
              stats?.registrations?.recent?.map((reg) => (
                <GlassCard key={reg._id} className="p-3 mb-2 flex-row justify-between items-center" glowColor="purple">
                  <View className="flex-1">
                    <Text className="text-slate-950 dark:text-white font-bold text-xs">{reg.userId?.username || 'Player'}</Text>
                    <Text className="text-slate-400 text-[9px] mt-0.5 truncate">{reg.tournamentId?.title || 'Match Title'}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[#06B6D4] font-mono text-[9px] uppercase">{reg.tournamentId?.gameMode?.replace('_', ' ')}</Text>
                    <Text className="text-slate-500 text-[8px] mt-0.5">{new Date(reg.createdAt).toLocaleDateString()}</Text>
                  </View>
                </GlassCard>
              ))
            )}
          </View>
        )}

        {/* VIEW 2: LOBBIES MATCHES */}
        {activeTab === 'matches' && (
          <View className="space-y-4">
            {/* Matches Sub-tabs Selector */}
            <View className="flex-row bg-slate-200/50 dark:bg-slate-950/40 p-1 border border-slate-300/40 dark:border-slate-800 rounded-xl mb-4">
              {[
                { id: 'ongoing', label: 'Ongoing' },
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'results', label: 'Results' }
              ].map((subTab) => (
                <Pressable
                  key={subTab.id}
                  onPress={() => setMatchesSubTab(subTab.id)}
                  className={`flex-1 py-2 rounded-lg items-center ${
                    matchesSubTab === subTab.id ? (isDark ? 'bg-slate-800' : 'bg-white') : ''
                  }`}
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                >
                  <Text className={`text-[9.5px] font-black uppercase tracking-wider ${
                    matchesSubTab === subTab.id ? 'text-rose-500' : 'text-slate-500'
                  }`}>
                    {subTab.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {(() => {
              let filtered = tournaments.filter((t) => {
                if (matchesSubTab === 'ongoing') {
                  return t.status === 'live' || t.status === 'ongoing';
                } else if (matchesSubTab === 'upcoming') {
                  return t.status === 'registering' || t.status === 'upcoming' || t.status === 'scheduled' || t.status === 'draft';
                } else if (matchesSubTab === 'results') {
                  return t.status === 'completed' || t.status === 'ended' || t.status === 'results' || t.status === 'cancelled';
                }
                return true;
              });

              if (matchesSubTab === 'results') {
                filtered = filtered.sort((a, b) => {
                  const dateA = a.completedAt ? new Date(a.completedAt) : new Date(a.scheduledAt);
                  const dateB = b.completedAt ? new Date(b.completedAt) : new Date(b.scheduledAt);
                  return dateB - dateA;
                });
              }

              if (filtered.length === 0) {
                return (
                  <GlassCard className="p-10 items-center">
                    <Text className="text-slate-500 text-xs font-semibold text-center">
                      No {matchesSubTab} matches available.
                    </Text>
                  </GlassCard>
                );
              }

              return filtered.map((t) => {
                const progress = Math.min((t.filledSlots / t.totalSlots) * 100, 100);
                const spotsLeft = t.totalSlots - t.filledSlots;
                const isFull = spotsLeft <= 0;
                const isCSLW = t.gameMode === 'clash_squad' || t.gameMode === 'lone_wolf';

                return (
                  <GlassCard key={t._id} className="mb-5 overflow-hidden p-0" glowColor="red">
                    <Image 
                      source={getGameBannerSource(t)}
                      style={{ width: '100%', height: 160 }}
                      resizeMode="stretch"
                    />

                    <View className="p-4 bg-white/95 dark:bg-[#0A0F1A]/95">
                      {/* Header Row: Title, Time */}
                      <View className="mb-4 flex-row justify-between items-center">
                        <View className="flex-1 mr-2">
                          <Text className="text-slate-900 dark:text-white text-sm font-black uppercase" numberOfLines={1}>
                            {t.title}
                          </Text>
                          <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold mt-1">
                            Time: {formatDate(t.scheduledAt)}
                          </Text>
                        </View>
                        <Badge 
                          text={t.status}
                          variant={
                            t.status === 'completed' 
                              ? 'success' 
                              : t.status === 'cancelled' 
                              ? 'danger' 
                              : (t.status === 'live' || t.status === 'ongoing') 
                              ? 'purple' 
                              : 'warning'
                          }
                        />
                      </View>

                      {/* Stats Grid: Row 1 */}
                      <View className="flex-row justify-between mb-4">
                        <View className="items-start flex-1">
                          <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1">
                            {isCSLW ? 'Winner Prize' : 'Prize Pool'}
                          </Text>
                          <View className="flex-row items-center">
                            <GoldCoin size={14} />
                            <Text className="text-slate-900 dark:text-white text-xs font-black ml-1">
                              {isCSLW ? (t.winnerPrize || t.prizePool) : t.prizePool}
                            </Text>
                          </View>
                        </View>
                        <View className="items-start flex-1">
                          <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1">
                            {isCSLW ? 'Rule Mode' : 'Per Kill'}
                          </Text>
                          {isCSLW ? (
                            <Text className="text-slate-950 dark:text-white text-xs font-black uppercase mt-0.5">{t.mode || 'Normal'}</Text>
                          ) : (
                            <View className="flex-row items-center">
                              <GoldCoin size={14} />
                              <Text className="text-slate-900 dark:text-white text-xs font-black ml-1">
                                {t.perKillReward || t.perKill || 0}
                              </Text>
                            </View>
                          )}
                        </View>
                        <View className="items-start flex-1">
                          <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1">Entry Fee</Text>
                          <View className="flex-row items-center">
                            <GoldCoin size={14} />
                            <Text className="text-slate-900 dark:text-white text-xs font-black ml-1">{t.entryFee}</Text>
                          </View>
                        </View>
                      </View>

                      {/* Stats Grid: Row 2 */}
                      <View className="flex-row justify-between mb-4">
                        <View className="items-start flex-1">
                          <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1">Type</Text>
                          <Text className="text-slate-900 dark:text-white text-xs font-bold capitalize">{t.tournamentType || 'Solo'}</Text>
                        </View>
                        <View className="items-start flex-1">
                          <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1">Map</Text>
                          <Text className="text-slate-900 dark:text-white text-xs font-bold capitalize">{t.map || t.mapType || 'Bermuda'}</Text>
                        </View>
                        <View className="items-start flex-1">
                          <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1">Mode</Text>
                          <Text className="text-slate-900 dark:text-white text-xs font-bold capitalize">{t.gameMode?.replace('_', ' ') || 'Classic'}</Text>
                        </View>
                      </View>

                      {/* Progress Bar & Countdown Row */}
                      {!(t.status === 'completed' || t.status === 'ended' || t.status === 'results' || t.status === 'cancelled') && (
                        <View className="mb-4 border-t border-slate-200 dark:border-slate-800/60 pt-3 flex-row justify-between items-center" style={{ gap: 12 }}>
                          {/* Slots Progress (Left) */}
                          <View className="flex-1">
                            <View className="h-1.5 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden mb-1.5 border border-slate-300/40 dark:border-slate-900">
                              <View 
                                style={{ width: `${progress}%`, height: '100%', backgroundColor: '#EF4444' }} 
                                className="rounded-full"
                              />
                            </View>
                            <View className="flex-row justify-between items-center">
                              <Text className={`text-[9px] font-bold ${isFull ? 'text-rose-500 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                {isFull ? 'Full!' : `Only ${spotsLeft} left!`}
                              </Text>
                              <Text className="text-slate-900 dark:text-white text-[10px] font-black">{t.filledSlots}/{t.totalSlots}</Text>
                            </View>
                          </View>

                          {/* Countdown Timer (Right) */}
                          {t.status !== 'draft' && (
                            <View className="items-end">
                              <Countdown targetDate={t.scheduledAt} isDark={isDark} className="py-1 px-2 rounded-lg" />
                            </View>
                          )}
                        </View>
                      )}

                      {/* Admin Actions Container */}
                      <View className="pt-3 border-t border-slate-200 dark:border-slate-800/60 mt-1">
                        {t.status === 'draft' && (
                          <Pressable
                            onPress={() => handlePublishTournament(t._id)}
                            className="w-full py-3 rounded-xl items-center justify-center bg-emerald-500 dark:bg-emerald-600 mb-2"
                            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                          >
                            <Text className="text-white font-extrabold text-[11px] uppercase tracking-wider">Publish</Text>
                          </Pressable>
                        )}

                        {t.status === 'completed' && (
                          t.resultsDeclared ? (
                            <Pressable
                              onPress={() => navigation.navigate('DeclareResults', { tournamentId: t._id, title: t.title, slug: t.slug, resultsDeclared: t.resultsDeclared })}
                              className="w-full py-3 rounded-xl items-center justify-center bg-violet-600 dark:bg-violet-500"
                              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                            >
                              <Text className="text-white font-extrabold text-[11px] uppercase tracking-wider">View Results</Text>
                            </Pressable>
                          ) : (
                            <View className="flex-row gap-2 w-full">
                              <Pressable
                                onPress={() => navigation.navigate('DeclareResults', { tournamentId: t._id, title: t.title, slug: t.slug, resultsDeclared: t.resultsDeclared })}
                                className="flex-1 py-3 rounded-xl items-center justify-center bg-emerald-500 dark:bg-emerald-600"
                                style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                              >
                                <Text className="text-white font-extrabold text-[11px] uppercase tracking-wider">Post Results</Text>
                              </Pressable>

                              <Pressable
                                onPress={() => handleCancelTournament(t._id)}
                                className="flex-1 py-3 rounded-xl items-center justify-center bg-rose-600 dark:bg-rose-500"
                                style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                              >
                                <Text className="text-white font-extrabold text-[11px] uppercase tracking-wider">Cancel</Text>
                              </Pressable>
                            </View>
                          )
                        )}

                        {t.status === 'cancelled' && (
                          <Pressable
                            disabled
                            className="w-full py-3 rounded-xl items-center justify-center bg-slate-500 dark:bg-slate-600 opacity-60"
                          >
                            <Text className="text-white font-extrabold text-[11px] uppercase tracking-wider">Cancelled / Refunded</Text>
                          </Pressable>
                        )}

                        {t.status !== 'completed' && t.status !== 'cancelled' && (
                          <>
                            {t.status === 'live' || t.status === 'ongoing' ? (
                              <View className="w-full space-y-2">
                                <Pressable
                                  onPress={() => {
                                    setSelectedRoomT(t);
                                    setRoomIdInput(t.roomId || '');
                                    setRoomPasswordInput(t.roomPassword || '');
                                    setRoomModalVisible(true);
                                  }}
                                  className="w-full py-3 rounded-xl items-center justify-center bg-indigo-600 dark:bg-indigo-500"
                                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                                >
                                  <Text className="text-white font-extrabold text-[11px] uppercase tracking-wider">Edit Room Details</Text>
                                </Pressable>

                                <View className="flex-row gap-2 w-full mt-2">
                                  <Pressable
                                    onPress={() => handleCompleteTournament(t._id)}
                                    className="flex-1 py-3 rounded-xl items-center justify-center bg-slate-700 dark:bg-slate-800"
                                    style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                                  >
                                    <Text className="text-white font-extrabold text-[11px] uppercase tracking-wider">Complete Only</Text>
                                  </Pressable>

                                  <Pressable
                                    onPress={() => handleCancelTournament(t._id)}
                                    className="flex-1 py-3 rounded-xl items-center justify-center bg-rose-600 dark:bg-rose-500"
                                    style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                                  >
                                    <Text className="text-white font-extrabold text-[11px] uppercase tracking-wider text-center">Cancel</Text>
                                  </Pressable>
                                </View>
                              </View>
                            ) : (
                              <View className="flex-row gap-2 w-full">
                                <Pressable
                                  onPress={() => navigation.navigate('CreateTournament', { tournament: t })}
                                  className="flex-1 py-3 rounded-xl items-center justify-center bg-amber-500 dark:bg-amber-600"
                                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                                >
                                  <Text className="text-white font-extrabold text-[11px] uppercase tracking-wider text-center">Edit</Text>
                                </Pressable>

                                <Pressable
                                  onPress={() => {
                                    setSelectedRoomT(t);
                                    setRoomIdInput(t.roomId || '');
                                    setRoomPasswordInput(t.roomPassword || '');
                                    setRoomModalVisible(true);
                                  }}
                                  className="flex-1 py-3 rounded-xl items-center justify-center bg-indigo-600 dark:bg-indigo-500"
                                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                                >
                                  <Text className="text-white font-extrabold text-[11px] uppercase tracking-wider text-center">Enter Room Detail</Text>
                                </Pressable>

                                <Pressable
                                  onPress={() => handleCancelTournament(t._id)}
                                  className="flex-1 py-3 rounded-xl items-center justify-center bg-rose-600 dark:bg-rose-500"
                                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                                >
                                  <Text className="text-white font-extrabold text-[11px] uppercase tracking-wider text-center">Cancel</Text>
                                </Pressable>
                              </View>
                            )}
                          </>
                        )}
                      </View>

                    </View>
                  </GlassCard>
                );
              })
            })()}
          </View>
        )}





        {/* VIEW 5: PAYOUTS (WITHDRAWALS) */}
        {activeTab === 'payouts' && (
          <View className="space-y-4">
            <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-widest px-0.5 mb-2">Pending Payouts</Text>
            {withdrawals.filter(w => w.status === 'pending').length === 0 ? (
              <GlassCard className="py-12 items-center">
                <Text className="text-slate-500 text-xs font-semibold">No pending withdrawals.</Text>
              </GlassCard>
            ) : (
              withdrawals.filter(w => w.status === 'pending').map((w) => (
                <GlassCard key={w._id} className="p-4 mb-4 flex-row justify-between items-center" glowColor="red">
                  <View className="flex-1 mr-2">
                    <Text className="text-slate-950 dark:text-white font-bold text-xs">Player: {w.userId?.username || 'Unknown'}</Text>
                    <Text className="text-slate-400 text-[9px] mt-0.5">UPI ID: {w.upiId || w.userId?.email}</Text>
                    <View className="flex-row items-center mt-1.5">
                      <GoldCoin size={14} />
                      <Text className="text-emerald-500 text-sm font-black ml-1">{w.amount}</Text>
                    </View>
                  </View>

                  <View className="flex-row space-x-2" style={{ gap: 8 }}>
                    <Pressable 
                      onPress={() => handleReject(w._id)}
                      className="bg-red-500/10 border border-red-500/30 p-2 rounded-lg"
                    >
                      <X size={16} color="#EF4444" />
                    </Pressable>
                    <Pressable 
                      onPress={() => handleApprove(w._id)}
                      className="bg-[#10B981]/10 border border-[#10B981]/30 p-2 rounded-lg"
                    >
                      <Check size={16} color="#10B981" />
                    </Pressable>
                  </View>
                </GlassCard>
              ))
            )}
          </View>
        )}

      </ScrollView>

      {/* MODAL 1: EDIT ROOM LOBBY DETAILS */}
      <Modal animationType="slide" transparent visible={roomModalVisible} onRequestClose={() => setRoomModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white dark:bg-[#0D1321] border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-6 space-y-4 pb-10">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide">Publish Room Details</Text>
              <Pressable onPress={() => setRoomModalVisible(false)} className="p-1">
                <X size={20} color={isDark ? '#94A3B8' : '#64748B'} />
              </Pressable>
            </View>

            <TextInput
              placeholder="Enter Room ID"
              value={roomIdInput}
              onChangeText={setRoomIdInput}
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              className="p-3 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
            />

            <TextInput
              placeholder="Enter Room Password"
              value={roomPasswordInput}
              onChangeText={setRoomPasswordInput}
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              className="p-3 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
            />

            <Pressable
              onPress={submitRoomDetails}
              className="bg-rose-600 dark:bg-rose-500 py-3.5 rounded-xl items-center shadow-lg shadow-rose-500/20"
              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
            >
              <Text className="text-white text-xs font-black uppercase tracking-wider">Publish Room Credentials</Text>
            </Pressable>
          </View>
        </View>
      </Modal>



      {/* MODAL 3: ADJUST USER WALLET */}
      <Modal animationType="slide" transparent visible={walletModalVisible} onRequestClose={() => setWalletModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/70">
          <View className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 space-y-4 pb-10">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-white font-extrabold text-sm uppercase tracking-wide">Adjust Wallet Balance</Text>
              <Pressable onPress={() => setWalletModalVisible(false)} className="p-1"><X size={20} color="#64748B" /></Pressable>
            </View>

            {adjustingUser && (
              <Text className="text-slate-400 text-[10px] uppercase font-bold mt-0.5">User: {adjustingUser.username}</Text>
            )}

            <View className="flex-row justify-between" style={{ gap: 8 }}>
              <View className="flex-1">
                <Text className="text-slate-500 text-[10px] font-extrabold uppercase mb-1.5">Action</Text>
                <View className="flex-row bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <Pressable
                    onPress={() => setAdjAction('credit')}
                    className={`flex-1 py-1.5 rounded-lg items-center ${adjAction === 'credit' ? 'bg-slate-800' : ''}`}
                  >
                    <Text className={`text-[10px] font-bold ${adjAction === 'credit' ? 'text-rose-500' : 'text-slate-500'}`}>Credit</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setAdjAction('debit')}
                    className={`flex-1 py-1.5 rounded-lg items-center ${adjAction === 'debit' ? 'bg-slate-800' : ''}`}
                  >
                    <Text className={`text-[10px] font-bold ${adjAction === 'debit' ? 'text-rose-500' : 'text-slate-500'}`}>Debit</Text>
                  </Pressable>
                </View>
              </View>

              <View className="flex-1">
                <Text className="text-slate-500 text-[10px] font-extrabold uppercase mb-1.5">Wallet balance</Text>
                <View className="flex-row bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {['deposit', 'winning', 'bonus'].map((type) => (
                    <Pressable
                      key={type}
                      onPress={() => setAdjType(type)}
                      className={`flex-1 py-1.5 rounded-lg items-center ${adjType === type ? 'bg-slate-800' : ''}`}
                    >
                      <Text className={`text-[8px] font-extrabold uppercase ${adjType === type ? 'text-rose-500' : 'text-slate-500'}`}>
                        {type === 'deposit' ? 'Dep' : type === 'winning' ? 'Win' : 'Bon'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            <TextInput
              placeholder="Adjustment Amount (Coins)"
              value={adjAmount}
              onChangeText={setAdjAmount}
              keyboardType="numeric"
              placeholderTextColor="#64748B"
              className="p-3 border rounded-xl bg-slate-950 border-slate-800 text-white text-xs"
            />

            <TextInput
              placeholder="Audit Reason / Description"
              value={adjDesc}
              onChangeText={setAdjDesc}
              placeholderTextColor="#64748B"
              className="p-3 border rounded-xl bg-slate-950 border-slate-800 text-white text-xs"
            />

            <Pressable
              onPress={submitWalletAdjustment}
              className="bg-rose-600 py-3 rounded-xl items-center shadow-lg"
            >
              <Text className="text-white text-xs font-black uppercase tracking-wider">Apply Wallet Adjustment</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Results modal removed in favor of separate DeclareResultsScreen */}

    </LinearGradient>
  );
}
