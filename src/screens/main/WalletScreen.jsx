import React, { useState, useEffect, useContext } from 'react';
// Header import for consistent top bar
import { ScrollView, View, Text, TextInput, Pressable, RefreshControl, Alert, Modal, ActivityIndicator, useColorScheme as useRNColorScheme } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { Wallet, Plus, ArrowUpRight, History } from 'lucide-react-native';
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
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [depositAmount, setDepositAmount] = useState('100');
  const [withdrawAmount, setWithdrawAmount] = useState('100');
  const [withdrawUpi, setWithdrawUpi] = useState('');
  const [showSimulator, setShowSimulator] = useState(false);
  const [pendingTx, setPendingTx] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadWalletData = async () => {
    try {
      const res = await request('/wallet');
      if (res.success) setWallet(res.data);
      
      const txRes = await request('/wallet/transactions');
      if (txRes.success) setTransactions(txRes.data.transactions);
    } catch (err) {
      console.log('Error loading wallet details:', err.message);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWalletData();
    setRefreshing(false);
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount < 10) {
      Alert.alert('Invalid Amount ⚠️', 'Minimum deposit is 10 Coins.');
      return;
    }

    setLoading(true);
    try {
      const res = await request('/wallet/deposit', {
        method: 'POST',
        body: JSON.stringify({ amount })
      });
      if (res.success) {
        setPendingTx(res.data);
        setShowSimulator(true);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const completeMockDeposit = async (status) => {
    setShowSimulator(false);
    if (status === 'fail') {
      Alert.alert('Payment Failed ❌', 'Your mock transaction was cancelled.');
      return;
    }

    try {
      const res = await request('/wallet/deposit/verify', {
        method: 'POST',
        body: JSON.stringify({
          razorpay_order_id: pendingTx.orderId,
          razorpay_payment_id: `pay_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          razorpay_signature: 'mock_signature'
        })
      });
      if (res.success) {
        Alert.alert('Success 🎉', `${pendingTx.amount} Coins deposited successfully!`);
        await loadWalletData();
      }
    } catch (err) {
      Alert.alert('Verification Error', err.message);
    }
  };

  const handleWithdrawal = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 100) {
      Alert.alert('Invalid Amount ⚠️', 'Minimum withdrawal is 100 Coins.');
      return;
    }
    if (!withdrawUpi || !withdrawUpi.includes('@')) {
      Alert.alert('Invalid UPI ID ⚠️', 'Please enter a valid UPI address (e.g. name@upi).');
      return;
    }

    setLoading(true);
    try {
      const res = await request('/wallet/withdraw', {
        method: 'POST',
        body: JSON.stringify({
          amount,
          method: 'upi',
          upiId: withdrawUpi
        })
      });
      if (res.success) {
        Alert.alert('Request Submitted 💸', res.message);
        setWithdrawUpi('');
        await loadWalletData();
      }
    } catch (err) {
      Alert.alert('Withdrawal Failed ❌', err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTxTypeBadgeColor = (type) => {
    switch (type) {
      case 'deposit': return 'success';
      case 'prize_credit': return 'purple';
      case 'referral_bonus': return 'cyan';
      case 'entry_fee': return 'danger';
      case 'withdrawal': return 'warning';
      default: return 'info';
    }
  };

  const inputStyle = {
    backgroundColor: isDark ? '#0A0E1A' : '#FFFFFF',
    color: isDark ? '#ffffff' : '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(124, 58, 237, 0.3)',
    fontSize: 12
  };

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

        <View className="mb-6 flex-row justify-between">
          <GlassCard className="w-[48%] p-4" glowColor="purple">
            <Text className="text-slate-900 dark:text-white font-extrabold text-[10px] uppercase tracking-wider mb-3 px-0.5">Add Cash</Text>
            <TextInput
              value={depositAmount}
              onChangeText={setDepositAmount}
              placeholder="Coins Amount"
              placeholderTextColor="#475569"
              keyboardType="number-pad"
              style={inputStyle}
            />
            <Pressable 
              onPress={handleDeposit}
              disabled={loading}
              className="bg-violet-600 rounded-xl py-3 flex-row justify-center items-center"
              style={({ pressed }) => [{
                opacity: pressed ? 0.8 : 1,
                shadowColor: '#8B5CF6',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3
              }]}
            >
              <Plus size={14} color="#fff" style={{ marginRight: 4 }} />
              <Text className="text-white text-[10px] font-black uppercase tracking-wider">Deposit</Text>
            </Pressable>
          </GlassCard>

          <GlassCard className="w-[48%] p-4" glowColor="purple">
            <Text className="text-slate-900 dark:text-white font-extrabold text-[10px] uppercase tracking-wider mb-3 px-0.5">Withdraw</Text>
            <TextInput
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              placeholder="Coins Amount"
              placeholderTextColor="#475569"
              keyboardType="number-pad"
              style={inputStyle}
            />
            <TextInput
              value={withdrawUpi}
              onChangeText={setWithdrawUpi}
              placeholder="UPI Address"
              placeholderTextColor="#475569"
              style={{ ...inputStyle, fontSize: 10, paddingVertical: 8 }}
              autoCapitalize="none"
            />
            <Pressable 
              onPress={handleWithdrawal}
              disabled={loading}
              className="bg-emerald-600 rounded-xl py-3 flex-row justify-center items-center"
              style={({ pressed }) => [{
                opacity: pressed ? 0.8 : 1,
                shadowColor: '#10B981',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3
              }]}
            >
              <ArrowUpRight size={14} color="#fff" style={{ marginRight: 4 }} />
              <Text className="text-white text-[10px] font-black uppercase tracking-wider">Withdraw</Text>
            </Pressable>
          </GlassCard>
        </View>

        <View className="mb-4 flex-row items-center px-1">
          <History size={16} color="#94A3B8" style={{ marginRight: 6 }} />
          <Text className="text-slate-900 dark:text-white font-extrabold text-xs uppercase tracking-widest">Transaction History</Text>
        </View>

        {transactions.length === 0 ? (
          <GlassCard className="py-8 items-center">
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold">No transactions recorded yet.</Text>
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
                    ['deposit', 'prize_credit', 'referral_bonus'].includes(tx.type) 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {['deposit', 'prize_credit', 'referral_bonus'].includes(tx.type) ? '+' : '-'}
                  </Text>
                  <GoldCoin size={14} />
                  <Text className={`text-base font-black ml-1 ${
                    ['deposit', 'prize_credit', 'referral_bonus'].includes(tx.type) 
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
                      : 'text-rose-500 dark:text-rose-450'
                }`}>
                  {tx.status}
                </Text>
              </View>
            </GlassCard>
          ))
        )}

        <Modal transparent visible={showSimulator} animationType="slide">
          <View 
            className="flex-1 justify-center items-center p-6"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          >
            <GlassCard 
              className="w-full max-w-sm p-6 bg-white dark:bg-[#060A13]"
              glowColor="purple"
            >
              <Text className="text-slate-500 text-[10px] font-extrabold text-center uppercase tracking-widest mb-1">RAZORPAY</Text>
              <Text className="text-violet-600 dark:text-[#C084FC] text-base font-black text-center mb-4 uppercase tracking-wider">GATEWAY SIMULATOR</Text>
              
              <View className="bg-slate-100 dark:bg-slate-950 rounded-xl p-4 mb-6 border border-slate-200 dark:border-slate-900">
                <Text className="text-slate-500 text-[10px] font-extrabold text-center uppercase tracking-wider">Deposit Amount</Text>
                <View className="flex-row items-center justify-center mt-1">
                  <GoldCoin size={24} />
                  <Text className="text-slate-900 dark:text-white text-3xl font-black ml-2">{pendingTx?.amount}</Text>
                </View>
                <Text className="text-slate-500 text-[9px] text-center mt-3">
                  Order ID: {pendingTx?.orderId}
                </Text>
              </View>

              <Text className="text-slate-600 dark:text-slate-400 text-[10px] text-center mb-6 leading-relaxed px-2">
                This is a sandbox mock payment container. Confirming below simulates a successful API bank verification.
              </Text>

              <View className="flex-row justify-between">
                <Pressable 
                  onPress={() => completeMockDeposit('fail')}
                  style={{ flex: 1, marginRight: 8, backgroundColor: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.4)', borderWidth: 1, borderRadius: 12, paddingVertical: 12 }}
                >
                  <Text className="text-rose-400 text-center font-extrabold text-xs uppercase tracking-wider">Decline</Text>
                </Pressable>
                <Pressable 
                  onPress={() => completeMockDeposit('success')}
                  style={{ flex: 1, marginLeft: 8, backgroundColor: '#8B5CF6', borderColor: '#A78BFA', borderWidth: 1, borderRadius: 12, paddingVertical: 12 }}
                >
                  <Text className="text-white text-center font-extrabold text-xs uppercase tracking-wider">Pay Secure</Text>
                </Pressable>
              </View>
            </GlassCard>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
}
