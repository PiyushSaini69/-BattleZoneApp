import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl, ActivityIndicator, useColorScheme as useRNColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, History } from 'lucide-react-native';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
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

export default function TransactionsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const isDark = colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTransactions = async () => {
    try {
      const txRes = await request('/wallet/transactions?limit=50');
      if (txRes.success) {
        setTransactions(txRes.data.transactions);
      }
    } catch (err) {
      console.log('Error loading transaction details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const getTxTypeBadgeColor = (type) => {
    switch (type) {
      case 'deposit': return 'success';
      case 'prize_credit': return 'purple';
      case 'referral_bonus': return 'cyan';
      case 'refund': return 'success';
      case 'bonus': return 'success';
      case 'entry_fee': return 'danger';
      case 'withdrawal': return 'warning';
      default: return 'info';
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      {/* Custom Header with Back Button */}
      <View 
        className="flex-row items-center justify-between p-4 border-b"
        style={{
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          paddingTop: insets.top > 0 ? insets.top + 10 : 20,
        }}
      >
        <Pressable 
          onPress={() => navigation.goBack()}
          className="p-2 bg-slate-200 dark:bg-slate-900 rounded-full border"
          style={{
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
          }}
        >
          <ArrowLeft size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </Pressable>
        <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-widest">
          Transactions
        </Text>
        <View className="w-9" />
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
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        <View className="mb-4 flex-row items-center px-1">
          <History size={16} color={isDark ? '#06B6D4' : '#0891B2'} style={{ marginRight: 6 }} />
          <Text className="text-slate-900 dark:text-white font-extrabold text-xs uppercase tracking-widest">Transaction History</Text>
        </View>

        {loading && !refreshing ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color={isDark ? '#00E5FF' : '#7C3AED'} />
          </View>
        ) : transactions.length === 0 ? (
          <GlassCard className="py-12 items-center">
            <History size={36} color={isDark ? '#334155' : '#CBD5E1'} style={{ marginBottom: 10 }} />
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold">No transactions recorded yet.</Text>
            <Text className="text-slate-400 dark:text-slate-500 text-[10px] font-medium mt-1">Your transaction history will appear here</Text>
          </GlassCard>
        ) : (
          transactions.map((tx) => (
            <GlassCard 
              key={tx._id} 
              className="mb-3 py-3 px-4 flex-row justify-between items-center"
              glowColor="purple"
            >
              <View className="flex-1 mr-3">
                <View className="flex-row items-center mb-1">
                  <Badge text={tx.type.replace('_', ' ')} variant={getTxTypeBadgeColor(tx.type)} />
                  <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase ml-2">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text className="text-slate-500 dark:text-slate-400 text-[9px]" numberOfLines={1}>
                  {tx.description || `Transaction Ref: ${tx._id.slice(-6)}`}
                </Text>
              </View>
              <View className="items-end">
                <View className="flex-row items-center">
                  <Text className={`text-base font-black mr-1 ${
                    ['deposit', 'prize_credit', 'referral_bonus', 'refund', 'bonus'].includes(tx.type) 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {['deposit', 'prize_credit', 'referral_bonus', 'refund', 'bonus'].includes(tx.type) ? '+' : '-'}
                  </Text>
                  <GoldCoin size={14} />
                  <Text className={`text-base font-black ml-1 ${
                    ['deposit', 'prize_credit', 'referral_bonus', 'refund', 'bonus'].includes(tx.type) 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {tx.amount}
                  </Text>
                </View>
                <Text className={`text-[8px] font-extrabold uppercase mt-0.5 ${
                  tx.status === 'completed' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : tx.status === 'pending' 
                      ? 'text-amber-500 dark:text-amber-400' 
                      : 'text-rose-500 dark:text-rose-400'
                }`}>
                  {tx.status}
                </Text>
              </View>
            </GlassCard>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}
