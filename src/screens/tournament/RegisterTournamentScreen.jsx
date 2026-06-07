import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react-native';
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

  const [registrationStep, setRegistrationStep] = useState(1); // 1 = Slot, 2 = Details Form
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Registration Form States
  const [gameUID, setGameUID] = useState(''); // standard BR/fallback Character UID
  const [teamName, setTeamName] = useState('');
  const [p1Name, setP1Name] = useState('');
  const [p1UID, setP1UID] = useState('');
  const [p1Mobile, setP1Mobile] = useState('');
  const [p2UID, setP2UID] = useState('');
  const [p3UID, setP3UID] = useState('');
  const [p4UID, setP4UID] = useState('');

  const [wallet, setWallet] = useState({ depositBalance: 0, winningBalance: 0, bonusBalance: 0, totalBalance: 0 });

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
    if (user) {
      setP1Name(user.displayName || user.username || '');
      setP1Mobile(user.phone || '');
      if (user.gameUIDs) {
        setGameUID(user.gameUIDs.freeFire || '');
        setP1UID(user.gameUIDs.freeFire || '');
      }
    }
  }, [slug, user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleConfirmRegistration = async () => {
    if (selectedSlot === null) {
      Alert.alert('Slot Required ⚠️', 'Please select a slot before registering.');
      return;
    }

    const isBR = tournament.gameMode === 'battle_royale';
    const isCS = tournament.gameMode === 'clash_squad';
    const isLW = tournament.gameMode === 'lone_wolf';
    const format = tournament.format || '1v1';

    const payload = { slotNumber: selectedSlot };

    if (isBR) {
      if (!gameUID.trim()) {
        Alert.alert('UID Required ⚠️', 'Please enter your character UID.');
        return;
      }
      payload.gameUID = gameUID;
    } else {
      // CS or LW Forms Validation
      if (format === '1v1') {
        if (!p1Name.trim() || !p1UID.trim() || !p1Mobile.trim()) {
          Alert.alert('Validation Error ⚠️', 'Player Name, Character UID, and Mobile Number are required.');
          return;
        }
        payload.p1Name = p1Name;
        payload.p1UID = p1UID;
        payload.p1Mobile = p1Mobile;
        payload.gameUID = p1UID;
      } else if (format === '2v2') {
        if (!teamName.trim() || !p1UID.trim() || !p2UID.trim()) {
          Alert.alert('Validation Error ⚠️', 'Team Name and both Player UIDs are required.');
          return;
        }
        payload.teamName = teamName;
        payload.p1UID = p1UID;
        payload.p2UID = p2UID;
        payload.gameUID = p1UID;
      } else if (format === '4v4') {
        if (!teamName.trim() || !p1UID.trim() || !p2UID.trim() || !p3UID.trim() || !p4UID.trim()) {
          Alert.alert('Validation Error ⚠️', 'Team Name and all 4 Player UIDs are required.');
          return;
        }
        payload.teamName = teamName;
        payload.p1UID = p1UID;
        payload.p2UID = p2UID;
        payload.teamMembersUIDs = [p1UID, p2UID, p3UID, p4UID];
        payload.gameUID = p1UID;
      }
    }

    setLoading(true);
    try {
      const res = await request(`/tournaments/${tournament._id}/register`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.success) {
        Alert.alert(
          'Registration Successful! 🎉', 
          `Registered successfully in Slot #${selectedSlot}!`
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
        style={{ flex: 1, justify: 'center', align: 'center' }}
      >
        <Text className="text-slate-400 text-sm font-semibold">Loading match details...</Text>
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
                ? 'bg-rose-600 border-rose-500'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Text className={`text-xs font-black ${isOccupied ? 'text-slate-400 dark:text-slate-600 line-through' : isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-300'}`}>
            {i}
          </Text>
        </Pressable>
      );
    }
    return slots;
  };

  const format = tournament.format || '1v1';

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      {/* Header */}
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
          className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800"
        >
          <ArrowLeft size={18} color={isDark ? '#FFFFFF' : '#0F172A'} />
        </Pressable>
        <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wider flex-1 text-center mr-6" numberOfLines={1}>
          {registrationStep === 1 ? 'Slot Selection' : 'Enter Registration Details'}
        </Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <View className="flex-1 px-4 pt-4" style={{ paddingBottom: insets.bottom > 0 ? insets.bottom + 4 : 8 }}>
          
          {/* Step Indicator */}
          <View className="flex-row items-center justify-center mb-4 mt-2">
            <View className={`w-8 h-8 rounded-full items-center justify-center ${registrationStep >= 1 ? 'bg-rose-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
              <Text className="text-white font-extrabold text-xs">1</Text>
            </View>
            <View className={`h-1 w-12 ${registrationStep >= 2 ? 'bg-rose-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
            <View className={`w-8 h-8 rounded-full items-center justify-center ${registrationStep >= 2 ? 'bg-rose-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
              <Text className="text-white font-extrabold text-xs">2</Text>
            </View>
          </View>

          {registrationStep === 1 ? (
            // STEP 1: Slot Grid Selection
            <View className="flex-1">
              <ScrollView 
                className="flex-1 mb-4"
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />}
              >
                <GlassCard className="p-5" glowColor="red">
                  <Text className="text-slate-900 dark:text-white text-base font-black uppercase mb-1.5 px-0.5">Select a Slot</Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-5 px-0.5">
                    Choose an open slot from the match grid. Crossed-out numbers are already registered.
                  </Text>
                  <View className="flex-row flex-wrap justify-center py-2">
                    {renderSlots()}
                  </View>
                </GlassCard>
              </ScrollView>

              <View>
                <GlassCard className="p-4 mb-4 flex-row justify-between items-center" glowColor="red">
                  <View>
                    <Text className="text-slate-400 text-[9px] font-extrabold uppercase">Selected Slot</Text>
                    <Text className="text-slate-900 dark:text-white text-sm font-black mt-0.5">
                      {selectedSlot ? `#${selectedSlot}` : 'None'}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-slate-400 text-[9px] font-extrabold uppercase">Entry Fee</Text>
                    <View className="flex-row items-center mt-0.5">
                      <GoldCoin size={12} />
                      <Text className="text-slate-900 dark:text-white text-sm font-black ml-1">
                        {tournament.entryFee === 0 ? 'FREE' : `${tournament.entryFee} Coins`}
                      </Text>
                    </View>
                  </View>
                </GlassCard>

                <Button 
                  title="Proceed to Details"
                  disabled={selectedSlot === null}
                  onPress={() => setRegistrationStep(2)}
                  className="bg-rose-600 border-rose-500"
                />
              </View>
            </View>
          ) : (
            // STEP 2: Details input dependent on Game Mode & Format
            <View className="flex-1">
              <ScrollView className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
                
                {/* Wallet Info header */}
                <View className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-5 items-center">
                  <Text className="text-slate-400 text-[9px] font-extrabold uppercase">Available Coins Balance</Text>
                  <View className="flex-row items-center mt-1">
                    <GoldCoin size={18} />
                    <Text className="text-white text-2xl font-black ml-1.5">{wallet.totalBalance.toFixed(0)}</Text>
                  </View>
                </View>

                {/* Sub Forms */}
                <GlassCard className="p-5" glowColor="red">
                  <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide mb-4">
                    Register Details Form
                  </Text>

                  {/* BR Form */}
                  {tournament.gameMode === 'battle_royale' && (
                    <Input
                      label="Game Character UID"
                      value={gameUID}
                      onChangeText={setGameUID}
                      placeholder="Enter Free Fire UID"
                    />
                  )}

                  {/* CS / LW 1v1 Form */}
                  {(tournament.gameMode === 'clash_squad' || tournament.gameMode === 'lone_wolf') && format === '1v1' && (
                    <View className="space-y-4">
                      <Input
                        label="Player Name (IGN)"
                        value={p1Name}
                        onChangeText={setP1Name}
                        placeholder="Enter Game Name"
                      />
                      <Input
                        label="Character UID"
                        value={p1UID}
                        onChangeText={setP1UID}
                        placeholder="Enter Free Fire UID"
                      />
                      <Input
                        label="Mobile Number"
                        value={p1Mobile}
                        onChangeText={setP1Mobile}
                        placeholder="Enter Contact Number"
                        keyboardType="phone-pad"
                      />
                    </View>
                  )}

                  {/* CS / LW 2v2 Form */}
                  {(tournament.gameMode === 'clash_squad' || tournament.gameMode === 'lone_wolf') && format === '2v2' && (
                    <View className="space-y-4">
                      <Input
                        label="Team Name"
                        value={teamName}
                        onChangeText={setTeamName}
                        placeholder="Enter Team Name"
                      />
                      <Input
                        label="Player 1 UID (Captain)"
                        value={p1UID}
                        onChangeText={setP1UID}
                        placeholder="Enter Captain UID"
                      />
                      <Input
                        label="Player 2 UID"
                        value={p2UID}
                        onChangeText={setP2UID}
                        placeholder="Enter Partner UID"
                      />
                    </View>
                  )}

                  {/* CS 4v4 Form */}
                  {tournament.gameMode === 'clash_squad' && format === '4v4' && (
                    <View className="space-y-4">
                      <Input
                        label="Team Name"
                        value={teamName}
                        onChangeText={setTeamName}
                        placeholder="Enter Team Name"
                      />
                      <Input
                        label="Player 1 UID (Captain)"
                        value={p1UID}
                        onChangeText={setP1UID}
                        placeholder="Enter Captain UID"
                      />
                      <Input
                        label="Player 2 UID"
                        value={p2UID}
                        onChangeText={setP2UID}
                        placeholder="Enter Player 2 UID"
                      />
                      <Input
                        label="Player 3 UID"
                        value={p3UID}
                        onChangeText={setP3UID}
                        placeholder="Enter Player 3 UID"
                      />
                      <Input
                        label="Player 4 UID"
                        value={p4UID}
                        onChangeText={setP4UID}
                        placeholder="Enter Player 4 UID"
                      />
                    </View>
                  )}
                </GlassCard>
              </ScrollView>

              {/* Action Buttons */}
              <View className="p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60">
                <View className="flex-row items-center justify-center mb-3">
                  <Text className="text-slate-800 dark:text-slate-200 font-extrabold text-xs">Payable Entry Cost: </Text>
                  <GoldCoin size={12} />
                  <Text className="text-slate-950 dark:text-white font-black text-xs ml-0.5">{tournament.entryFee} Coins</Text>
                </View>

                {wallet.totalBalance < tournament.entryFee ? (
                  <>
                    <Text className="text-red-500 text-center font-bold text-xs mb-3">Insufficient Coins balance.</Text>
                    <View className="flex-row" style={{ gap: 10 }}>
                      <Pressable 
                        onPress={() => setRegistrationStep(1)}
                        className="bg-slate-500 rounded-xl py-3 flex-1 items-center"
                      >
                        <Text className="text-white font-black text-xs">Back</Text>
                      </Pressable>
                      <Pressable 
                        onPress={() => navigation.navigate('AddCoin')}
                        className="bg-rose-600 rounded-xl py-3 flex-1 items-center border border-rose-500"
                      >
                        <Text className="text-white font-black text-xs">Add Money</Text>
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <View className="flex-row" style={{ gap: 10 }}>
                    <Pressable 
                      onPress={() => setRegistrationStep(1)}
                      className="bg-slate-500 rounded-xl py-3.5 flex-1 items-center"
                    >
                      <Text className="text-white font-black text-xs uppercase">Back</Text>
                    </Pressable>
                    <Pressable 
                      onPress={handleConfirmRegistration}
                      disabled={loading}
                      className="bg-rose-600 border border-rose-500 rounded-xl py-3.5 flex-1 items-center"
                    >
                      <Text className="text-white font-black text-xs uppercase">
                        {loading ? 'Processing...' : 'Pay & Register'}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          )}

        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
