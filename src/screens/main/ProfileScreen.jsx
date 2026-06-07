import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, Alert, Switch, Modal, useColorScheme as useRNColorScheme } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Header from '../../components/ui/Header';
import { 
  User, Wallet, BarChart3, Trophy, Bell, Headphones, HelpCircle, 
  LogOut, ChevronRight, Shield, CheckCircle2, Settings
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

// GoldCoin component for stats display
const GoldCoin = ({ size = 18 }) => (
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

export default function ProfileScreen({ navigation }) {
  const { user, setUser, logout } = useContext(AuthContext);
  const { colorScheme, setColorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const isDark = colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';
  
  const [freeFire, setFreeFire] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [importanceNotice, setImportanceNotice] = useState(true);

  // Modals state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

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

  const isAdmin = user && ['admin', 'superadmin', 'moderator'].includes(user.role);
  const stats = user?.stats || { tournamentsPlayed: 0, tournamentsWon: 0, totalKills: 0, points: 0 };

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      <View className="px-4">
        <Header navigation={navigation} />
      </View>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >


        {/* Stats Column Card */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl py-4 px-3 flex-row items-center justify-between shadow-sm border border-slate-200/50 dark:border-slate-800/60 mb-5">
          <View className="flex-1 items-center">
            <Text className="text-sky-600 dark:text-sky-400 text-lg font-black">{stats.tournamentsPlayed}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold mt-1 uppercase tracking-wide">Matches Played</Text>
          </View>

          <View className="w-[1px] h-9 bg-slate-200 dark:bg-slate-800" />

          <View className="flex-1 items-center">
            <Text className="text-sky-600 dark:text-sky-400 text-lg font-black">{stats.totalKills}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold mt-1 uppercase tracking-wide">Total Kills</Text>
          </View>

          <View className="w-[1px] h-9 bg-slate-200 dark:bg-slate-800" />

          <View className="flex-1 items-center">
            <View className="flex-row items-center">
              <GoldCoin size={15} />
              <Text className="text-sky-600 dark:text-sky-400 text-lg font-black ml-1.5">{stats.points}</Text>
            </View>
            <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold mt-1 uppercase tracking-wide">PlayCoin Won</Text>
          </View>
        </View>

        {/* Menu Options List */}
        <View>
          {/* My Profile */}
          <Pressable
            onPress={() => setShowProfileModal(true)}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex-row justify-between items-center mb-3 shadow-sm border border-slate-200/50 dark:border-slate-800/60"
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <View className="flex-row items-center">
              <User size={18} color="#0EA5E9" />
              <Text className="text-slate-800 dark:text-slate-200 text-sm font-black ml-3.5">My Profile</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </Pressable>

          {/* My Wallet */}
          <Pressable
            onPress={() => navigation.navigate('WalletTab')}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex-row justify-between items-center mb-3 shadow-sm border border-slate-200/50 dark:border-slate-800/60"
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <View className="flex-row items-center">
              <Wallet size={18} color="#0EA5E9" />
              <Text className="text-slate-800 dark:text-slate-200 text-sm font-black ml-3.5">My Wallet</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </Pressable>

          {/* My Statistics */}
          <Pressable
            onPress={() => setShowStatsModal(true)}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex-row justify-between items-center mb-3 shadow-sm border border-slate-200/50 dark:border-slate-800/60"
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <View className="flex-row items-center">
              <BarChart3 size={18} color="#0EA5E9" />
              <Text className="text-slate-800 dark:text-slate-200 text-sm font-black ml-3.5">My Statistics</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </Pressable>

          {/* Top Players */}
          <Pressable
            onPress={() => navigation.navigate('LeaderboardTab')}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex-row justify-between items-center mb-3 shadow-sm border border-slate-200/50 dark:border-slate-800/60"
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <View className="flex-row items-center">
              <Trophy size={18} color="#0EA5E9" />
              <Text className="text-slate-800 dark:text-slate-200 text-sm font-black ml-3.5">Top Players</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </Pressable>

          {/* Notifications */}
          <Pressable
            onPress={() => navigation.navigate('Notification')}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex-row justify-between items-center mb-3 shadow-sm border border-slate-200/50 dark:border-slate-800/60"
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <View className="flex-row items-center">
              <Bell size={18} color="#0EA5E9" />
              <Text className="text-slate-800 dark:text-slate-200 text-sm font-black ml-3.5">Notifications</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </Pressable>

          {/* Contact Us */}
          <Pressable
            onPress={() => navigation.navigate('Support')}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex-row justify-between items-center mb-3 shadow-sm border border-slate-200/50 dark:border-slate-800/60"
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <View className="flex-row items-center">
              <Headphones size={18} color="#0EA5E9" />
              <Text className="text-slate-800 dark:text-slate-200 text-sm font-black ml-3.5">Contact Us</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </Pressable>

          {/* Importance Notice */}
          <View
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex-row justify-between items-center mb-3 shadow-sm border border-slate-200/50 dark:border-slate-800/60"
          >
            <View className="flex-row items-center">
              <Bell size={18} color="#0EA5E9" />
              <Text className="text-slate-800 dark:text-slate-200 text-sm font-black ml-3.5">Importance Notice</Text>
            </View>
            <Switch
              value={importanceNotice}
              onValueChange={setImportanceNotice}
              trackColor={{ false: '#E2E8F0', true: '#BAE6FD' }}
              thumbColor={importanceNotice ? '#0EA5E9' : '#F1F5F9'}
            />
          </View>

          {/* App Interface Theme */}
          <Pressable
            onPress={() => setShowThemeModal(true)}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex-row justify-between items-center mb-3 shadow-sm border border-slate-200/50 dark:border-slate-800/60"
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <View className="flex-row items-center">
              <Settings size={18} color="#0EA5E9" />
              <Text className="text-slate-800 dark:text-slate-200 text-sm font-black ml-3.5">App Theme</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-slate-400 text-xs font-black mr-1 uppercase">{colorScheme}</Text>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </Pressable>

          {/* FAQ */}
          <Pressable
            onPress={() => navigation.navigate('Terms')}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex-row justify-between items-center mb-3 shadow-sm border border-slate-200/50 dark:border-slate-800/60"
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <View className="flex-row items-center">
              <HelpCircle size={18} color="#0EA5E9" />
              <Text className="text-slate-800 dark:text-slate-200 text-sm font-black ml-3.5">FAQ</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </Pressable>

          {/* Admin Panel Control */}
          {isAdmin && (
            <Pressable
              onPress={() => navigation.navigate('AdminTab')}
              className="bg-rose-50 dark:bg-rose-950/20 rounded-2xl p-4 flex-row justify-between items-center mb-3 shadow-sm border border-rose-100 dark:border-rose-950/30"
              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
            >
              <View className="flex-row items-center">
                <Shield size={18} color="#F43F5E" />
                <Text className="text-rose-700 dark:text-rose-300 text-sm font-black ml-3.5">Admin Control</Text>
              </View>
              <ChevronRight size={16} color="#F43F5E" />
            </Pressable>
          )}

          {/* Disconnect Session */}
          <Pressable
            onPress={handleLogoutPress}
            className="bg-rose-50 dark:bg-rose-950/20 rounded-2xl p-4 flex-row justify-between items-center mb-6 shadow-sm border border-rose-100 dark:border-rose-950/30"
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <View className="flex-row items-center">
              <LogOut size={18} color="#F43F5E" />
              <Text className="text-rose-700 dark:text-rose-300 text-sm font-black ml-3.5">Disconnect Session</Text>
            </View>
            <ChevronRight size={16} color="#F43F5E" />
          </Pressable>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showProfileModal} animationType="slide" transparent>
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-6 border-t border-slate-200 dark:border-slate-800 shadow-xl">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-slate-900 dark:text-white text-base font-black uppercase tracking-wider">Edit Profile</Text>
              <Pressable 
                onPress={() => setShowProfileModal(false)}
                className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
              >
                <Text className="text-slate-500 dark:text-slate-400 font-extrabold text-[10px] uppercase">Close</Text>
              </Pressable>
            </View>

            {successMsg !== '' && (
              <View className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 mb-4">
                <Text className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">{successMsg}</Text>
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
              className="mt-4 w-full"
            />
          </View>
        </View>
      </Modal>

      {/* Statistics Modal */}
      <Modal visible={showStatsModal} animationType="slide" transparent>
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-6 border-t border-slate-200 dark:border-slate-800 shadow-xl">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-slate-900 dark:text-white text-base font-black uppercase tracking-wider">My Statistics & Referrals</Text>
              <Pressable 
                onPress={() => setShowStatsModal(false)}
                className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
              >
                <Text className="text-slate-500 dark:text-slate-400 font-extrabold text-[10px] uppercase">Close</Text>
              </Pressable>
            </View>

            <View className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-4">
              <View className="flex-row justify-between items-center border-b border-slate-100 dark:border-slate-900 pb-3 mb-3">
                <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold">Matches Played</Text>
                <Text className="text-slate-900 dark:text-white text-xs font-black">{stats.tournamentsPlayed}</Text>
              </View>
              <View className="flex-row justify-between items-center border-b border-slate-100 dark:border-slate-900 pb-3 mb-3">
                <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold">Tournaments Won</Text>
                <Text className="text-slate-900 dark:text-white text-xs font-black">{stats.tournamentsWon}</Text>
              </View>
              <View className="flex-row justify-between items-center border-b border-slate-100 dark:border-slate-900 pb-3 mb-3">
                <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold">Total Kills</Text>
                <Text className="text-slate-900 dark:text-white text-xs font-black">{stats.totalKills}</Text>
              </View>
              <View className="flex-row justify-between items-center border-b border-slate-100 dark:border-slate-900 pb-3 mb-3">
                <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold">PlayCoin Earned</Text>
                <Text className="text-slate-900 dark:text-white text-xs font-black">{stats.points}</Text>
              </View>
              <View className="flex-row justify-between items-center border-b border-slate-100 dark:border-slate-900 pb-3 mb-3">
                <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold">Referral Code</Text>
                <Text className="text-sky-600 dark:text-sky-400 text-xs font-black uppercase">{user?.referralCode || 'N/A'}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold">Referred Users</Text>
                <Text className="text-slate-900 dark:text-white text-xs font-black">{user?.referralCount || 0}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* App Theme Modal */}
      <Modal visible={showThemeModal} animationType="slide" transparent>
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-6 border-t border-slate-200 dark:border-slate-800 shadow-xl">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-slate-900 dark:text-white text-base font-black uppercase tracking-wider">Select Theme</Text>
              <Pressable 
                onPress={() => setShowThemeModal(false)}
                className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
              >
                <Text className="text-slate-500 dark:text-slate-400 font-extrabold text-[10px] uppercase">Close</Text>
              </Pressable>
            </View>

            <View className="space-y-3">
              <Pressable 
                onPress={() => { setColorScheme('light'); setShowThemeModal(false); }}
                className="p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex-row items-center justify-between mb-3"
              >
                <Text className="text-slate-700 dark:text-slate-200 text-xs font-black">LIGHT MODE</Text>
                {colorScheme === 'light' && <CheckCircle2 size={16} color="#0EA5E9" />}
              </Pressable>

              <Pressable 
                onPress={() => { setColorScheme('dark'); setShowThemeModal(false); }}
                className="p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex-row items-center justify-between mb-3"
              >
                <Text className="text-slate-700 dark:text-slate-200 text-xs font-black">DARK MODE</Text>
                {colorScheme === 'dark' && <CheckCircle2 size={16} color="#0EA5E9" />}
              </Pressable>

              <Pressable 
                onPress={() => { setColorScheme('system'); setShowThemeModal(false); }}
                className="p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex-row items-center justify-between"
              >
                <Text className="text-slate-700 dark:text-slate-200 text-xs font-black">SYSTEM DEFAULT</Text>
                {colorScheme === 'system' && <CheckCircle2 size={16} color="#0EA5E9" />}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
