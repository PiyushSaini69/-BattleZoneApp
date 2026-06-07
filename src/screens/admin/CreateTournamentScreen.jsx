import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, Alert, KeyboardAvoidingView, Platform, useColorScheme as useRNColorScheme, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

export default function CreateTournamentScreen({ navigation }) {
  const { colorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const isDark = colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  
  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const year = tomorrow.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // State parameters
  const [title, setTitle] = useState('');
  const [gameMode, setGameMode] = useState('battle_royale'); // battle_royale, clash_squad, lone_wolf
  const [autoGen, setAutoGen] = useState(true);

  // BR dependent states
  const [brType, setBrType] = useState('solo'); // solo, duo, squad
  const [brMap, setBrMap] = useState('Bermuda'); // Bermuda, Bermuda Remastered, Kalahari, Purgatory, Alpine, Nexterra
  const [br1stPrize, setBr1stPrize] = useState('500');
  const [br2ndPrize, setBr2ndPrize] = useState('300');
  const [br3rdPrize, setBr3rdPrize] = useState('200');
  const [brPerKill, setBrPerKill] = useState('10');

  // CS states
  const [csFormat, setCsFormat] = useState('4v4'); // 1v1, 2v2, 4v4
  const [csMode, setCsMode] = useState('normal'); // normal, headshot, onetap

  // LW states
  const [lwFormat, setLwFormat] = useState('1v1'); // 1v1, 2v2
  const [lwMode, setLwMode] = useState('normal'); // normal, headshot, onetap

  // CS/LW winner prize
  const [cslwWinnerPrize, setCslwWinnerPrize] = useState('1000');

  // Shared states
  const [entryFee, setEntryFee] = useState('20');
  const [totalSlots, setTotalSlots] = useState('48');
  const [date, setDate] = useState(getTomorrowDateString());
  const [time, setTime] = useState('06:00');
  const [isPm, setIsPm] = useState(true);

  const [description, setDescription] = useState('');
  const [rulesText, setRulesText] = useState('');
  const [bannerMapping, setBannerMapping] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Rules and Banner Auto Generator
  const getAutoData = (mode, format, type, ruleMode, map) => {
    let titleStr = '';
    let descStr = '';
    let rulesList = [];
    let bannerFile = '';

    if (mode === 'battle_royale') {
      const typeLabel = type ? type.toUpperCase() : 'SOLO';
      const mapLabel = map || 'Bermuda';
      titleStr = `Free Fire BR ${typeLabel} - ${mapLabel} Battle`;
      descStr = `Join the battlefield of Free Fire BR in ${typeLabel} format on map ${mapLabel}. Survive till the end, eliminate opponents, and claim the ultimate BOOYAH!`;
      rulesList = [
        "No cheating, teaming, or third-party tool usage. Violations result in suspensions.",
        "Join the room at least 10 minutes before the scheduled start time.",
        "Prizes will be credited automatically to top 3 ranks. Per-kill reward is active.",
        "Ensure your gaming UID matches your registration details exactly."
      ];
      bannerFile = `br-${type || 'solo'}.jpg`;
    } else if (mode === 'clash_squad') {
      const fmtLabel = format || '4v4';
      const ruleLabel = ruleMode === 'headshot' ? 'Only Headshot' : ruleMode === 'onetap' ? 'One Tap' : 'Normal';
      titleStr = `Clash Squad ${fmtLabel} [${ruleLabel}] Arena`;
      descStr = `Face off in a fast-paced Clash Squad ${fmtLabel} match under ${ruleLabel} game settings. Coordinate with your team to progress through brackets.`;
      rulesList = [
        "Matches run under Clash Squad single-elimination formats.",
        "Grenades or specific guns may be restricted by match moderators.",
        "Automated brackets govern advancement. One winner will be declared.",
        "In Headshot-Only mode, only headshot kills will count."
      ];
      const bannerRule = ruleMode === 'headshot' ? 'headshot' : ruleMode === 'onetap' ? 'onetap' : 'normal';
      bannerFile = `cs-${fmtLabel}-${bannerRule}.jpg`;
    } else if (mode === 'lone_wolf') {
      const fmtLabel = format || '1v1';
      const ruleLabel = ruleMode === 'headshot' ? 'Only Headshot' : ruleMode === 'onetap' ? 'One Tap' : 'Normal';
      titleStr = `Lone Wolf ${fmtLabel} [${ruleLabel}] Duel`;
      descStr = `The ultimate Lone Wolf duel in the Iron Cage. Face your opponent in a test of pure gun skill and movement to claim bracket victory.`;
      rulesList = [
        "Lone Wolf format rules inside the Iron Cage map.",
        "Single-elimination brackets. Lose one match and you're eliminated.",
        "Delaying rounds or toxic behaviors result in direct match forfeits.",
        "Stable internet is mandatory. Rematches will not be hosted."
      ];
      const bannerRule = ruleMode === 'headshot' ? 'headshot' : ruleMode === 'onetap' ? 'onetap' : 'normal';
      bannerFile = `lw-${fmtLabel}-${bannerRule}.jpg`;
    }

    return { title: titleStr, description: descStr, rules: rulesList.join('\n'), banner: bannerFile };
  };

  // Run auto-generator when dependencies change
  useEffect(() => {
    if (!autoGen) return;
    const format = gameMode === 'clash_squad' ? csFormat : gameMode === 'lone_wolf' ? lwFormat : '';
    const type = gameMode === 'battle_royale' ? brType : '';
    const ruleMode = gameMode === 'clash_squad' ? csMode : gameMode === 'lone_wolf' ? lwMode : '';
    
    const data = getAutoData(gameMode, format, type, ruleMode, brMap);
    setTitle(data.title);
    setDescription(data.description);
    setRulesText(data.rules);
    setBannerMapping(data.banner);
  }, [gameMode, brType, brMap, csFormat, csMode, lwFormat, lwMode, autoGen]);

  const handleCreate = async () => {
    setError('');
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    setLoading(true);
    try {
      // Parse date: DD-MM-YYYY
      const dateParts = date.trim().split('-');
      if (dateParts.length !== 3) {
        throw new Error('Date format must be DD-MM-YYYY (e.g., 15-06-2026)');
      }
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const year = parseInt(dateParts[2], 10);

      // Parse time: HH:MM
      const timeParts = time.trim().split(':');
      if (timeParts.length !== 2) {
        throw new Error('Time format must be HH:MM (e.g., 06:30)');
      }
      let hour = parseInt(timeParts[0], 10);
      const minute = parseInt(timeParts[1], 10);

      if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hour) || isNaN(minute)) {
        throw new Error('Date or Time contains invalid numbers.');
      }

      if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
        throw new Error('Please enter a valid time (1-12 for hours, 0-59 for minutes).');
      }

      let parsedHour = hour;
      if (isPm && hour < 12) parsedHour += 12;
      if (!isPm && hour === 12) parsedHour = 0;

      const scheduledAt = new Date(year, month, day, parsedHour, minute);
      if (isNaN(scheduledAt.getTime())) {
        throw new Error('Invalid date or time values.');
      }

      if (scheduledAt.getTime() < Date.now()) {
        throw new Error('Tournament schedule date/time must be in the future.');
      }

      const rulesArr = rulesText.split('\n').filter(r => r.trim() !== '');

      const payload = {
        title,
        game: 'free_fire',
        gameMode,
        entryFee: parseFloat(entryFee),
        totalSlots: parseInt(totalSlots, 10),
        scheduledAt,
        description,
        rules: rulesArr,
        bannerImage: bannerMapping,
        registrationOpenAt: new Date(),
        registrationCloseAt: new Date(scheduledAt.getTime() - 30 * 60 * 1000)
      };

      if (gameMode === 'battle_royale') {
        payload.tournamentType = brType;
        payload.mapType = brMap;
        payload.perKillReward = parseFloat(brPerKill);
        payload.firstPrize = parseFloat(br1stPrize);
        payload.secondPrize = parseFloat(br2ndPrize);
        payload.thirdPrize = parseFloat(br3rdPrize);
        payload.prizePool = parseFloat(br1stPrize) + parseFloat(br2ndPrize) + parseFloat(br3rdPrize);
        payload.prizeDistribution = [
          { rank: 1, amount: parseFloat(br1stPrize) },
          { rank: 2, amount: parseFloat(br2ndPrize) },
          { rank: 3, amount: parseFloat(br3rdPrize) }
        ];
      } else if (gameMode === 'clash_squad') {
        payload.format = csFormat;
        payload.mode = csMode;
        payload.winnerPrize = parseFloat(cslwWinnerPrize);
        payload.prizePool = parseFloat(cslwWinnerPrize);
        payload.prizeDistribution = [{ rank: 1, amount: parseFloat(cslwWinnerPrize) }];
      } else if (gameMode === 'lone_wolf') {
        payload.format = lwFormat;
        payload.mode = lwMode;
        payload.winnerPrize = parseFloat(cslwWinnerPrize);
        payload.prizePool = parseFloat(cslwWinnerPrize);
        payload.prizeDistribution = [{ rank: 1, amount: parseFloat(cslwWinnerPrize) }];
      }

      const res = await request('/admin/tournaments', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.success) {
        Alert.alert('Success 🎉', 'Tournament catalog created as DRAFT successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      {/* Header */}
      <View 
        className="bg-slate-100/60 dark:bg-slate-950/40 p-4 border-b border-slate-200 dark:border-slate-900/60 flex-row items-center justify-between"
        style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 16 }}
      >
        <Pressable onPress={() => navigation.goBack()} className="p-1">
          <ArrowLeft size={20} color={isDark ? '#fff' : '#0f172a'} />
        </Pressable>
        <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide">Create Tournament</Text>
        <View className="w-6" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          <GlassCard className="p-5 mb-6" glowColor="red">
            {error !== '' && (
              <View 
                className="border rounded-xl p-3.5 mb-4"
                style={{
                  backgroundColor: 'rgba(244, 63, 94, 0.08)',
                  borderColor: 'rgba(244, 63, 94, 0.35)'
                }}
              >
                <Text className="text-rose-600 dark:text-rose-400 text-xs font-bold text-center">{error}</Text>
              </View>
            )}

            {/* Game Mode Selector */}
            <View className="mb-5 px-0.5">
              <Text className="text-slate-500 dark:text-slate-400 text-xs font-extrabold mb-2 uppercase tracking-wide">Game Mode</Text>
              <View className="flex-row justify-between bg-slate-200/60 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-900 rounded-xl p-1">
                {[
                  { id: 'battle_royale', label: 'Battle Royale' },
                  { id: 'clash_squad', label: 'Clash Squad' },
                  { id: 'lone_wolf', label: 'Lone Wolf' }
                ].map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => setGameMode(item.id)}
                    className={`flex-1 py-2 rounded-lg items-center ${
                      gameMode === item.id ? (isDark ? 'bg-slate-800' : 'bg-white') : ''
                    }`}
                  >
                    <Text className={`text-[8px] font-extrabold uppercase tracking-wider text-center ${
                      gameMode === item.id ? 'text-rose-500 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Auto Generator Toggle */}
            <View className="mb-5 flex-row items-center justify-between px-0.5">
              <Text className="text-slate-500 dark:text-slate-400 text-xs font-extrabold uppercase tracking-wide">Auto Pre-Fill Lobbies</Text>
              <Pressable
                onPress={() => setAutoGen(!autoGen)}
                className={`px-3 py-1.5 border rounded-lg ${autoGen ? 'bg-rose-500/10 border-rose-500' : 'bg-transparent border-slate-700'}`}
              >
                <Text className={`text-[9px] font-black uppercase ${autoGen ? 'text-rose-500' : 'text-slate-400'}`}>
                  {autoGen ? 'Enabled' : 'Disabled'}
                </Text>
              </Pressable>
            </View>

            {/* GAME MODE DEPENDENT PARAMETERS SUB-FORMS */}
            {gameMode === 'battle_royale' && (
              <View className="mb-4 p-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/5 space-y-4">
                <Text className="text-rose-500 dark:text-rose-400 text-xs font-extrabold uppercase tracking-wider mb-2">Battle Royale Form</Text>
                
                {/* Match Type */}
                <View className="mb-3">
                  <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold mb-1.5 uppercase">Match Type</Text>
                  <View className="flex-row justify-between bg-slate-100/50 dark:bg-slate-950/40 p-1 border border-slate-300 dark:border-slate-900 rounded-lg">
                    {['solo', 'duo', 'squad'].map((t) => (
                      <Pressable
                        key={t}
                        onPress={() => {
                          setBrType(t);
                          if (t === 'solo') setTotalSlots('48');
                          else if (t === 'duo') setTotalSlots('24');
                          else if (t === 'squad') setTotalSlots('12');
                        }}
                        className={`flex-1 py-1.5 rounded-lg items-center ${brType === t ? (isDark ? 'bg-slate-800' : 'bg-white') : ''}`}
                      >
                        <Text className={`text-[9px] font-extrabold uppercase ${brType === t ? 'text-rose-500' : 'text-slate-500'}`}>
                          {t}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Map Type */}
                <View className="mb-3">
                  <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold mb-1.5 uppercase">Map Type</Text>
                  <View className="flex-row flex-wrap gap-1.5">
                    {['Bermuda', 'Bermuda Remastered', 'Kalahari', 'Purgatory', 'Alpine', 'Nexterra'].map((m) => (
                      <Pressable
                        key={m}
                        onPress={() => setBrMap(m)}
                        className={`px-3 py-1.5 border rounded-lg ${brMap === m ? 'border-rose-500 bg-rose-500/5' : 'border-slate-300 dark:border-slate-800'}`}
                      >
                        <Text className={`text-[8px] font-bold ${brMap === m ? 'text-rose-500' : 'text-slate-400'}`}>{m}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <Input
                  label="Per Kill Reward (₹)"
                  value={brPerKill}
                  onChangeText={setBrPerKill}
                  keyboardType="numeric"
                />

                <View className="flex-row space-x-2" style={{ gap: 8 }}>
                  <View className="flex-1">
                    <Input
                      label="1st Prize (₹)"
                      value={br1stPrize}
                      onChangeText={setBr1stPrize}
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1">
                    <Input
                      label="2nd Prize (₹)"
                      value={br2ndPrize}
                      onChangeText={setBr2ndPrize}
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1">
                    <Input
                      label="3rd Prize (₹)"
                      value={br3rdPrize}
                      onChangeText={setBr3rdPrize}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            )}

            {gameMode === 'clash_squad' && (
              <View className="mb-4 p-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/5 space-y-4">
                <Text className="text-rose-500 dark:text-rose-400 text-xs font-extrabold uppercase tracking-wider mb-2">Clash Squad Form</Text>
                
                <View className="grid grid-cols-2 gap-2 flex-row" style={{ gap: 8 }}>
                  <View className="flex-1">
                    <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold mb-1.5 uppercase">Format</Text>
                    <View className="flex-row bg-slate-100/50 dark:bg-slate-950/40 p-1 border border-slate-300 dark:border-slate-900 rounded-lg">
                      {['1v1', '2v2', '4v4'].map((f) => (
                        <Pressable
                          key={f}
                          onPress={() => {
                            setCsFormat(f);
                            if (f === '1v1') setTotalSlots('2');
                            else if (f === '2v2') setTotalSlots('4');
                            else if (f === '4v4') setTotalSlots('8');
                          }}
                          className={`flex-1 py-1.5 rounded-lg items-center ${csFormat === f ? (isDark ? 'bg-slate-800' : 'bg-white') : ''}`}
                        >
                          <Text className={`text-[9px] font-extrabold uppercase ${csFormat === f ? 'text-rose-500' : 'text-slate-500'}`}>
                            {f}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold mb-1.5 uppercase">Rule Mode</Text>
                    <View className="flex-row bg-slate-100/50 dark:bg-slate-950/40 p-1 border border-slate-300 dark:border-slate-900 rounded-lg">
                      {['normal', 'headshot', 'onetap'].map((m) => (
                        <Pressable
                          key={m}
                          onPress={() => setCsMode(m)}
                          className={`flex-1 py-1.5 rounded-lg items-center ${csMode === m ? (isDark ? 'bg-slate-800' : 'bg-white') : ''}`}
                        >
                          <Text className={`text-[8px] font-extrabold uppercase ${csMode === m ? 'text-rose-500' : 'text-slate-500'}`}>
                            {m === 'headshot' ? 'HS' : m === 'onetap' ? 'Tap' : 'Norm'}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>

                <Input
                  label="Winner Prize (₹)"
                  value={cslwWinnerPrize}
                  onChangeText={setCslwWinnerPrize}
                  keyboardType="numeric"
                />

                <View className="mb-2">
                  <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold mb-1 uppercase">Bracket Size (Teams)</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {['2', '4', '8', '16'].map((sz) => (
                      <Pressable
                        key={sz}
                        onPress={() => setTotalSlots(sz)}
                        className={`px-3 py-1.5 border rounded-lg ${totalSlots === sz ? 'border-rose-500 bg-rose-500/5' : 'border-slate-300 dark:border-slate-800'}`}
                      >
                        <Text className={`text-[9px] font-bold ${totalSlots === sz ? 'text-rose-500' : 'text-slate-400'}`}>
                          {sz} Teams
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {gameMode === 'lone_wolf' && (
              <View className="mb-4 p-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/5 space-y-4">
                <Text className="text-rose-500 dark:text-rose-400 text-xs font-extrabold uppercase tracking-wider mb-2">Lone Wolf Form</Text>
                
                <View className="grid grid-cols-2 gap-2 flex-row" style={{ gap: 8 }}>
                  <View className="flex-1">
                    <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold mb-1.5 uppercase">Format</Text>
                    <View className="flex-row bg-slate-100/50 dark:bg-slate-950/40 p-1 border border-slate-300 dark:border-slate-900 rounded-lg">
                      {['1v1', '2v2'].map((f) => (
                        <Pressable
                          key={f}
                          onPress={() => {
                            setLwFormat(f);
                            if (f === '1v1') setTotalSlots('2');
                            else if (f === '2v2') setTotalSlots('4');
                          }}
                          className={`flex-1 py-1.5 rounded-lg items-center ${lwFormat === f ? (isDark ? 'bg-slate-800' : 'bg-white') : ''}`}
                        >
                          <Text className={`text-[9px] font-extrabold uppercase ${lwFormat === f ? 'text-rose-500' : 'text-slate-500'}`}>
                            {f}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold mb-1.5 uppercase">Rule Mode</Text>
                    <View className="flex-row bg-slate-100/50 dark:bg-slate-950/40 p-1 border border-slate-300 dark:border-slate-900 rounded-lg">
                      {['normal', 'headshot', 'onetap'].map((m) => (
                        <Pressable
                          key={m}
                          onPress={() => setLwMode(m)}
                          className={`flex-1 py-1.5 rounded-lg items-center ${lwMode === m ? (isDark ? 'bg-slate-800' : 'bg-white') : ''}`}
                        >
                          <Text className={`text-[8px] font-extrabold uppercase ${lwMode === m ? 'text-rose-500' : 'text-slate-500'}`}>
                            {m === 'headshot' ? 'HS' : m === 'onetap' ? 'Tap' : 'Norm'}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>

                <Input
                  label="Winner Prize (₹)"
                  value={cslwWinnerPrize}
                  onChangeText={setCslwWinnerPrize}
                  keyboardType="numeric"
                />

                <View className="mb-2">
                  <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold mb-1 uppercase">Bracket Size (Players)</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {['2', '4', '8', '16'].map((sz) => (
                      <Pressable
                        key={sz}
                        onPress={() => setTotalSlots(sz)}
                        className={`px-3 py-1.5 border rounded-lg ${totalSlots === sz ? 'border-rose-500 bg-rose-500/5' : 'border-slate-300 dark:border-slate-800'}`}
                      >
                        <Text className={`text-[9px] font-bold ${totalSlots === sz ? 'text-rose-500' : 'text-slate-400'}`}>
                          {sz} Players
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* General form settings */}
            <View className="flex-row justify-between mb-4" style={{ gap: 12 }}>
              <View className="flex-1">
                <Input
                  label="Date (DD-MM-YYYY)"
                  value={date}
                  onChangeText={setDate}
                  placeholder="15-06-2026"
                  keyboardType="numeric"
                  className="mb-0"
                />
              </View>
              <View className="flex-1">
                <Text 
                  className="text-xs font-bold uppercase tracking-widest mb-2 ml-0.5 text-slate-500 dark:text-slate-400"
                >
                  Time (HH:MM)
                </Text>
                <View className="flex-row items-center">
                  <View className="flex-1 mr-2">
                    <Input
                      value={time}
                      onChangeText={setTime}
                      placeholder="06:00"
                      keyboardType="numeric"
                      className="mb-0"
                    />
                  </View>
                  <Pressable
                    onPress={() => setIsPm(!isPm)}
                    className="rounded-xl justify-center items-center border"
                    style={[
                      {
                        height: 50,
                        width: 52,
                        backgroundColor: isDark 
                          ? (isPm ? '#EF4444' : '#0A0E1A') 
                          : (isPm ? '#E11D48' : '#F1F5F9'),
                        borderColor: isPm
                          ? (isDark ? '#EF4444' : '#E11D48')
                          : (isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'),
                        borderWidth: 1.5,
                      }
                    ]}
                  >
                    <Text className={`text-xs font-black uppercase tracking-wider ${isPm ? 'text-white' : 'text-slate-500'}`}>
                      {isPm ? 'PM' : 'AM'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <Input
              label="Entry Fee (₹)"
              value={entryFee}
              onChangeText={setEntryFee}
              placeholder="20"
              keyboardType="number-pad"
            />

            <Input
              label="Total Available Slots"
              value={totalSlots}
              onChangeText={setTotalSlots}
              placeholder="48"
              keyboardType="number-pad"
            />

            {/* Editable autogenerated title and mapping */}
            <Input
              label="Tournament Title"
              value={title}
              onChangeText={(t) => {
                setAutoGen(false);
                setTitle(t);
              }}
              placeholder="E.g., Custom Match Title"
            />

            <View className="mb-4">
              <Text className="text-slate-500 dark:text-slate-400 text-xs font-extrabold mb-1.5 uppercase ml-0.5">Mapped Banner Graphic Name</Text>
              <TextInput
                value={bannerMapping}
                editable={false}
                className="p-3 border rounded-xl bg-slate-200/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-800 text-slate-400 font-mono text-xs"
              />
            </View>

            <View className="mb-4">
              <Text className="text-slate-500 dark:text-slate-400 text-xs font-extrabold mb-1.5 uppercase ml-0.5">Match Description</Text>
              <TextInput
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={(t) => {
                  setAutoGen(false);
                  setDescription(t);
                }}
                className="p-3 border rounded-xl bg-transparent border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs text-left"
                style={{ minHeight: 60, textAlignVertical: 'top' }}
              />
            </View>

            <View className="mb-4">
              <Text className="text-slate-500 dark:text-slate-400 text-xs font-extrabold mb-1.5 uppercase ml-0.5">Match Rules</Text>
              <TextInput
                multiline
                numberOfLines={5}
                value={rulesText}
                onChangeText={(t) => {
                  setAutoGen(false);
                  setRulesText(t);
                }}
                className="p-3 border rounded-xl bg-transparent border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs text-left font-mono"
                style={{ minHeight: 90, textAlignVertical: 'top' }}
              />
            </View>

            <Button
              title="Create Tournament Draft"
              onPress={handleCreate}
              loading={loading}
              className="mt-4 bg-rose-600 border border-rose-500"
            />
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
