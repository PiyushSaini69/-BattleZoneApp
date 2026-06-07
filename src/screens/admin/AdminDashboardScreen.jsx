import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl, Alert, useColorScheme as useRNColorScheme, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { Plus, ArrowLeft, Check, X, Search, Trash2, ShieldAlert, Award, UserPlus, CreditCard, DollarSign, Activity } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
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
  const [selectedBracketT, setSelectedBracketT] = useState(null);
  const [selectedBracketTId, setSelectedBracketTId] = useState('');

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

  const [scoreModalVisible, setScoreModalVisible] = useState(false);
  const [selectedBracketMatch, setSelectedBracketMatch] = useState(null);
  const [bracketWinnerKey, setBracketWinnerKey] = useState('p1'); // p1, p2
  const [bracketScore, setBracketScore] = useState('');

  const loadAdminData = async () => {
    try {
      const statsRes = await request('/admin/dashboard');
      if (statsRes.success) setStats(statsRes.data);

      const tourneysRes = await request('/tournaments?includeDrafts=true');
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

  const handleGenerateBracket = async (tId) => {
    try {
      const res = await request(`/admin/tournaments/${tId}/bracket/generate`, { method: 'POST' });
      if (res.success) {
        Alert.alert('Success 🎉', 'Tournament bracket successfully generated!');
        await loadAdminData();
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  // 2. Bracket Node Winner Submission
  const submitBracketWinner = async () => {
    try {
      const res = await request(`/admin/tournaments/${selectedBracketT._id}/bracket/match/${selectedBracketMatch.matchId}`, {
        method: 'PATCH',
        body: JSON.stringify({ winner: bracketWinnerKey, score: bracketScore })
      });
      if (res.success) {
        Alert.alert('Success', 'Match node updated. Winner advanced!');
        setScoreModalVisible(false);
        setSelectedBracketMatch(null);
        
        // Refresh selected bracket data
        const freshRes = await request(`/tournaments/${selectedBracketT.slug}`);
        if (freshRes.success) setSelectedBracketT(freshRes.data.tournament);
        await loadAdminData();
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

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
            { id: 'brackets', label: 'Brackets' },
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
              const filtered = tournaments.filter((t) => {
                if (matchesSubTab === 'ongoing') {
                  return t.status === 'live' || t.status === 'ongoing';
                } else if (matchesSubTab === 'upcoming') {
                  return t.status === 'registering' || t.status === 'upcoming' || t.status === 'scheduled' || t.status === 'draft';
                } else if (matchesSubTab === 'results') {
                  return t.status === 'completed' || t.status === 'ended' || t.status === 'results' || t.status === 'cancelled';
                }
                return true;
              });

              if (filtered.length === 0) {
                return (
                  <GlassCard className="p-10 items-center">
                    <Text className="text-slate-500 text-xs font-semibold text-center">
                      No {matchesSubTab} matches available.
                    </Text>
                  </GlassCard>
                );
              }

              return filtered.map((t) => (
                <GlassCard key={t._id} className="p-4 mb-4" glowColor="red">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 mr-2">
                      <Text className="text-rose-500 text-[9px] uppercase font-mono font-bold">{t.gameMode?.replace('_', ' ')} • {t.format || t.tournamentType}</Text>
                      <Text className="text-slate-950 dark:text-white font-black text-sm mt-0.5">{t.title}</Text>
                    </View>
                    <Badge variant={t.status === 'completed' ? 'success' : t.status === 'live' ? 'indigo' : 'warning'}>
                      {t.status}
                    </Badge>
                  </View>

                  <View className="grid grid-cols-2 flex-row flex-wrap border-t border-slate-200 dark:border-slate-800 pt-3 mt-1 pb-2" style={{ gap: 8 }}>
                    <View className="flex-row items-center w-[45%]">
                      <Text className="text-slate-500 text-[10px] mr-1">Fee:</Text>
                      <GoldCoin size={10} />
                      <Text className="text-slate-950 dark:text-white font-bold text-[10px] ml-0.5">{t.entryFee}</Text>
                    </View>
                    <View className="flex-row items-center w-[45%]">
                      <Text className="text-slate-500 text-[10px] mr-1">Pool:</Text>
                      <GoldCoin size={10} />
                      <Text className="text-emerald-500 font-bold text-[10px] ml-0.5">{t.prizePool}</Text>
                    </View>
                    <Text className="text-slate-500 text-[10px] w-[45%]">Slots: <Text className="text-slate-950 dark:text-white font-bold">{t.filledSlots} / {t.totalSlots}</Text></Text>
                    <Text className="text-slate-500 text-[9px] w-[45%] truncate text-right">Map: {t.mapType || 'CS Arena'}</Text>
                  </View>

                  <View className="flex-row flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                    {t.status === 'draft' && (
                      <Pressable
                        onPress={() => handlePublishTournament(t._id)}
                        className="bg-cyan-500 px-3 py-1.5 rounded-lg"
                      >
                        <Text className="text-black text-[9px] font-black uppercase">Publish</Text>
                      </Pressable>
                    )}

                    {t.status !== 'completed' && t.status !== 'cancelled' && (
                      <>
                        <Pressable
                          onPress={() => navigation.navigate('CreateTournament', { tournament: t })}
                          className="bg-amber-500 px-3 py-1.5 rounded-lg border border-amber-600 shadow-sm"
                          style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                        >
                          <Text className="text-black text-[9px] font-black uppercase">Edit</Text>
                        </Pressable>

                        <Pressable
                          onPress={() => {
                            setSelectedRoomT(t);
                            setRoomIdInput(t.roomId || '');
                            setRoomPasswordInput(t.roomPassword || '');
                            setRoomModalVisible(true);
                          }}
                          className="bg-slate-700/60 px-3 py-1.5 rounded-lg border border-slate-600"
                        >
                          <Text className="text-white text-[9px] font-black uppercase">Room Details</Text>
                        </Pressable>

                        {(t.gameMode === 'clash_squad' || t.gameMode === 'lone_wolf') && !t.bracket?.length && (
                          <Pressable
                            onPress={() => handleGenerateBracket(t._id)}
                            className="bg-violet-600 px-3 py-1.5 rounded-lg"
                          >
                            <Text className="text-white text-[9px] font-black uppercase">Generate Bracket</Text>
                          </Pressable>
                        )}

                        <Pressable
                          onPress={() => handleCancelTournament(t._id)}
                          className="bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-lg"
                        >
                          <Text className="text-red-500 text-[9px] font-black uppercase">Cancel</Text>
                        </Pressable>

                        {t.status !== 'draft' && (
                          <View className="flex-row gap-2 flex-wrap mt-1">
                            <Pressable
                              onPress={() => handleCompleteTournament(t._id)}
                              className="bg-red-500/10 border border-red-500/30 px-2.5 py-1.5 rounded-lg"
                            >
                              <Text className="text-red-500 text-[9px] font-black uppercase">Complete Only</Text>
                            </Pressable>

                            <Pressable
                              onPress={() => navigation.navigate('DeclareResults', { tournamentId: t._id, title: t.title })}
                              className="bg-emerald-600 px-2.5 py-1.5 rounded-lg border border-emerald-500 shadow-sm"
                              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                            >
                              <Text className="text-white text-[9px] font-black uppercase">Post Results</Text>
                            </Pressable>
                          </View>
                        )}
                      </>
                    )}
                  </View>
                </GlassCard>
              ))
            })()}
          </View>
        )}

        {/* VIEW 3: BRACKETS */}
        {activeTab === 'brackets' && (
          <View className="space-y-4">
            <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-widest px-0.5 mb-2">Select Bracket Tournament</Text>
            <View className="mb-4">
              {tournaments.filter(t => (t.gameMode === 'clash_squad' || t.gameMode === 'lone_wolf') && t.bracket?.length > 0).map(t => (
                <Pressable
                  key={t._id}
                  onPress={async () => {
                    setSelectedBracketTId(t._id);
                    const res = await request(`/tournaments/${t.slug}`);
                    if (res.success) setSelectedBracketT(res.data.tournament);
                  }}
                  className={`p-3 rounded-xl border mb-2 flex-row justify-between items-center ${
                    selectedBracketTId === t._id ? 'border-rose-500 bg-rose-500/5' : 'border-slate-800 bg-slate-900/20'
                  }`}
                >
                  <Text className="text-slate-950 dark:text-white text-xs font-semibold">{t.title}</Text>
                  <Text className="text-slate-500 text-[9px] font-bold uppercase">{t.status}</Text>
                </Pressable>
              ))}
            </View>

            {selectedBracketT ? (
              <View className="space-y-3">
                <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-widest px-0.5 mb-2">Bracket Matches</Text>
                {selectedBracketT.bracket.map((match) => (
                  <Pressable
                    key={match.matchId}
                    onPress={() => {
                      if (selectedBracketT.status === 'completed') return;
                      setSelectedBracketMatch(match);
                      setBracketWinnerKey(match.winner || 'p1');
                      setBracketScore(match.score || '');
                      setScoreModalVisible(true);
                    }}
                    className={`p-3 border rounded-xl bg-slate-900/30 border-slate-800 ${match.winner ? 'border-emerald-500/20' : ''}`}
                  >
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-rose-500 font-mono text-[9px] font-bold">{match.matchId} ({match.roundName})</Text>
                      {match.score && <Text className="text-cyan-400 font-mono text-[9px]">Score: {match.score}</Text>}
                    </View>
                    
                    <View className="flex-row justify-between items-center py-1">
                      <Text className={`text-xs ${match.winner === 'p1' ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                        {match.p1?.name || 'TBD'}
                      </Text>
                      {match.winner === 'p1' && <Text className="text-[9px] text-emerald-500 font-bold">Winner</Text>}
                    </View>
                    
                    <View className="h-[0.5px] bg-slate-800 my-1 w-full" />
                    
                    <View className="flex-row justify-between items-center py-1">
                      <Text className={`text-xs ${match.winner === 'p2' ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                        {match.p2?.name || 'TBD'}
                      </Text>
                      {match.winner === 'p2' && <Text className="text-[9px] text-emerald-500 font-bold">Winner</Text>}
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : (
              <GlassCard className="py-12 items-center">
                <Text className="text-slate-500 text-xs font-semibold">Select an active bracket tournament from above.</Text>
              </GlassCard>
            )}
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
        <View className="flex-1 justify-end bg-black/70">
          <View className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 space-y-4 pb-10">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white font-extrabold text-sm uppercase tracking-wide">Publish Room Details</Text>
              <Pressable onPress={() => setRoomModalVisible(false)} className="p-1"><X size={20} color="#64748B" /></Pressable>
            </View>

            <TextInput
              placeholder="Enter Room ID"
              value={roomIdInput}
              onChangeText={setRoomIdInput}
              placeholderTextColor="#64748B"
              className="p-3 border rounded-xl bg-slate-950 border-slate-800 text-white text-xs"
            />

            <TextInput
              placeholder="Enter Room Password"
              value={roomPasswordInput}
              onChangeText={setRoomPasswordInput}
              placeholderTextColor="#64748B"
              className="p-3 border rounded-xl bg-slate-950 border-slate-800 text-white text-xs"
            />

            <Pressable
              onPress={submitRoomDetails}
              className="bg-cyan-500 py-3 rounded-xl items-center shadow-lg"
            >
              <Text className="text-black text-xs font-black uppercase tracking-wider">Publish Room Credentials</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: SUBMIT BRACKET SCORE & WINNER */}
      <Modal animationType="slide" transparent visible={scoreModalVisible} onRequestClose={() => setScoreModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/70">
          <View className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 space-y-4 pb-10">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white font-extrabold text-sm uppercase tracking-wide">Submit Bracket Score</Text>
              <Pressable onPress={() => setScoreModalVisible(false)} className="p-1"><X size={20} color="#64748B" /></Pressable>
            </View>

            {selectedBracketMatch && (
              <>
                <Text className="text-slate-400 text-xs font-semibold mb-2">Choose Winner:</Text>
                <View className="flex-row justify-between bg-slate-950 p-1 border border-slate-800 rounded-xl mb-2">
                  <Pressable
                    onPress={() => setBracketWinnerKey('p1')}
                    className={`flex-1 py-2.5 rounded-lg items-center ${bracketWinnerKey === 'p1' ? 'bg-slate-800' : ''}`}
                  >
                    <Text className={`text-xs font-bold ${bracketWinnerKey === 'p1' ? 'text-rose-500' : 'text-slate-400'}`}>
                      {selectedBracketMatch.p1?.name || 'Player 1'}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setBracketWinnerKey('p2')}
                    className={`flex-1 py-2.5 rounded-lg items-center ${bracketWinnerKey === 'p2' ? 'bg-slate-800' : ''}`}
                  >
                    <Text className={`text-xs font-bold ${bracketWinnerKey === 'p2' ? 'text-rose-500' : 'text-slate-400'}`}>
                      {selectedBracketMatch.p2?.name || 'Player 2'}
                    </Text>
                  </Pressable>
                </View>

                <TextInput
                  placeholder="Enter Score / round points (e.g. 7-5)"
                  value={bracketScore}
                  onChangeText={setBracketScore}
                  placeholderTextColor="#64748B"
                  className="p-3 border rounded-xl bg-slate-950 border-slate-800 text-white text-xs"
                />

                <Pressable
                  onPress={submitBracketWinner}
                  className="bg-emerald-500 py-3 rounded-xl items-center shadow-lg"
                >
                  <Text className="text-black text-xs font-black uppercase tracking-wider">End Match & Advance Winner</Text>
                </Pressable>
              </>
            )}
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
