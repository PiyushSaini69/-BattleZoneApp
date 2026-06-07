import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl, Alert, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ArrowLeft, CheckCircle, Pencil, Wallet } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const GoldCoin = ({ size = 14 }) => (
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

const formatDate = (dateStr) => {
  try {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strTime = String(hours).padStart(2, '0') + ':' + minutes + ' ' + ampm;
    
    return `${day}/${month}/${year} at ${strTime}`;
  } catch (e) {
    return dateStr;
  }
};

export default function RegisterTournamentScreen({ route, navigation }) {
  const { slug, tournamentId } = route.params;
  const { user } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [registrationStep, setRegistrationStep] = useState(1); // 1 = Choose Slot, 2 = Enter UID
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [gameUID, setGameUID] = useState('');
  const [wallet, setWallet] = useState({ depositBalance: 0, winningBalance: 0, bonusBalance: 0, totalBalance: 0 });
  const [showEditModal, setShowEditModal] = useState(false);
  const [tempUsername, setTempUsername] = useState('');

  const loadData = async () => {
    try {
      const res = await request(`/tournaments/${slug}`);
      if (res.success) {
        setTournament(res.data.tournament);
        
        const partRes = await request(`/tournaments/${res.data.tournament._id}/participants`);
        if (partRes.success) setParticipants(partRes.data);
      }

      const walletRes = await request('/wallet');
      if (walletRes.success) setWallet(walletRes.data);
    } catch (e) {
      console.log('Error loading registration tournament details:', e.message);
    }
  };

  useEffect(() => {
    loadData();
    if (user && user.gameUIDs) {
      setGameUID(user.gameUIDs.freeFire || '');
    }
  }, [slug, user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleConfirmRegistration = async () => {
    if (!gameUID.trim()) {
      Alert.alert('UID Required ⚠️', 'Please enter your gaming character UID to proceed.');
      return;
    }
    if (selectedSlot === null) {
      Alert.alert('Slot Required ⚠️', 'Please select a slot before registering.');
      return;
    }

    setLoading(true);
    try {
      const res = await request(`/tournaments/${tournament._id}/register`, {
        method: 'POST',
        body: JSON.stringify({ gameUID, slotNumber: selectedSlot })
      });
      if (res.success) {
        Alert.alert(
          'Registration Successful! 🎉', 
          `Slot #${selectedSlot} assigned successfully! Your match UID is verified.`
        );
        navigation.navigate('TournamentDetail', { slug });
      }
    } catch (err) {
      Alert.alert('Registration Failed ❌', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!tournament) {
    return (
      <LinearGradient
        colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text className="text-slate-400 text-sm font-semibold">Loading match lobby details...</Text>
      </LinearGradient>
    );
  }

  const occupiedSlots = participants.map(p => Number(p.slotNumber));

  const renderSlots = () => {
    const slots = [];
    for (let i = 1; i <= tournament.totalSlots; i++) {
      const isOccupied = occupiedSlots.includes(i);
      const isSelected = selectedSlot === i;

      slots.push(
        <Pressable
          key={i}
          disabled={isOccupied}
          onPress={() => setSelectedSlot(i)}
          className={`w-[48px] h-[48px] m-1 rounded-xl items-center justify-center border ${
            isOccupied
              ? 'bg-slate-200 dark:bg-slate-900 border-slate-300 dark:border-slate-950 opacity-40'
              : isSelected
                ? 'bg-violet-600 border-violet-500'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'
          }`}
          style={isSelected ? {
            shadowColor: '#8B5CF6',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 4,
            elevation: 2
          } : {}}
        >
          <Text className={`text-xs font-black ${isOccupied ? 'text-slate-400 dark:text-slate-600 line-through' : isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-300'}`}>
            {i}
          </Text>
        </Pressable>
      );
    }
    return slots;
  };

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      {/* Header bar */}
      <View 
        className="flex-row items-center justify-between p-4 border-b bg-white dark:bg-[#0A0F1A]"
        style={{
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          paddingTop: insets.top > 0 ? insets.top + 10 : 20,
        }}
      >
        <Pressable 
          onPress={() => {
            if (registrationStep === 2) {
              setRegistrationStep(1);
            } else {
              navigation.goBack();
            }
          }}
          className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full border"
          style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' }}
        >
          <ArrowLeft size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </Pressable>
        <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wider flex-1 text-center mr-6" numberOfLines={1}>
          {registrationStep === 1 ? 'Slot Selection' : 'Confirm Registration'}
        </Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <View 
          className="flex-1 px-4 pt-4"
          style={{ paddingBottom: insets.bottom > 0 ? insets.bottom + 4 : 8 }}
        >
          {/* Step Indicator */}
          <View className="flex-row items-center justify-center mb-6 mt-2">
            <View className={`w-8 h-8 rounded-full items-center justify-center ${registrationStep >= 1 ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
              <Text className="text-white font-extrabold text-xs">1</Text>
            </View>
            <View className={`h-1 w-12 ${registrationStep >= 2 ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
            <View className={`w-8 h-8 rounded-full items-center justify-center ${registrationStep >= 2 ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
              <Text className="text-white font-extrabold text-xs">2</Text>
            </View>
          </View>

          {registrationStep === 1 ? (
            // STEP 1 Layout
            <View className="flex-1">
              <ScrollView 
                className="flex-1 mb-4"
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl 
                    refreshing={refreshing} 
                    onRefresh={onRefresh} 
                    tintColor={isDark ? "#00E5FF" : "#7C3AED"} 
                    colors={[isDark ? "#00E5FF" : "#7C3AED"]} 
                    progressBackgroundColor={isDark ? "#0A0E1A" : "#FFFFFF"}
                  />
                }
              >
                <GlassCard className="p-5" glowColor="purple">
                  <Text className="text-slate-900 dark:text-white text-base font-black uppercase mb-1.5 px-0.5">Choose Your Slot</Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-5 px-0.5">
                    Please select any available slot number from the grid below. Crossed-out numbers are occupied by other warriors.
                  </Text>

                  <View className="flex-row flex-wrap justify-center py-2.5">
                    {renderSlots()}
                  </View>
                </GlassCard>
              </ScrollView>

              {/* Fixed Bottom Section */}
              <View>
                <GlassCard className="p-4 mb-4 flex-row justify-between items-center" glowColor="purple">
                  <View>
                    <Text className="text-slate-400 text-[9px] font-extrabold uppercase tracking-wide">Selected Slot</Text>
                    <Text className="text-slate-900 dark:text-white text-sm font-black mt-0.5">
                      {selectedSlot ? `#${selectedSlot}` : 'None Chosen'}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-slate-400 text-[9px] font-extrabold uppercase tracking-wide">Entry Cost</Text>
                    <View className="flex-row items-center mt-0.5">
                      <GoldCoin size={12} />
                      <Text className="text-slate-900 dark:text-white text-sm font-black ml-1">
                        {tournament.entryFee === 0 ? 'FREE' : `${tournament.entryFee} Coins`}
                      </Text>
                    </View>
                  </View>
                </GlassCard>

                <Button 
                  title="Next"
                  disabled={selectedSlot === null}
                  onPress={() => setRegistrationStep(2)}
                  variant="primary"
                />
              </View>
            </View>
          ) : (
            // STEP 2 Layout
            <View className="flex-1">
              {/* Wallet Balance Header */}
              <View className="bg-violet-600 dark:bg-violet-850 p-5 rounded-3xl items-center mb-6 shadow-md border border-violet-500/20">
                {/* Total Balance */}
                <Text className="text-violet-200 text-[10px] font-extrabold uppercase tracking-widest mb-1">Total Balance</Text>
                <View className="flex-row items-center mb-5 justify-center">
                  <GoldCoin size={22} />
                  <Text className="text-white text-3xl font-black ml-2">
                    {wallet.totalBalance.toFixed(0)}
                  </Text>
                </View>

                {/* Coin Breakdown Cards */}
                <View className="flex-row justify-between w-full">
                  <View className="bg-white rounded-2xl py-3 px-1 flex-1 items-center justify-center mx-1 shadow-sm">
                    <View className="flex-row items-center justify-center">
                      <GoldCoin size={10} />
                      <Text className="text-slate-900 font-extrabold text-xs ml-1">
                        {wallet.depositBalance.toFixed(0)}
                      </Text>
                    </View>
                    <Text className="text-slate-500 text-[9px] font-extrabold mt-1">Deposited</Text>
                  </View>

                  <View className="bg-white rounded-2xl py-3 px-1 flex-1 items-center justify-center mx-1 shadow-sm">
                    <View className="flex-row items-center justify-center">
                      <GoldCoin size={10} />
                      <Text className="text-slate-900 font-extrabold text-xs ml-1">
                        {wallet.winningBalance.toFixed(0)}
                      </Text>
                    </View>
                    <Text className="text-slate-500 text-[9px] font-extrabold mt-1">Winning</Text>
                  </View>

                  <View className="bg-white rounded-2xl py-3 px-1 flex-1 items-center justify-center mx-1 shadow-sm">
                    <View className="flex-row items-center justify-center">
                      <GoldCoin size={10} />
                      <Text className="text-slate-900 font-extrabold text-xs ml-1">
                        {wallet.bonusBalance.toFixed(0)}
                      </Text>
                    </View>
                    <Text className="text-slate-500 text-[9px] font-extrabold mt-1">Bonus</Text>
                  </View>
                </View>
              </View>

              {/* Scrollable details */}
              <ScrollView 
                className="flex-1 mb-4"
                showsVerticalScrollIndicator={false}
              >
                {/* Player Details Card */}
                <View className="bg-violet-600 dark:bg-violet-850 p-5 rounded-2xl shadow-md mb-4 border border-violet-500/20">
                  <Text className="text-white text-sm font-black text-center mb-4 uppercase tracking-wider">
                    Enter Player Details
                  </Text>
                  <View className="flex-row justify-between items-center">
                    <View className="items-center flex-1">
                      <Text className="text-violet-200 text-[9px] font-extrabold uppercase">Team</Text>
                      <Text className="text-white text-xs font-black mt-1">Team {selectedSlot}</Text>
                    </View>
                    <View className="items-center flex-1">
                      <Text className="text-violet-200 text-[9px] font-extrabold uppercase">Position</Text>
                      <Text className="text-white text-xs font-black mt-1">A</Text>
                    </View>
                    <Pressable 
                      onPress={() => {
                        setTempUsername(gameUID || '');
                        setShowEditModal(true);
                      }}
                      className="items-center flex-1"
                    >
                      <Text className="text-violet-200 text-[9px] font-extrabold uppercase mb-1">Player Details</Text>
                      <View className="flex-row items-center justify-center border-b border-white/30 pb-0.5 w-full max-w-[95px]">
                        <Text className="text-white text-xs font-black text-center flex-1" numberOfLines={1}>
                          {gameUID || 'Player 1'}
                        </Text>
                        <Pencil size={10} color="rgba(255, 255, 255, 0.6)" style={{ marginLeft: 3 }} />
                      </View>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>

              {/* Bottom Payment Actions */}
              <View className="pb-2 bg-white/40 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/60">
                <View className="flex-row items-center justify-center mb-1">
                  <Text className="text-slate-700 dark:text-slate-300 font-extrabold text-xs">
                    Match Entry Fee Per Player: 
                  </Text>
                  <View className="flex-row items-center ml-1">
                    <GoldCoin size={12} />
                    <Text className="text-slate-900 dark:text-white font-black text-xs ml-0.5">
                      {tournament.entryFee}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-center mb-3">
                  <Text className="text-slate-900 dark:text-white font-extrabold text-xs">
                    Total payable = 
                  </Text>
                  <View className="flex-row items-center ml-1">
                    <GoldCoin size={12} />
                    <Text className="text-slate-900 dark:text-white font-black text-xs ml-0.5">
                      {tournament.entryFee}
                    </Text>
                  </View>
                </View>

                {(wallet?.totalBalance || 0) < tournament.entryFee ? (
                  <>
                    <Text className="text-rose-500 text-center font-bold text-xs mb-4">
                      You don't have sufficient PlayCoin
                    </Text>
                    <View className="flex-row justify-between">
                      <Pressable 
                        onPress={() => setRegistrationStep(1)}
                        className="bg-slate-400 dark:bg-slate-700 rounded-xl py-3.5 flex-1 mr-2 items-center justify-center"
                      >
                        <Text className="text-white text-center font-black text-xs uppercase tracking-wider">Cancel</Text>
                      </Pressable>
                      <Pressable 
                        onPress={() => navigation.navigate('AddCoin')}
                        className="bg-[#1E1B4B] rounded-xl py-3.5 flex-1 ml-2 border border-[#312E81] items-center justify-center"
                      >
                        <Text className="text-white text-center font-black text-xs uppercase tracking-wider">Add Money</Text>
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <View className="flex-row justify-between">
                    <Pressable 
                      onPress={() => setRegistrationStep(1)}
                      className="bg-slate-400 dark:bg-slate-700 rounded-xl py-3.5 flex-1 mr-2 items-center justify-center"
                    >
                      <Text className="text-white text-center font-black text-xs uppercase tracking-wider">Cancel</Text>
                    </Pressable>
                    <Pressable 
                      onPress={handleConfirmRegistration}
                      disabled={loading}
                      className="bg-[#7C3AED] border border-[#8B5CF6] rounded-xl py-3.5 flex-1 ml-2 items-center justify-center"
                    >
                      <Text className="text-white text-center font-black text-xs uppercase tracking-wider">
                        {loading ? 'Joining...' : 'Pay & Join'}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Edit Game Username Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View 
          className="flex-1 justify-center items-center p-6"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
        >
          <View className="bg-white rounded-3xl overflow-hidden w-full max-w-[300px] shadow-2xl">
            {/* Modal Header */}
            <View className="bg-[#38BDF8] py-4 px-6 items-center">
              <Text className="text-white text-base font-black uppercase tracking-wider text-center">
                Register Your Game
              </Text>
            </View>

            {/* Modal Body */}
            <View className="p-6">
              <TextInput
                value={tempUsername}
                onChangeText={setTempUsername}
                placeholder="Game Username"
                placeholderTextColor="#94A3B8"
                className="border-b border-slate-300 py-2 text-slate-800 text-sm font-extrabold mb-3.5 w-full"
                autoFocus={true}
              />

              <Text className="text-slate-500 text-[10px] leading-relaxed mb-6 font-semibold">
                Note: Make sure you enter your Game Username (IGN) and not Character ID.
              </Text>

              {/* Action Buttons */}
              <View className="flex-row justify-between">
                <Pressable
                  onPress={() => setShowEditModal(false)}
                  className="bg-slate-450 dark:bg-slate-500 rounded-xl py-3 flex-1 mr-2 items-center justify-center"
                  style={{ backgroundColor: '#808080' }}
                >
                  <Text className="text-white text-center font-black text-xs uppercase tracking-wider">
                    Cancel
                  </Text>
                </Pressable>
                
                <Pressable
                  onPress={() => {
                    setGameUID(tempUsername);
                    setShowEditModal(false);
                  }}
                  className="bg-[#38BDF8] rounded-xl py-3 flex-1 ml-2 items-center justify-center"
                >
                  <Text className="text-white text-center font-black text-xs uppercase tracking-wider">
                    Next
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
