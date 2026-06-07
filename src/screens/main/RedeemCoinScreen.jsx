import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Alert, ActivityIndicator, useColorScheme as useRNColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ArrowUpRight } from 'lucide-react-native';
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

export default function RedeemCoinScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const isDark = colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';

  const [withdrawAmount, setWithdrawAmount] = useState('100');
  const [withdrawUpi, setWithdrawUpi] = useState('');
  const [loading, setLoading] = useState(false);

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
        navigation.goBack();
      }
    } catch (err) {
      Alert.alert('Withdrawal Failed ❌', err.message);
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
          Redeem Coins
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
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <ArrowUpRight size={16} color={isDark ? '#34D399' : '#059669'} />
            </View>
            <Text className="text-slate-900 dark:text-white font-extrabold text-xs uppercase tracking-wider">Redeem Coins</Text>
          </View>

          <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2 px-1">Withdrawal Amount</Text>
          <TextInput
            value={withdrawAmount}
            onChangeText={setWithdrawAmount}
            placeholder="Coins Amount"
            placeholderTextColor="#475569"
            keyboardType="number-pad"
            style={inputStyle}
          />

          {/* Quick amount chips */}
          <View className="flex-row mb-3" style={{ gap: 8 }}>
            {['100', '200', '500', '1000'].map((amt) => (
              <Pressable
                key={amt}
                onPress={() => setWithdrawAmount(amt)}
                style={({ pressed }) => [{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 10,
                  backgroundColor: withdrawAmount === amt
                    ? (isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.15)')
                    : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                  borderWidth: 1,
                  borderColor: withdrawAmount === amt
                    ? (isDark ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.4)')
                    : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'),
                  alignItems: 'center',
                  opacity: pressed ? 0.7 : 1,
                }]}
              >
                <View className="flex-row items-center">
                  <GoldCoin size={10} />
                  <Text
                    style={{
                      color: withdrawAmount === amt
                        ? (isDark ? '#34D399' : '#059669')
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

          <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2 px-1">UPI Address</Text>
          <TextInput
            value={withdrawUpi}
            onChangeText={setWithdrawUpi}
            placeholder="e.g. name@upi"
            placeholderTextColor="#475569"
            style={{ ...inputStyle, fontSize: 11 }}
            autoCapitalize="none"
          />

          <Pressable 
            onPress={handleWithdrawal}
            disabled={loading}
            style={({ pressed }) => [{
              opacity: pressed ? 0.85 : 1,
              borderRadius: 14,
              overflow: 'hidden',
            }]}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 14,
                borderRadius: 14,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#10B981',
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
                  <ArrowUpRight size={16} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    Withdraw Now
                  </Text>
                </>
              )}
            </LinearGradient>
          </Pressable>

          <Text className="text-slate-500 dark:text-slate-400 text-[9px] text-center mt-3 font-semibold">
            Minimum withdrawal: 100 Coins • Processing: 24-48 hrs
          </Text>
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}
