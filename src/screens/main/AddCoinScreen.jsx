import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Alert, Modal, ActivityIndicator, useColorScheme as useRNColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
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

export default function AddCoinScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const isDark = colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';

  const [depositAmount, setDepositAmount] = useState('100');
  const [showSimulator, setShowSimulator] = useState(false);
  const [pendingTx, setPendingTx] = useState(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
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
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert('Verification Error', err.message);
    } finally {
      setLoading(false);
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
          Add Coins
        </Text>
        <View className="w-9" />
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        <GlassCard className="p-5 mb-6" glowColor="purple">
          <View className="flex-row items-center mb-4">
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <Plus size={16} color={isDark ? '#A78BFA' : '#7C3AED'} />
            </View>
            <Text className="text-slate-900 dark:text-white font-extrabold text-xs uppercase tracking-wider">Add Coins</Text>
          </View>

          <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2 px-1">Enter Amount</Text>
          <TextInput
            value={depositAmount}
            onChangeText={setDepositAmount}
            placeholder="Coins Amount"
            placeholderTextColor="#475569"
            keyboardType="number-pad"
            style={inputStyle}
          />

          {/* Quick amount chips */}
          <View className="flex-row mb-4" style={{ gap: 8 }}>
            {['50', '100', '200', '500'].map((amt) => (
              <Pressable
                key={amt}
                onPress={() => setDepositAmount(amt)}
                style={({ pressed }) => [{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 10,
                  backgroundColor: depositAmount === amt
                    ? (isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.15)')
                    : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                  borderWidth: 1,
                  borderColor: depositAmount === amt
                    ? (isDark ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.4)')
                    : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'),
                  alignItems: 'center',
                  opacity: pressed ? 0.7 : 1,
                }]}
              >
                <View className="flex-row items-center">
                  <GoldCoin size={10} />
                  <Text
                    style={{
                      color: depositAmount === amt
                        ? (isDark ? '#A78BFA' : '#7C3AED')
                        : (isDark ? '#94A3B8' : '#64748B'),
                      fontSize: 10,
                      fontWeight: '800',
                      marginLeft: 3,
                    }}
                  >
                    {amt}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Pressable 
            onPress={handleDeposit}
            disabled={loading}
            style={({ pressed }) => [{
              opacity: pressed ? 0.85 : 1,
              borderRadius: 14,
              overflow: 'hidden',
            }]}
          >
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 14,
                borderRadius: 14,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#8B5CF6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Plus size={16} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    Deposit Now
                  </Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        </GlassCard>
      </ScrollView>

      {/* ─── Payment Simulator Modal ─── */}
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
    </LinearGradient>
  );
}
