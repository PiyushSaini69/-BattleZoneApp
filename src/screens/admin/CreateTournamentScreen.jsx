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
  
  const getCurrentDateString = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getCurrentTimeDetails = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const isPmVal = hours >= 12;
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = String(hours).padStart(2, '0');
    return { timeStr: `${hoursStr}:${minutes}`, isPmVal };
  };

  const curTime = getCurrentTimeDetails();

  // State parameters
  const [title, setTitle] = useState('');
  const [gameMode, setGameMode] = useState('battle_royale'); // battle_royale, clash_squad, lone_wolf
  const [autoGen, setAutoGen] = useState(true);

  // BR dependent states
  const [brType, setBrType] = useState('solo'); // solo, duo, squad
  const [brMap, setBrMap] = useState('Bermuda'); // Bermuda, Bermuda Remastered, Kalahari, Purgatory, Alpine, Nexterra
  const [br1stPrize, setBr1stPrize] = useState('0');
  const [br2ndPrize, setBr2ndPrize] = useState('0');
  const [br3rdPrize, setBr3rdPrize] = useState('0');
  const [brPerKill, setBrPerKill] = useState('0');

  // CS states
  const [csFormat, setCsFormat] = useState('4v4'); // 1v1, 2v2, 4v4
  const [csMode, setCsMode] = useState('normal'); // normal, headshot, onetap

  // LW states
  const [lwFormat, setLwFormat] = useState('1v1'); // 1v1, 2v2
  const [lwMode, setLwMode] = useState('normal'); // normal, headshot, onetap

  // CS/LW winner prize
  const [cslwWinnerPrize, setCslwWinnerPrize] = useState('0');

  // Shared states
  const [entryFee, setEntryFee] = useState('0');
  const [totalSlots, setTotalSlots] = useState('0');
  const [date, setDate] = useState(getCurrentDateString());
  const [time, setTime] = useState(curTime.timeStr);
  const [isPm, setIsPm] = useState(curTime.isPmVal);

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

      if (type === 'duo') {
        descStr = "* Room ID & Password will be shared 10–15 minutes before the match starts ⏳\n" +
                  "* All match details, updates & announcements will be provided only in the Battle Zone app 📲\n" +
                  "* Players must join on time, late entry may not be allowed ⚠️\n" +
                  "* Stable internet connection is required before starting the match 🌐\n" +
                  "* 🏁 Match result will be updated within 30 minutes after match completion";
        rulesList = [
          "* ❌ No Aim Bot, Hacks, Scripts or any unfair tools allowed",
          "* ❌ PC players are strictly not allowed in any match",
          "* 📱 Only Smartphone & Tablet users are eligible to participate",
          "* 🎯 Only players with Level 40+ are allowed to participate",
          "* 🔄 Players are not allowed to use revive machines",
          "* 🚫 Players are not allowed to use reviving points",
          "* 🎯 Headshot rate should not exceed 70%",
          "* 🚫 If any player is found using hacks or cheats, their payment will be cancelled without warning",
          "* ⚖️ Decision of Battle Zone management will be final in all cases",
          "",
          "💡 FAIR PLAY NOTICE:",
          "We believe in pure skill-based competition only ⚔️",
          "Play fair, respect rules and enjoy the game 🏆"
        ];
      } else if (type === 'squad') {
        descStr = "* Room ID & Password will be shared 10–15 minutes before the match starts ⏳\n" +
                  "* All match details, updates & announcements will be provided only in the Battle Zone app 📲\n" +
                  "* Squad leaders are responsible for their team entry ⚠️\n" +
                  "* Players must join on time, late entry may not be allowed 🌐\n" +
                  "* Stable internet connection is required before starting the match 📶\n" +
                  "* 🏁 Match result will be updated within 30 minutes after match completion";
        rulesList = [
          "* ❌ No Aim Bot, Hacks, Scripts or any unfair tools allowed",
          "* ❌ PC players are strictly not allowed in any match",
          "* 📱 Only Smartphone & Tablet users are eligible to participate",
          "* 🎯 Only players with Level 40+ are allowed to participate",
          "* 🔄 Players are not allowed to use revive machines",
          "* 🚫 Players are not allowed to use reviving points",
          "* 🎯 Headshot rate should not exceed 70%",
          "* 🚫 If any player is found using hacks or cheats, the entire squad payment will be cancelled without warning",
          "* ⚖️ Decision of Battle Zone management will be final in all cases",
          "",
          "💡 FAIR PLAY NOTICE:",
          "We believe in pure skill-based squad competition only ⚔️",
          "Play fair, respect rules and enjoy the game 🏆"
        ];
      } else {
        // solo
        descStr = "* Room ID & Password will be shared 10–15 minutes before the match starts ⏳\n" +
                  "* All match details, updates & announcements will be provided only in the Battle Zone app 📲\n" +
                  "* Players must join on time, late entry may not be allowed ⚠️\n" +
                  "* Stable internet connection is required before starting the match 🌐\n" +
                  "* 🏁 Match result will be updated within 30 minutes after match completion";
        rulesList = [
          "* ❌ No Aim Bot, Hacks, Scripts or any unfair tools allowed",
          "* ❌ PC players are strictly not allowed in any match",
          "* 📱 Only Smartphone & Tablet users are eligible to participate",
          "* 🎯 Only players with Level 40+ are allowed to participate",
          "* 🎯 Headshot rate should not exceed 70%",
          "* 🚫 In SOLO mode, Dimetri (Dimitri) character is not allowed to use",
          "* 🚫 If any player is found using hacks or cheats, their payment will be cancelled without warning",
          "* ⚖️ Decision of Battle Zone management will be final in all cases",
          "",
          "💡 FAIR PLAY NOTICE:",
          "We believe in pure skill-based competition only ⚔️",
          "Play fair, respect rules and enjoy the game 🏆"
        ];
      }
      bannerFile = `br-${type || 'solo'}.jpg`;
    } else if (mode === 'clash_squad') {
      const fmtLabel = format || '4v4';
      const ruleLabel = ruleMode === 'headshot' ? 'Only Headshot' : ruleMode === 'onetap' ? 'One Tap' : 'Normal';
      titleStr = `Clash Squad ${fmtLabel} [${ruleLabel}] Arena`;

      const isSpecial = ruleMode === 'headshot' || ruleMode === 'onetap';
      const isOneTap = ruleMode === 'onetap';

      if (isSpecial) {
        descStr = "* Room ID & Password will be shared 10–15 minutes before the match starts ⏳\n" +
                  "* All match details, updates & announcements will be provided only in the Battle Zone app 📲\n" +
                  "* Players must join on time, late entry will not be allowed ⚠️\n" +
                  "* A stable internet connection is required before starting the match 🌐\n" +
                  "* 🏁 Match results will be updated within 30 minutes after match completion";

        const matchTypeLine = isOneTap ? "* 🎯 This is a One Tap Match" : "* 🎯 This is an Only Headshot Match";

        rulesList = [
          "* ❌ No Aim Bot, Hacks, Scripts, or any unfair tools allowed",
          "* ❌ PC players are strictly not allowed in any match",
          "* 📱 Only Smartphone & Tablet users are eligible to participate",
          "* 🎯 Only players with Level 40+ are allowed to participate",
          matchTypeLine,
        ];

        if (fmtLabel === '1v1') {
          rulesList.push("* 🚫 Character skills will be OFF");
          rulesList.push("* 🚫 Loadout system will be OFF");
        } else {
          rulesList.push("* 🚫 Loadout system will be OFF");
          rulesList.push("* 🚫 Character skills will be ON");
        }

        rulesList.push("* 🚫 Any player found using hacks or cheats will be disqualified and no payment will be given");
        rulesList.push("* ⚖️ The decision of Battle Zone management will be final in all cases");
        rulesList.push("");
        rulesList.push("💡 FAIR PLAY NOTICE:");
        if (fmtLabel === '1v1') {
          rulesList.push(`This is a pure skill-based 1 vs 1 ${isOneTap ? 'onetap' : 'headshot'} competition ⚔️`);
        } else if (fmtLabel === '2v2') {
          rulesList.push(`This is a pure skill-based 2 vs 2 ${isOneTap ? 'onetap' : 'headshot'} competition ⚔️`);
        } else {
          rulesList.push(`This is a pure skill-based 4 vs 4 ${isOneTap ? 'onetap' : 'headshot'} competition ⚔️`);
        }
        rulesList.push("Respect the rules and enjoy fair gaming 🏆");

      } else {
        // Clash Squad normal
        if (fmtLabel === '4v4') {
          descStr = "* Room ID & Password will be shared 10–15 minutes before the match starts ⏳\n" +
                    "* All match details, updates & announcements will be provided only in the Battle Zone app 📲\n" +
                    "* Squad leaders are responsible for their team entry ⚠️\n" +
                    "* Players must join on time, late entry will not be allowed 🌐\n" +
                    "* Stable internet connection is required before starting the match 📶\n" +
                    "* 🏁 Match result will be updated within 30 minutes after match completion";
        } else {
          descStr = "* Room ID & Password will be shared 10–15 minutes before the match starts ⏳\n" +
                    "* All match details, updates & announcements will be provided only in the Battle Zone app 📲\n" +
                    "* Players must join on time, late entry will not be allowed ⚠️\n" +
                    "* Stable internet connection is required before starting the match 🌐\n" +
                    "* 🏁 Match result will be updated within 30 minutes after match completion";
        }

        rulesList = [
          "* ❌ No Aim Bot, Hacks, Scripts or any unfair tools allowed",
          "* ❌ PC players are strictly not allowed in any match",
          "* 📱 Only Smartphone & Tablet users are eligible to participate",
          "* 🎯 Only players with Level 40+ are allowed to participate",
          "* 🚫 Any player found using hacks or cheats will be disqualified and no payment will be given",
          "* ⚖️ Decision of Battle Zone management will be final in all cases",
          "",
          "💡 FAIR PLAY NOTICE:",
          `This is a pure skill-based ${fmtLabel === '4v4' ? '4 vs 4' : fmtLabel === '2v2' ? '2 vs 2' : '1v1'} competition ⚔️`,
          "Respect rules and enjoy fair gaming 🏆"
        ];
      }

      const bannerRule = ruleMode === 'headshot' ? 'headshot' : ruleMode === 'onetap' ? 'onetap' : 'normal';
      bannerFile = `cs-${fmtLabel}-${bannerRule}.jpg`;
    } else if (mode === 'lone_wolf') {
      const fmtLabel = format || '1v1';
      const ruleLabel = ruleMode === 'headshot' ? 'Only Headshot' : ruleMode === 'onetap' ? 'One Tap' : 'Normal';
      titleStr = `Lone Wolf ${fmtLabel} [${ruleLabel}] Duel`;
      descStr = "* Room ID & Password will be shared 10–15 minutes before the match starts ⏳\n" +
                "* All match details, updates & announcements will be provided only in the Battle Zone app 📲\n" +
                "* Players must join on time, late entry will not be allowed ⚠️\n" +
                "* A stable internet connection is required before starting the match 🌐\n" +
                "* 🏁 Match results will be updated within 30 minutes after match completion";
      rulesList = [
        "* ❌ No Aim Bot, Hacks, Scripts, or any unfair tools allowed",
        "* ❌ PC players are strictly not allowed in any match",
        "* 📱 Only Smartphone & Tablet users are eligible to participate",
        "* 🎯 Only players with Level 40+ are allowed to participate"
      ];
      
      if (ruleMode === 'headshot') {
        rulesList.push("* 🎯 This is an Only Headshot Match");
        rulesList.push("* 🚫 Loadout system will be OFF");
      } else if (ruleMode === 'onetap') {
        rulesList.push("* 🎯 This is a One Tap Match");
        rulesList.push("* 🚫 Loadout system will be OFF");
      }
      
      rulesList.push("* 🚫 Character skills will be ON");
      rulesList.push("* 🚫 Any player found using hacks or cheats will be disqualified and no payment will be given");
      rulesList.push("* ⚖️ The decision of Battle Zone management will be final in all cases");
      rulesList.push("");
      rulesList.push("💡 FAIR PLAY NOTICE:");
      rulesList.push(`This is a pure skill-based Lone Wolf ${fmtLabel === '2v2' ? '2 vs 2' : '1 vs 1'} competition ⚔️`);
      rulesList.push("Respect rules and enjoy fair gaming 🏆");

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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
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
                    onPress={() => {
                      setGameMode(item.id);
                      setAutoGen(true);
                    }}
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
                          setAutoGen(true);
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
                        onPress={() => {
                          setBrMap(m);
                          setAutoGen(true);
                        }}
                        className={`px-3 py-1.5 border rounded-lg ${brMap === m ? 'border-rose-500 bg-rose-500/5' : 'border-slate-300 dark:border-slate-800'}`}
                      >
                        <Text className={`text-[8px] font-bold ${brMap === m ? 'text-rose-500' : 'text-slate-400'}`}>{m}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <Input
                  label="Per Kill Reward (Coins)"
                  value={brPerKill}
                  onChangeText={setBrPerKill}
                  keyboardType="numeric"
                />

                <View className="flex-row space-x-2" style={{ gap: 8 }}>
                  <View className="flex-1">
                    <Input
                      label="1st Prize (Coins)"
                      value={br1stPrize}
                      onChangeText={setBr1stPrize}
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1">
                    <Input
                      label="2nd Prize (Coins)"
                      value={br2ndPrize}
                      onChangeText={setBr2ndPrize}
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1">
                    <Input
                      label="3rd Prize (Coins)"
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
                            setAutoGen(true);
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
                          onPress={() => {
                            setCsMode(m);
                            setAutoGen(true);
                          }}
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
                  label="Winner Prize (Coins)"
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
                            setAutoGen(true);
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
                          onPress={() => {
                            setLwMode(m);
                            setAutoGen(true);
                          }}
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
                  label="Winner Prize (Coins)"
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
              label="Entry Fee (Coins)"
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
