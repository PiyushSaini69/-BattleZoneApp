import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Pressable, useColorScheme as useRNColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import { Bell } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

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

export default function Header({ navigation }) {
  const { user } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const [balance, setBalance] = useState(0);
  const { colorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const isDark = colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';

  const loadBalance = async () => {
    if (!user) return;
    try {
      const walletRes = await request('/wallet');
      if (walletRes.success) {
        setBalance(walletRes.data.totalBalance || 0);
      }
    } catch (e) {
      console.log('Header balance fetch error:', e.message);
    }
  };

  useEffect(() => {
    loadBalance();
    
    // Refresh balance when screen comes into focus
    const unsubscribe = navigation?.addListener('focus', () => {
      loadBalance();
    });
    return unsubscribe;
  }, [user, navigation]);

  return (
    <View 
      className="flex-row justify-between items-center mb-5 mt-1"
      style={{ 
        paddingTop: insets.top > 0 ? insets.top + 10 : 20,
        paddingHorizontal: 4
      }}
    >
      <View>
        <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Welcome back,</Text>
        <Text 
          className="text-slate-900 dark:text-white text-2xl font-black mt-1 uppercase tracking-wide"
          style={{
            textShadowColor: isDark ? 'rgba(0, 229, 255, 0.35)' : 'rgba(124, 58, 237, 0.15)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 8,
          }}
        >
          {user ? (user.displayName || user.username) : 'Warrior'}
        </Text>
      </View>
      <View className="flex-row items-center">
        {/* Wallet Balance Pill */}
        <Pressable
          onPress={() => navigation.navigate('WalletTab')}
          className="flex-row items-center bg-slate-200 dark:bg-slate-950 px-3.5 py-2 rounded-full border border-slate-300 dark:border-slate-800"
          style={{ marginRight: 10 }}
        >
          <GoldCoin size={18} />
          <Text className="text-slate-900 dark:text-white text-xs font-black" style={{ marginLeft: 6 }}>
            {balance.toFixed(2)}
          </Text>
        </Pressable>

        {/* Notification Bell */}
        <Pressable
          onPress={() => navigation.navigate('Notification')}
          className="p-2.5 bg-slate-200 dark:bg-slate-950 rounded-full border border-slate-300 dark:border-slate-800"
          style={{ marginRight: 10 }}
        >
          <Bell size={16} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </Pressable>

        {/* Profile Avatar */}
        <Pressable 
          onPress={() => navigation.navigate('ProfileTab')}
          className="w-12 h-12 bg-slate-200 dark:bg-slate-950 rounded-full border-2 justify-center items-center overflow-hidden"
          style={{ 
            borderColor: isDark ? '#00E5FF' : '#7C3AED',
            shadowColor: isDark ? '#00E5FF' : '#7C3AED',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isDark ? 0.5 : 0.2,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <Text className="text-cyan-600 dark:text-cyan-400 text-lg font-black">
            {user ? user.username.slice(0, 2).toUpperCase() : 'W'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
