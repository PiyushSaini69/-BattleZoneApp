import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, RefreshControl, Alert, Modal, Animated, useColorScheme as useRNColorScheme } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { Wallet, Plus, ArrowUpRight, History, ArrowDownLeft, ChevronRight } from 'lucide-react-native';
import Header from '../../components/ui/Header';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
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

export default function WalletScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { colorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const isDark = colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';
  const [wallet, setWallet] = useState({ depositBalance: 0, winningBalance: 0, bonusBalance: 0, totalBalance: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const loadWalletData = async () => {
    try {
      const res = await request('/wallet');
      if (res.success) setWallet(res.data);
    } catch (err) {
      console.log('Error loading wallet details:', err.message);
    }
  };

  useEffect(() => {
    loadWalletData();
    const unsubscribe = navigation?.addListener('focus', () => {
      loadWalletData();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWalletData();
    setRefreshing(false);
  };

  // Action button config
  const actionButtons = [
    {
      key: 'add',
      label: 'Add Coin',
      subtitle: 'Deposit funds to wallet',
      icon: Plus,
      accentColor: isDark ? '#A78BFA' : '#7C3AED',
      iconBgColor: isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.08)',
      iconBorderColor: isDark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.2)',
      glowColor: '#8B5CF6',
      onPress: () => navigation.navigate('AddCoin'),
    },
    {
      key: 'redeem',
      label: 'Redeem Coin',
      subtitle: 'Withdraw to your UPI',
      icon: ArrowDownLeft,
      accentColor: isDark ? '#34D399' : '#059669',
      iconBgColor: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)',
      iconBorderColor: isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.2)',
      glowColor: '#10B981',
      onPress: () => navigation.navigate('RedeemCoin'),
    },
    {
      key: 'transactions',
      label: 'Transaction',
      subtitle: 'View all activity',
      icon: History,
      accentColor: isDark ? '#22D3EE' : '#0891B2',
      iconBgColor: isDark ? 'rgba(6, 182, 212, 0.12)' : 'rgba(6, 182, 212, 0.08)',
      iconBorderColor: isDark ? 'rgba(6, 182, 212, 0.25)' : 'rgba(6, 182, 212, 0.2)',
      glowColor: '#06B6D4',
      onPress: () => navigation.navigate('Transactions'),
    },
  ];

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
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={isDark ? "#00E5FF" : "#7C3AED"} 
            colors={[isDark ? "#00E5FF" : "#7C3AED"]} 
            progressBackgroundColor={isDark ? "#0A0E1A" : "#FFFFFF"}
          />
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
      >

        {/* ─── Balance Card ─── */}
        <GlassCard 
          className="p-6 mb-6 items-center"
          glowColor="cyan"
        >
          <View 
            className="p-3 rounded-full mb-3 bg-slate-100 dark:bg-[#0A0E1A]"
            style={{
              borderColor: isDark ? 'rgba(0, 229, 255, 0.3)' : 'rgba(0, 229, 255, 0.5)',
              borderWidth: 1,
              shadowColor: '#00E5FF',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: isDark ? 0.3 : 0.15,
              shadowRadius: 5,
            }}
          >
            <Wallet size={28} color={isDark ? "#00E5FF" : "#0891B2"} />
          </View>
          <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Total Balance</Text>
          <View className="flex-row items-center mt-1">
            <GoldCoin size={24} />
            <Text className="text-slate-900 dark:text-white text-3xl font-black ml-2">{wallet.totalBalance.toFixed(2)}</Text>
          </View>
          
          <View 
            className="flex-row justify-between w-full border-t border-slate-200 dark:border-slate-800/60 pt-4 mt-5"
          >
            <View 
              className="items-center flex-1 border-r border-slate-200 dark:border-slate-800/60"
            >
              <View className="flex-row items-center">
                <GoldCoin size={12} />
                <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm ml-1">{wallet.depositBalance.toFixed(2)}</Text>
              </View>
              <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase font-bold tracking-wider mt-0.5">Deposited</Text>
            </View>
            <View 
              className="items-center flex-1 border-r border-slate-200 dark:border-slate-800/60"
            >
              <View className="flex-row items-center">
                <GoldCoin size={12} />
                <Text className="text-violet-650 dark:text-violet-400 font-extrabold text-sm ml-1">{wallet.winningBalance.toFixed(2)}</Text>
              </View>
              <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase font-bold tracking-wider mt-0.5">Winnings</Text>
            </View>
            <View className="items-center flex-1">
              <View className="flex-row items-center">
                <GoldCoin size={12} />
                <Text className="text-cyan-600 dark:text-cyan-400 font-extrabold text-sm ml-1">{wallet.bonusBalance.toFixed(2)}</Text>
              </View>
              <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase font-bold tracking-wider mt-0.5">Bonus</Text>
            </View>
          </View>
        </GlassCard>

        {/* ─── Action Buttons ─── */}
        <View style={{ marginBottom: 20, gap: 10 }}>
          {actionButtons.map((btn) => {
            const IconComp = btn.icon;
            return (
              <Pressable
                key={btn.key}
                onPress={btn.onPress}
                style={({ pressed }) => [{
                  borderRadius: 16,
                  overflow: 'hidden',
                  opacity: pressed ? 0.88 : 1,
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                }]}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    borderRadius: 16,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                    borderLeftWidth: 1,
                    borderLeftColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Icon Circle */}
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      backgroundColor: btn.iconBgColor,
                      borderWidth: 1,
                      borderColor: btn.iconBorderColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: btn.glowColor,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.15,
                      shadowRadius: 4,
                    }}
                  >
                    <IconComp size={20} color={btn.accentColor} />
                  </View>

                  {/* Label + Subtitle */}
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text
                      style={{
                        color: isDark ? '#F1F5F9' : '#0F172A',
                        fontSize: 13,
                        fontWeight: '800',
                        letterSpacing: 0.3,
                      }}
                    >
                      {btn.label}
                    </Text>
                    <Text
                      style={{
                        color: isDark ? '#64748B' : '#94A3B8',
                        fontSize: 10,
                        fontWeight: '600',
                        marginTop: 2,
                      }}
                    >
                      {btn.subtitle}
                    </Text>
                  </View>

                  {/* Right chevron */}
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ChevronRight size={16} color={isDark ? '#475569' : '#94A3B8'} />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

      </ScrollView>
    </LinearGradient>
  );
}
