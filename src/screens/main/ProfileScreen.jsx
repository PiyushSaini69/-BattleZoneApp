import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, Alert, Switch, Modal, Clipboard, Share, useColorScheme as useRNColorScheme } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Header from '../../components/ui/Header';
import { 
  User, Wallet, BarChart3, Trophy, Bell, Headphones, 
  LogOut, ChevronRight, Shield, CheckCircle2, Settings, FileText, Copy, Info, Share2
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
  
  const [importanceNotice, setImportanceNotice] = useState(true);

  // Modals state
  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleShareApp = async () => {
    try {
      const message = `Join me on BattleZone, the ultimate esports tournament platform! Play daily matches, show off your skills, and earn coins. Download the app now and use my referral code: ${user?.referralCode || 'N/A'}`;
      await Share.share({
        message,
      });
    } catch (error) {
      Alert.alert('Sharing Failed', error.message);
    }
  };

  const handleLogoutPress = () => {
    Alert.alert('Logout 🔌', 'Are you sure you want to log out from BattleZone?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout }
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
        <View className="bg-white dark:bg-slate-900 rounded-2xl py-4 px-2 flex-row items-center justify-between shadow-sm border border-slate-200/50 dark:border-slate-800/60 mb-4">
          <View className="flex-1 items-center">
            <Text className="text-sky-600 dark:text-sky-400 text-base font-black">{stats.tournamentsPlayed}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold mt-1 uppercase tracking-wide text-center">Matches</Text>
          </View>

          <View className="w-[1px] h-8 bg-slate-200 dark:bg-slate-800" />

          <View className="flex-1 items-center">
            <Text className="text-emerald-600 dark:text-emerald-400 text-base font-black">{stats.tournamentsWon}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold mt-1 uppercase tracking-wide text-center">Won</Text>
          </View>

          <View className="w-[1px] h-8 bg-slate-200 dark:bg-slate-800" />

          <View className="flex-1 items-center">
            <Text className="text-sky-600 dark:text-sky-400 text-base font-black">{stats.totalKills}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold mt-1 uppercase tracking-wide text-center">Kills</Text>
          </View>

          <View className="w-[1px] h-8 bg-slate-200 dark:bg-slate-800" />

          <View className="flex-1 items-center">
            <View className="flex-row items-center justify-center">
              <GoldCoin size={13} />
              <Text className="text-sky-600 dark:text-sky-400 text-base font-black ml-1">{stats.points}</Text>
            </View>
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold mt-1 uppercase tracking-wide text-center">Coins Won</Text>
          </View>
        </View>

        {/* Referral Code & Referred Users Card */}
        <View className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex-row items-center justify-between shadow-sm border border-slate-200/50 dark:border-slate-800/60 mb-5">
          <View className="flex-1">
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1">Referral Code</Text>
            <View className="flex-row items-center">
              <Text className="text-slate-800 dark:text-white text-sm font-black uppercase tracking-wider">{user?.referralCode || 'N/A'}</Text>
              {user?.referralCode && (
                <Pressable 
                  onPress={() => {
                    Clipboard.setString(user.referralCode);
                    Alert.alert('Copied! 📋', 'Referral code copied to clipboard.');
                  }}
                  className="ml-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg"
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <Copy size={12} color={isDark ? '#38BDF8' : '#0EA5E9'} />
                </Pressable>
              )}
            </View>
          </View>
          
          <View className="w-[1px] h-9 bg-slate-200 dark:bg-slate-800 mx-3" />
          
          <View className="flex-1 items-end">
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase tracking-wider mb-1">Referred Users</Text>
            <Text className="text-sky-600 dark:text-sky-400 text-sm font-black">{user?.referralCount || 0}</Text>
          </View>
        </View>

        {/* Menu Options List */}
        <View>
          {/* My Profile */}
          <Pressable
            onPress={() => navigation.navigate('EditProfile')}
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
            onPress={() => navigation.navigate('MyStatistics')}
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

          {/* Share App */}
          <Pressable
            onPress={handleShareApp}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex-row justify-between items-center mb-3 shadow-sm border border-slate-200/50 dark:border-slate-800/60"
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <View className="flex-row items-center">
              <Share2 size={18} color="#0EA5E9" />
              <Text className="text-slate-800 dark:text-slate-200 text-sm font-black ml-3.5">Share App</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </Pressable>

          {/* About Us */}
          <Pressable
            onPress={() => navigation.navigate('AboutUs')}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex-row justify-between items-center mb-3 shadow-sm border border-slate-200/50 dark:border-slate-800/60"
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <View className="flex-row items-center">
              <Info size={18} color="#0EA5E9" />
              <Text className="text-slate-800 dark:text-slate-200 text-sm font-black ml-3.5">About Us</Text>
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

          {/* Terms & Conditions */}
          <Pressable
            onPress={() => navigation.navigate('Terms')}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex-row justify-between items-center mb-3 shadow-sm border border-slate-200/50 dark:border-slate-800/60"
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <View className="flex-row items-center">
              <FileText size={18} color="#0EA5E9" />
              <Text className="text-slate-800 dark:text-slate-200 text-sm font-black ml-3.5">Terms & Conditions</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </Pressable>

          {/* Privacy Policy */}
          <Pressable
            onPress={() => navigation.navigate('Privacy')}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex-row justify-between items-center mb-3 shadow-sm border border-slate-200/50 dark:border-slate-800/60"
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <View className="flex-row items-center">
              <Shield size={18} color="#0EA5E9" />
              <Text className="text-slate-800 dark:text-slate-200 text-sm font-black ml-3.5">Privacy Policy</Text>
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
              <Text className="text-rose-700 dark:text-rose-300 text-sm font-black ml-3.5">Logout</Text>
            </View>
            <ChevronRight size={16} color="#F43F5E" />
          </Pressable>

          {/* App Version Info */}
          <View className="items-center justify-center mt-2 mb-4">
            <Text className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider">
              BattleZone App v1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>





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
