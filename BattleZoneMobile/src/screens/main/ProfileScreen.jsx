import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { Shield, HelpCircle, LogOut, CheckCircle2 } from 'lucide-react-native';

export default function ProfileScreen({ navigation }) {
  const { user, setUser, logout } = useContext(AuthContext);
  
  const [bgmi, setBgmi] = useState('');
  const [freeFire, setFreeFire] = useState('');
  const [valorant, setValorant] = useState('');
  const [codMobile, setCodMobile] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user && user.gameUIDs) {
      setBgmi(user.gameUIDs.bgmi || '');
      setFreeFire(user.gameUIDs.freeFire || '');
      setValorant(user.gameUIDs.valorant || '');
      setCodMobile(user.gameUIDs.codMobile || '');
    }
  }, [user]);

  const handleUpdateUIDs = async () => {
    setLoading(true);
    setSuccessMsg('');
    try {
      const res = await request('/user/game-uids', {
        method: 'PUT',
        body: JSON.stringify({
          bgmi: bgmi || null,
          freeFire: freeFire || null,
          valorant: valorant || null,
          codMobile: codMobile || null,
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

  const isAdmin = user && ['admin', 'superadmin', 'moderator'].includes(user.role);

  return (
    <ScrollView className="flex-1 bg-[#0B0F1A]" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <GlassCard className="items-center p-6 border-white/5 bg-slate-900/60 mb-6 mt-4">
        <View className="w-20 h-20 bg-[#7C3AED]/20 rounded-full border-2 border-[#7C3AED] justify-center items-center mb-3">
          <Text className="text-white text-3xl font-black">
            {user ? user.username.slice(0, 2).toUpperCase() : 'W'}
          </Text>
        </View>

        <View className="flex-row items-center mb-1">
          <Text className="text-white text-lg font-black mr-2">{user?.username}</Text>
          <Badge text={user?.role || 'user'} variant={isAdmin ? 'danger' : 'purple'} />
        </View>
        <Text className="text-slate-450 text-xs mb-3">{user?.email}</Text>

        <View className="flex-row space-x-6 border-t border-slate-800/80 pt-4 w-full">
          <View className="flex-1 items-center">
            <Text className="text-white text-sm font-bold">{user?.referralCode || 'N/A'}</Text>
            <Text className="text-slate-450 text-[9px] uppercase font-bold mt-0.5">Referral Code</Text>
          </View>
          <View className="flex-1 items-center border-l border-slate-850">
            <Text className="text-white text-sm font-bold">{user?.referralCount || 0}</Text>
            <Text className="text-slate-450 text-[9px] uppercase font-bold mt-0.5">Referred Users</Text>
          </View>
        </View>
      </GlassCard>

      {isAdmin && (
        <GlassCard className="p-4 bg-red-950/10 border-red-500/20 mb-6 flex-row justify-between items-center">
          <View className="flex-row items-center flex-1 mr-3">
            <Shield size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <View className="flex-1">
              <Text className="text-white font-extrabold text-xs">ADMINISTRATOR CONTROL</Text>
              <Text className="text-slate-450 text-[8px] uppercase font-bold mt-0.5">Manage Withdrawals & Games</Text>
            </View>
          </View>
          <Pressable 
            onPress={() => navigation.navigate('AdminDashboard')}
            style={{ backgroundColor: '#dc2626', borderColor: '#ef4444', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 }}
          >
            <Text className="text-white font-bold text-xs uppercase">Enter</Text>
          </Pressable>
        </GlassCard>
      )}

      <GlassCard className="p-5 border-white/5 bg-slate-900/60 mb-6">
        <Text className="text-white font-extrabold text-[10px] uppercase tracking-wider mb-4">Setup Gaming UIDs</Text>
        
        {successMsg !== '' && (
          <View className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 mb-4 flex-row items-center">
            <CheckCircle2 size={16} color="#34D399" style={{ marginRight: 6 }} />
            <Text className="text-emerald-400 text-xs font-semibold">{successMsg}</Text>
          </View>
        )}

        <Input
          label="BGMI Player ID / UID"
          value={bgmi}
          onChangeText={setBgmi}
          placeholder="E.g., 556799014"
        />

        <Input
          label="Free Fire Player ID / UID"
          value={freeFire}
          onChangeText={setFreeFire}
          placeholder="E.g., 901844781"
        />

        <Input
          label="Valorant Riot ID & Tag"
          value={valorant}
          onChangeText={setValorant}
          placeholder="E.g., Gamer#IND"
        />

        <Input
          label="COD Mobile Username"
          value={codMobile}
          onChangeText={setCodMobile}
          placeholder="E.g., Slayer_Mobile"
        />

        <Button
          title="Save Gaming UIDs"
          onPress={handleUpdateUIDs}
          loading={loading}
          className="mt-2"
        />
      </GlassCard>

      <GlassCard className="p-4 bg-slate-900/40 mb-6 flex-row justify-between items-center">
        <View className="flex-row items-center flex-1 mr-3">
          <HelpCircle size={20} color="#94A3B8" style={{ marginRight: 8 }} />
          <View className="flex-1">
            <Text className="text-white font-extrabold text-xs">HELP & TICKET SUPPORT</Text>
            <Text className="text-slate-450 text-[8px] uppercase font-bold mt-0.5">Report bugs or payment errors</Text>
          </View>
        </View>
        <Pressable 
          onPress={() => navigation.navigate('Support')}
          style={{ backgroundColor: '#1e293b', borderColor: '#334155', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 }}
        >
          <Text className="text-slate-300 font-bold text-xs uppercase">Open</Text>
        </Pressable>
      </GlassCard>

      <Pressable 
        onPress={handleLogoutPress}
        className="border border-red-500/35 bg-red-950/10 rounded-xl py-3.5 flex-row justify-center items-center mb-8"
      >
        <LogOut size={16} color="#EF4444" style={{ marginRight: 6 }} />
        <Text className="text-red-400 font-bold text-xs uppercase tracking-wider">Disconnect Session</Text>
      </Pressable>
    </ScrollView>
  );
}
