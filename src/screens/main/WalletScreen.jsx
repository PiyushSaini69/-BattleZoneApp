import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, RefreshControl, Alert, Modal } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { Wallet, Plus, ArrowUpRight, History } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function WalletScreen() {
  const { user } = useContext(AuthContext);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
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
      Alert.alert('Invalid Amount ⚠️', 'Minimum deposit is ₹10.');
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
        Alert.alert('Success 🎉', `₹${pendingTx.amount} deposited successfully!`);
        await loadWalletData();
      }
    } catch (err) {
      Alert.alert('Verification Error', err.message);
    }
  };

  const handleWithdrawal = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 100) {
      Alert.alert('Invalid Amount ⚠️', 'Minimum withdrawal is ₹100.');
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
    backgroundColor: isDark ? '#020617' : '#f1f5f9',
    color: isDark ? '#ffffff' : '#0F172A',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: isDark ? '#1E293B' : '#cbd5e1'
  };

  return (
    <ScrollView 
      className="flex-1 bg-slate-50 dark:bg-[#0B0F1A]"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" colors={["#7C3AED"]} />
      }
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      <GlassCard 
        className="p-6 mb-6 items-center"
        style={{
          backgroundColor: isDark ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.08)',
          borderColor: isDark ? 'rgba(124, 58, 237, 0.2)' : 'rgba(124, 58, 237, 0.15)',
        }}
      >
        <View 
          className="p-3 rounded-full mb-3"
          style={{ backgroundColor: isDark ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.05)' }}
        >
          <Wallet size={28} color={isDark ? '#C084FC' : '#7C3AED'} />
        </View>
        <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Balance</Text>
        <Text className="text-slate-900 dark:text-white text-3xl font-black mt-1">₹{wallet.totalBalance.toFixed(2)}</Text>
        
        <View 
          className="flex-row justify-between w-full border-t border-slate-200 dark:border-slate-800 pt-4 mt-4"
        >
          <View 
            className="items-center flex-1 border-r border-slate-200 dark:border-slate-800"
          >
            <Text className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">₹{wallet.depositBalance.toFixed(2)}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase font-bold mt-0.5">Deposits</Text>
          </View>
          <View 
            className="items-center flex-1 border-r border-slate-200 dark:border-slate-800"
          >
            <Text className="text-purple-650 dark:text-[#C084FC] font-bold text-sm">₹{wallet.winningBalance.toFixed(2)}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase font-bold mt-0.5">Winnings</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-cyan-600 dark:text-cyan-400 font-bold text-sm">₹{wallet.bonusBalance.toFixed(2)}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase font-bold mt-0.5">Bonus</Text>
          </View>
        </View>
      </GlassCard>

      <View className="mb-6 flex-row justify-between">
        <GlassCard className="w-[48%] p-4">
          <Text className="text-slate-900 dark:text-white font-extrabold text-[10px] uppercase tracking-wider mb-3">Add Cash</Text>
          <TextInput
            value={depositAmount}
            onChangeText={setDepositAmount}
            placeholder="₹ Amount"
            placeholderTextColor={isDark ? "#475569" : "#94A3B8"}
            keyboardType="number-pad"
            style={inputStyle}
          />
          <Pressable 
            onPress={handleDeposit}
            disabled={loading}
            className="bg-purple-600 rounded-lg py-2.5 flex-row justify-center items-center"
          >
            <Plus size={16} color="#fff" style={{ marginRight: 4 }} />
            <Text className="text-white text-[10px] font-bold uppercase">Deposit</Text>
          </Pressable>
        </GlassCard>

        <GlassCard className="w-[48%] p-4">
          <Text className="text-slate-900 dark:text-white font-extrabold text-[10px] uppercase tracking-wider mb-3">Withdraw</Text>
          <TextInput
            value={withdrawAmount}
            onChangeText={setWithdrawAmount}
            placeholder="₹ Amount"
            placeholderTextColor={isDark ? "#475569" : "#94A3B8"}
            keyboardType="number-pad"
            style={inputStyle}
          />
          <TextInput
            value={withdrawUpi}
            onChangeText={setWithdrawUpi}
            placeholder="UPI Address"
            placeholderTextColor={isDark ? "#475569" : "#94A3B8"}
            style={{ ...inputStyle, fontSize: 10 }}
            autoCapitalize="none"
          />
          <Pressable 
            onPress={handleWithdrawal}
            disabled={loading}
            className="bg-emerald-600 rounded-lg py-2.5 flex-row justify-center items-center"
          >
            <ArrowUpRight size={16} color="#fff" style={{ marginRight: 4 }} />
            <Text className="text-white text-[10px] font-bold uppercase">Withdraw</Text>
          </Pressable>
        </GlassCard>
      </View>

      <View className="mb-4 flex-row items-center">
        <History size={16} color={isDark ? '#94A3B8' : '#64748B'} style={{ marginRight: 6 }} />
        <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wider">Transaction History</Text>
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
              <Text className={`text-base font-black ${
                ['deposit', 'prize_credit', 'referral_bonus'].includes(tx.type) 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-900 dark:text-white'
              }`}>
                {['deposit', 'prize_credit', 'referral_bonus'].includes(tx.type) ? '+' : '-'}₹{tx.amount}
              </Text>
              <Text className={`text-[8px] font-bold uppercase mt-0.5 ${
                tx.status === 'completed' 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : tx.status === 'pending' 
                    ? 'text-amber-600 dark:text-amber-400' 
                    : 'text-red-650 dark:text-red-400'
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
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        >
          <GlassCard 
            className="w-full max-w-sm p-6"
            style={{ 
              backgroundColor: isDark ? '#020617' : '#ffffff',
              borderColor: isDark ? 'rgba(124, 58, 237, 0.35)' : 'rgba(124, 58, 237, 0.15)',
              borderWidth: 1 
            }}
          >
            <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold text-center uppercase tracking-widest mb-1">RAZORPAY</Text>
            <Text className="text-[#7C3AED] dark:text-[#C084FC] text-base font-black text-center mb-4">SECURE GATEWAY SIMULATOR</Text>
            
            <View className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 mb-6">
              <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold text-center uppercase">Deposit Amount</Text>
              <Text className="text-slate-900 dark:text-white text-3xl font-black text-center mt-1">₹{pendingTx?.amount}</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-[9px] text-center mt-3">
                Order ID: {pendingTx?.orderId}
              </Text>
            </View>

            <Text className="text-slate-650 dark:text-slate-400 text-[10px] text-center mb-6 leading-relaxed">
              This is a sandbox mock payment container. Confirming below simulates a successful API bank verification.
            </Text>

            <View className="flex-row justify-between">
              <Pressable 
                onPress={() => completeMockDeposit('fail')}
                style={{ flex: 1, marginRight: 8, backgroundColor: isDark ? '#450a0a' : '#fee2e2', borderColor: '#ef4444', borderWidth: 1, borderRadius: 12, paddingVertical: 12 }}
              >
                <Text className="text-red-600 dark:text-red-400 text-center font-bold text-xs uppercase tracking-wide">Decline</Text>
              </Pressable>
              <Pressable 
                onPress={() => completeMockDeposit('success')}
                style={{ flex: 1, marginLeft: 8, backgroundColor: '#7c3aed', borderColor: '#a78bfa', borderWidth: 1, borderRadius: 12, paddingVertical: 12 }}
              >
                <Text className="text-white text-center font-bold text-xs uppercase tracking-wide">Pay Secure</Text>
              </Pressable>
            </View>
          </GlassCard>
        </View>
      </Modal>
    </ScrollView>
  );
}
