import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl, Alert } from 'react-native';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { Plus, ArrowLeft, Check, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdminDashboardScreen({ navigation }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [stats, setStats] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAdminData = async () => {
    try {
      const statsRes = await request('/admin/dashboard');
      if (statsRes.success) setStats(statsRes.data);

      const wdRes = await request('/admin/withdrawals');
      if (wdRes.success) setWithdrawals(wdRes.data.withdrawals);
    } catch (e) {
      console.log('Error loading admin details:', e.message);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAdminData();
    setRefreshing(false);
  };

  const handleApprove = async (id) => {
    Alert.alert('Approve Withdrawal ✅', 'Are you sure you want to mark this withdrawal as approved and transferred?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve', onPress: async () => {
        try {
          const res = await request(`/admin/withdrawals/${id}/approve`, {
            method: 'PATCH',
            body: JSON.stringify({ transferReference: `MOB-REF-${Math.floor(Math.random() * 9000000)}` })
          });
          if (res.success) {
            Alert.alert('Success', 'Withdrawal successfully approved!');
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
        { text: 'Invalid UPI', onPress: () => submitRejection(id, 'Invalid UPI ID details.') },
        { text: 'Incorrect Name', onPress: () => submitRejection(id, 'Name mismatch on account.') },
        { text: 'Fraud Risk', onPress: () => submitRejection(id, 'Suspicious wallet activity flagged.') },
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
        Alert.alert('Success', 'Withdrawal request successfully rejected.');
        await loadAdminData();
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <LinearGradient
      colors={['#060A13', '#0D1321']}
      className="flex-1"
    >
      <View className="bg-slate-950/40 p-4 border-b border-slate-900/60 flex-row items-center justify-between">
        {navigation.canGoBack() ? (
          <Pressable onPress={() => navigation.goBack()} className="p-1">
            <ArrowLeft size={20} color="#fff" />
          </Pressable>
        ) : (
          <View className="w-8" />
        )}
        <Text className="text-white font-extrabold text-sm uppercase tracking-wide">Admin Control</Text>
        <Pressable 
          onPress={() => navigation.navigate('CreateTournament')}
          className="bg-rose-600 w-8 h-8 rounded-lg items-center justify-center border border-rose-500"
          style={{
            shadowColor: '#F43F5E',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 3,
          }}
        >
          <Plus size={16} color="#fff" />
        </Pressable>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#EF4444" 
            colors={["#EF4444"]} 
            progressBackgroundColor="#0A0E1A"
          />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-4 px-0.5">Platform Overview</Text>
        <View className="flex-row justify-between mb-6">
          <GlassCard className="w-[31%] p-3 items-center" glowColor="red">
            <Text className="text-white text-base font-black">{stats?.totalUsers || 0}</Text>
            <Text className="text-slate-400 text-[8px] uppercase font-bold text-center mt-0.5">Users</Text>
          </GlassCard>

          <GlassCard className="w-[31%] p-3 items-center" glowColor="red">
            <Text className="text-emerald-400 text-base font-black">₹{stats?.totalRevenue || 0}</Text>
            <Text className="text-slate-400 text-[8px] uppercase font-bold text-center mt-0.5">Revenue</Text>
          </GlassCard>

          <GlassCard className="w-[31%] p-3 items-center" glowColor="red">
            <Text className="text-violet-400 text-base font-black">{stats?.totalTournaments || 0}</Text>
            <Text className="text-slate-400 text-[8px] uppercase font-bold text-center mt-0.5">Games</Text>
          </GlassCard>
        </View>

        <Text className="text-white font-extrabold text-xs uppercase tracking-widest mb-4 px-0.5">
          Pending Withdrawals ({withdrawals.filter(w => w.status === 'pending').length})
        </Text>
        {withdrawals.filter(w => w.status === 'pending').length === 0 ? (
          <GlassCard className="py-10 items-center">
            <Text className="text-slate-400 text-xs font-semibold">No pending withdrawal requests.</Text>
          </GlassCard>
        ) : (
          withdrawals.filter(w => w.status === 'pending').map((w) => (
            <GlassCard 
              key={w._id} 
              className="mb-4 p-4 flex-row justify-between items-center"
              glowColor="red"
            >
              <View className="flex-1 mr-3">
                <Text className="text-white font-bold text-sm">User: {w.userId?.username || 'Player'}</Text>
                <Text className="text-slate-400 text-[9px] uppercase font-semibold mt-0.5">UPI: {w.upiId || 'Bank Account'}</Text>
                <Text className="text-emerald-400 text-sm font-black mt-1">₹{w.amount}</Text>
              </View>
              
              <View className="flex-row space-x-2">
                <Pressable 
                  onPress={() => handleReject(w._id)}
                  style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.4)', borderWidth: 1, borderRadius: 10, padding: 8 }}
                >
                  <X size={16} color="#F43F5E" />
                </Pressable>
                <Pressable 
                  onPress={() => handleApprove(w._id)}
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.4)', borderWidth: 1, borderRadius: 10, padding: 8 }}
                >
                  <Check size={16} color="#10B981" />
                </Pressable>
              </View>
            </GlassCard>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}
