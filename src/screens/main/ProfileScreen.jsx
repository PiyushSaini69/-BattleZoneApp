// Cache bust comment: 2026-06-03T21:30:00
import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { Shield, HelpCircle, LogOut, CheckCircle2, Sun, Moon, Monitor } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function ProfileScreen({ navigation }) {
  const { user, setUser, logout } = useContext(AuthContext);
  
  const [freeFire, setFreeFire] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user && user.gameUIDs) {
      setFreeFire(user.gameUIDs.freeFire || '');
    }
  }, [user]);

  const handleUpdateUIDs = async () => {
    setLoading(true);
    setSuccessMsg('');
    try {
      const res = await request('/user/game-uids', {
        method: 'PUT',
        body: JSON.stringify({
          freeFire: freeFire || null,
        })
      });
      if (res.success) {
        setUser(res.data);
        setSuccessMsg('Gaming UIDs successfully updated! 🎉');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      Alert.alert('Update Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutPress = () => {
    Alert.alert('Logout 🔌', 'Are you sure you want to disconnect from BattleZone?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Disconnect', style: 'destructive', onPress: logout }
    ]);
  };
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const isAdmin = user && ['admin', 'superadmin', 'moderator'].includes(user.role);

  return (
    <ScrollView 
      className="flex-1 bg-slate-50 dark:bg-[#0B0F1A]" 
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
    >
      <GlassCard className="items-center p-6 mb-6 mt-4">
        <View 
          className="w-20 h-20 rounded-full border-2 border-[#7C3AED] justify-center items-center mb-3"
          style={{ backgroundColor: 'rgba(124, 58, 237, 0.2)' }}
        >
          <Text className="text-[#7C3AED] dark:text-white text-3xl font-black">
            {user ? user.username.slice(0, 2).toUpperCase() : 'W'}
          </Text>
        </View>

        <View className="flex-row items-center mb-1">
          <Text className="text-slate-900 dark:text-white text-lg font-black mr-2">{user?.username}</Text>
          <Badge text={user?.role || 'user'} variant={isAdmin ? 'danger' : 'purple'} />
        </View>
        <Text className="text-slate-500 dark:text-slate-400 text-xs mb-3">{user?.email}</Text>

        <View 
          className="flex-row space-x-6 border-t pt-4 w-full border-slate-200 dark:border-slate-800"
        >
          <View className="flex-1 items-center">
            <Text className="text-slate-850 dark:text-white text-sm font-bold">{user?.referralCode || 'N/A'}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] uppercase font-bold mt-0.5">Referral Code</Text>
          </View>
          <View className="flex-1 items-center border-l border-slate-200 dark:border-slate-800">
            <Text className="text-slate-850 dark:text-white text-sm font-bold">{user?.referralCount || 0}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] uppercase font-bold mt-0.5">Referred Users</Text>
          </View>
        </View>
      </GlassCard>

      {isAdmin && (
        <GlassCard 
          className="p-4 mb-6 flex-row justify-between items-center"
          style={{
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
            borderColor: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
          }}
        >
          <View className="flex-row items-center flex-1 mr-3">
            <Shield size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <View className="flex-1">
              <Text className="text-slate-900 dark:text-white font-extrabold text-xs">ADMINISTRATOR CONTROL</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase font-bold mt-0.5">Manage Withdrawals & Games</Text>
            </View>
          </View>
          <Pressable 
            onPress={() => navigation.navigate('AdminTab')}
            style={{ backgroundColor: '#dc2626', borderColor: '#ef4444', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 }}
          >
            <Text className="text-white font-bold text-xs uppercase">Enter</Text>
          </Pressable>
        </GlassCard>
      )}

      <GlassCard className="p-5 mb-6">
        <Text className="text-slate-900 dark:text-white font-extrabold text-[10px] uppercase tracking-wider mb-4">Setup Gaming UIDs</Text>
        
        {successMsg !== '' && (
          <View 
            className="border rounded-xl p-3.5 mb-4 flex-row items-center"
            style={{
              backgroundColor: 'rgba(52, 211, 153, 0.1)',
              borderColor: 'rgba(52, 211, 153, 0.2)',
            }}
          >
            <CheckCircle2 size={16} color="#34D399" style={{ marginRight: 6 }} />
            <Text className="text-emerald-500 dark:text-emerald-400 text-xs font-semibold">{successMsg}</Text>
          </View>
        )}

        <Input
          label="Free Fire Player ID / UID"
          value={freeFire}
          onChangeText={setFreeFire}
          placeholder="E.g., 901844781"
        />

        <Button
          title="Save Gaming UIDs"
          onPress={handleUpdateUIDs}
          loading={loading}
          className="mt-2"
        />
      </GlassCard>

      <GlassCard className="p-5 mb-6">
        <Text className="text-slate-900 dark:text-white font-extrabold text-[10px] uppercase tracking-wider mb-4">App Interface Theme</Text>
        <View className="flex-row justify-between bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/40 rounded-xl p-1">
          <Pressable 
            onPress={() => setColorScheme('light')}
            className={`flex-1 flex-row justify-center items-center py-2.5 rounded-lg ${
              colorScheme === 'light' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Sun size={15} color={colorScheme === 'light' ? '#7C3AED' : '#94A3B8'} style={{ marginRight: 6 }} />
            <Text className={`text-xs font-bold ${colorScheme === 'light' ? 'text-[#7C3AED]' : 'text-slate-500 dark:text-slate-400'}`}>Light</Text>
          </Pressable>

          <Pressable 
            onPress={() => setColorScheme('dark')}
            className={`flex-1 flex-row justify-center items-center py-2.5 rounded-lg ${
              colorScheme === 'dark' ? 'bg-slate-800 shadow-sm' : ''
            }`}
          >
            <Moon size={15} color={colorScheme === 'dark' ? '#C084FC' : '#94A3B8'} style={{ marginRight: 6 }} />
            <Text className={`text-xs font-bold ${colorScheme === 'dark' ? 'text-[#C084FC]' : 'text-slate-500 dark:text-slate-400'}`}>Dark</Text>
          </Pressable>

          <Pressable 
            onPress={() => setColorScheme('system')}
            className={`flex-1 flex-row justify-center items-center py-2.5 rounded-lg ${
              colorScheme === 'system' ? (isDark ? 'bg-slate-800 shadow-sm' : 'bg-white shadow-sm') : ''
            }`}
          >
            <Monitor size={15} color={colorScheme === 'system' ? '#7C3AED' : '#94A3B8'} style={{ marginRight: 6 }} />
            <Text className={`text-xs font-bold ${colorScheme === 'system' ? 'text-[#7C3AED]' : 'text-slate-500 dark:text-slate-400'}`}>System</Text>
          </Pressable>
        </View>
      </GlassCard>

      <GlassCard className="p-4 mb-6 flex-row justify-between items-center">
        <View className="flex-row items-center flex-1 mr-3">
          <HelpCircle size={20} color={isDark ? '#94A3B8' : '#64748B'} style={{ marginRight: 8 }} />
          <View className="flex-1">
            <Text className="text-slate-900 dark:text-white font-extrabold text-xs">HELP & TICKET SUPPORT</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase font-bold mt-0.5">Report bugs or payment errors</Text>
          </View>
        </View>
        <Pressable 
          onPress={() => navigation.navigate('Support')}
          style={{ backgroundColor: isDark ? '#1e293b' : '#e2e8f0', borderColor: isDark ? '#334155' : '#cbd5e1', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 }}
        >
          <Text className="text-slate-700 dark:text-slate-300 font-bold text-xs uppercase">Open</Text>
        </Pressable>
      </GlassCard>

      <Pressable 
        onPress={handleLogoutPress}
        className="border rounded-xl py-3.5 flex-row justify-center items-center mb-8"
        style={{
          borderColor: isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.25)',
          backgroundColor: isDark ? 'rgba(69, 10, 10, 0.1)' : 'rgba(254, 242, 242, 0.7)',
        }}
      >
        <LogOut size={16} color="#EF4444" style={{ marginRight: 6 }} />
        <Text className="text-red-500 dark:text-red-400 font-bold text-xs uppercase tracking-wider">Disconnect Session</Text>
      </Pressable>
    </ScrollView>
  );
}
