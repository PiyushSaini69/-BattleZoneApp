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
import { LinearGradient } from 'expo-linear-gradient';

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
    <LinearGradient
      colors={['#060A13', '#0D1321']}
      className="flex-1"
    >
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        <GlassCard className="items-center p-6 mb-6 mt-4" glowColor="purple">
          <View 
            className="w-20 h-20 rounded-full border-2 justify-center items-center mb-3 bg-[#0A0E1A]"
            style={{ 
              borderColor: '#00E5FF',
              shadowColor: '#00E5FF',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 8,
              elevation: 4
            }}
          >
            <Text className="text-white text-3xl font-black">
              {user ? user.username.slice(0, 2).toUpperCase() : 'W'}
            </Text>
          </View>

          <View className="flex-row items-center mb-1">
            <Text className="text-white text-lg font-black mr-2 uppercase tracking-wide">{user?.username}</Text>
            <Badge text={user?.role || 'user'} variant={isAdmin ? 'danger' : 'purple'} />
          </View>
          <Text className="text-slate-400 text-xs mb-3">{user?.email}</Text>

          <View 
            className="flex-row space-x-6 border-t pt-4 w-full border-slate-800/60"
          >
            <View className="flex-1 items-center">
              <Text className="text-white text-sm font-black uppercase tracking-wider">{user?.referralCode || 'N/A'}</Text>
              <Text className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mt-0.5">Referral Code</Text>
            </View>
            <View className="flex-1 items-center border-l border-slate-800/60">
              <Text className="text-white text-sm font-black">{user?.referralCount || 0}</Text>
              <Text className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mt-0.5">Referred Users</Text>
            </View>
          </View>
        </GlassCard>

        {isAdmin && (
          <GlassCard 
            className="p-4 mb-6 flex-row justify-between items-center"
            glowColor="red"
          >
            <View className="flex-row items-center flex-1 mr-3">
              <Shield size={20} color="#EF4444" style={{ marginRight: 8 }} />
              <View className="flex-1">
                <Text className="text-white font-extrabold text-xs uppercase tracking-wide">ADMINISTRATOR CONTROL</Text>
                <Text className="text-slate-400 text-[8px] uppercase font-bold mt-0.5">Manage Withdrawals & Games</Text>
              </View>
            </View>
            <Pressable 
              onPress={() => navigation.navigate('AdminTab')}
              className="bg-red-600 rounded-xl px-4 py-2 border border-red-500"
              style={({ pressed }) => [{
                opacity: pressed ? 0.8 : 1,
                shadowColor: '#ef4444',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
                elevation: 2
              }]}
            >
              <Text className="text-white font-extrabold text-xs uppercase tracking-wider">Enter</Text>
            </Pressable>
          </GlassCard>
        )}

        <GlassCard className="p-5 mb-6" glowColor="purple">
          <Text className="text-white font-extrabold text-[10px] uppercase tracking-wider mb-4 px-0.5">Setup Gaming UIDs</Text>
          
          {successMsg !== '' && (
            <View 
              className="border rounded-xl p-3.5 mb-4 flex-row items-center"
              style={{
                backgroundColor: 'rgba(52, 211, 153, 0.08)',
                borderColor: 'rgba(52, 211, 153, 0.35)',
              }}
            >
              <CheckCircle2 size={16} color="#34D399" style={{ marginRight: 6 }} />
              <Text className="text-emerald-400 text-xs font-bold">{successMsg}</Text>
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

        <GlassCard className="p-5 mb-6" glowColor="purple">
          <Text className="text-white font-extrabold text-[10px] uppercase tracking-wider mb-4 px-0.5">App Interface Theme</Text>
          <View className="flex-row justify-between bg-slate-950/60 border border-slate-900 rounded-xl p-1">
            <Pressable 
              onPress={() => setColorScheme('light')}
              className={`flex-1 flex-row justify-center items-center py-2.5 rounded-lg ${
                colorScheme === 'light' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Sun size={15} color={colorScheme === 'light' ? '#7C3AED' : '#4B5563'} style={{ marginRight: 6 }} />
              <Text className={`text-xs font-extrabold uppercase ${colorScheme === 'light' ? 'text-[#7C3AED]' : 'text-slate-400'}`}>Light</Text>
            </Pressable>

            <Pressable 
              onPress={() => setColorScheme('dark')}
              className={`flex-1 flex-row justify-center items-center py-2.5 rounded-lg ${
                colorScheme === 'dark' ? 'bg-slate-800 shadow-sm' : ''
              }`}
              style={colorScheme === 'dark' ? {
                shadowColor: '#C084FC',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 2
              } : {}}
            >
              <Moon size={15} color={colorScheme === 'dark' ? '#C084FC' : '#4B5563'} style={{ marginRight: 6 }} />
              <Text className={`text-xs font-extrabold uppercase ${colorScheme === 'dark' ? 'text-[#C084FC]' : 'text-slate-400'}`}>Dark</Text>
            </Pressable>

            <Pressable 
              onPress={() => setColorScheme('system')}
              className={`flex-1 flex-row justify-center items-center py-2.5 rounded-lg ${
                colorScheme === 'system' ? (isDark ? 'bg-slate-800 shadow-sm' : 'bg-white shadow-sm') : ''
              }`}
              style={colorScheme === 'system' ? {
                shadowColor: '#00E5FF',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 2
              } : {}}
            >
              <Monitor size={15} color={colorScheme === 'system' ? '#00E5FF' : '#4B5563'} style={{ marginRight: 6 }} />
              <Text className={`text-xs font-extrabold uppercase ${colorScheme === 'system' ? 'text-[#00E5FF]' : 'text-slate-400'}`}>System</Text>
            </Pressable>
          </View>
        </GlassCard>

        <GlassCard className="p-4 mb-6 flex-row justify-between items-center" glowColor="purple">
          <View className="flex-row items-center flex-1 mr-3">
            <HelpCircle size={20} color="#00E5FF" style={{ marginRight: 8 }} />
            <View className="flex-1">
              <Text className="text-white font-extrabold text-xs uppercase tracking-wide">HELP & TICKET SUPPORT</Text>
              <Text className="text-slate-400 text-[8px] uppercase font-bold mt-0.5">Report bugs or payment errors</Text>
            </View>
          </View>
          <Pressable 
            onPress={() => navigation.navigate('Support')}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2"
            style={({ pressed }) => [{
              opacity: pressed ? 0.8 : 1,
              borderColor: 'rgba(0, 229, 255, 0.3)',
            }]}
          >
            <Text className="text-cyan-400 font-extrabold text-xs uppercase tracking-wider">Open</Text>
          </Pressable>
        </GlassCard>

        <Pressable 
          onPress={handleLogoutPress}
          className="border rounded-xl py-3.5 flex-row justify-center items-center mb-8"
          style={({ pressed }) => [{
            opacity: pressed ? 0.85 : 1,
            borderColor: 'rgba(244, 63, 94, 0.4)',
            backgroundColor: 'rgba(244, 63, 94, 0.08)',
          }]}
        >
          <LogOut size={16} color="#F43F5E" style={{ marginRight: 6 }} />
          <Text className="text-rose-400 font-extrabold text-xs uppercase tracking-wider">Disconnect Session</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}
