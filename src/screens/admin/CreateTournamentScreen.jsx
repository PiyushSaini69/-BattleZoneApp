import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, Alert, KeyboardAvoidingView, Platform, useColorScheme as useRNColorScheme, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ArrowLeft, Calendar, Clock } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateTournamentScreen({ route, navigation }) {
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
  const [br1stPrize, setBr1stPrize] = useState('');
  const [br2ndPrize, setBr2ndPrize] = useState('');
  const [br3rdPrize, setBr3rdPrize] = useState('');
  const [brPerKill, setBrPerKill] = useState('');

  // CS states
  const [csFormat, setCsFormat] = useState('4v4'); // 1v1, 2v2, 4v4
  const [csMode, setCsMode] = useState('normal'); // normal, headshot, onetap

  // LW states
  const [lwFormat, setLwFormat] = useState('1v1'); // 1v1, 2v2
  const [lwMode, setLwMode] = useState('normal'); // normal, headshot, onetap

  // CS/LW winner prize
  const [cslwWinnerPrize, setCslwWinnerPrize] = useState('');

  // Shared states
  const [entryFee, setEntryFee] = useState('');
  const [prizePool, setPrizePool] = useState('');
  const [totalSlots, setTotalSlots] = useState('48');
  const [date, setDate] = useState(getCurrentDateString());
  const [time, setTime] = useState(curTime.timeStr);
  const [isPm, setIsPm] = useState(curTime.isPmVal);

  const [description, setDescription] = useState('');
  const [rulesText, setRulesText] = useState('');
  const [bannerMapping, setBannerMapping] = useState('');
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setPickerDate(selectedDate);
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      setDate(`${day}-${month}-${year}`);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      const newPickerDate = new Date(pickerDate);
      newPickerDate.setHours(selectedTime.getHours());
      newPickerDate.setMinutes(selectedTime.getMinutes());
      setPickerDate(newPickerDate);

      let hours = selectedTime.getHours();
      const minutes = String(selectedTime.getMinutes()).padStart(2, '0');
      const isPmVal = hours >= 12;
      hours = hours % 12;
      hours = hours ? hours : 12;
      const hoursStr = String(hours).padStart(2, '0');
      setTime(`${hoursStr}:${minutes}`);
      setIsPm(isPmVal);
    }
  };
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const editTournament = route?.params?.tournament;
  const isEditMode = !!editTournament;

  useEffect(() => {
    if (isEditMode && editTournament) {
      setAutoGen(false);
      setTitle(editTournament.title || '');
      setGameMode(editTournament.gameMode || 'battle_royale');
      setEntryFee(editTournament.entryFee !== undefined && editTournament.entryFee !== null ? String(editTournament.entryFee) : '');
      setPrizePool(editTournament.prizePool !== undefined && editTournament.prizePool !== null ? String(editTournament.prizePool) : '');
      setTotalSlots(editTournament.totalSlots !== undefined && editTournament.totalSlots !== null ? String(editTournament.totalSlots) : '');
      setDescription(editTournament.description || '');
      setRulesText(editTournament.rules ? editTournament.rules.join('\n') : '');
      setBannerMapping(editTournament.bannerImage || '');

      // Parse schedule date and time
      if (editTournament.scheduledAt) {
        const schedDate = new Date(editTournament.scheduledAt);
        if (!isNaN(schedDate.getTime())) {
          const day = String(schedDate.getDate()).padStart(2, '0');
          const month = String(schedDate.getMonth() + 1).padStart(2, '0');
          const year = schedDate.getFullYear();
          setDate(`${day}-${month}-${year}`);

          let hours = schedDate.getHours();
          const minutes = String(schedDate.getMinutes()).padStart(2, '0');
          const isPmVal = hours >= 12;
          hours = hours % 12;
          hours = hours ? hours : 12;
          const hoursStr = String(hours).padStart(2, '0');
          setTime(`${hoursStr}:${minutes}`);
          setIsPm(isPmVal);
          setPickerDate(schedDate);
        }
      }

      if (editTournament.gameMode === 'battle_royale') {
        setBrType(editTournament.tournamentType || 'solo');
        setBrMap(editTournament.mapType || 'Bermuda');
        setBrPerKill(editTournament.perKillReward !== undefined && editTournament.perKillReward !== null ? String(editTournament.perKillReward) : '');
        setBr1stPrize(editTournament.firstPrize !== undefined && editTournament.firstPrize !== null ? String(editTournament.firstPrize) : '');
        setBr2ndPrize(editTournament.secondPrize !== undefined && editTournament.secondPrize !== null ? String(editTournament.secondPrize) : '');
        setBr3rdPrize(editTournament.thirdPrize !== undefined && editTournament.thirdPrize !== null ? String(editTournament.thirdPrize) : '');
      } else if (editTournament.gameMode === 'clash_squad') {
        setCsFormat(editTournament.format || '4v4');
        setCsMode(editTournament.mode || 'normal');
        setCslwWinnerPrize(editTournament.winnerPrize !== undefined && editTournament.winnerPrize !== null ? String(editTournament.winnerPrize) : '');
      } else if (editTournament.gameMode === 'lone_wolf') {
        setLwFormat(editTournament.format || '1v1');
        setLwMode(editTournament.mode || 'normal');
        setCslwWinnerPrize(editTournament.winnerPrize !== undefined && editTournament.winnerPrize !== null ? String(editTournament.winnerPrize) : '');
      }
    }
  }, [editTournament]);

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
    setDescription(data.description);
    setRulesText(data.rules);
    setBannerMapping(data.banner);

    // Auto-fill defaults for BR Solo
    if (gameMode === 'battle_royale' && brType === 'solo') {
      setEntryFee('10');
      setTotalSlots('48');
      setBrPerKill('8');
      setBr1stPrize('30');
      setBr2ndPrize('20');
      setBr3rdPrize('0');
    }

    // Auto-fill defaults for BR Duo
    if (gameMode === 'battle_royale' && brType === 'duo') {
      setEntryFee('10');
      setTotalSlots('24');
      setBrPerKill('8');
      setBr1stPrize('30');
      setBr2ndPrize('20');
      setBr3rdPrize('0');
    }

    // Auto-fill defaults for BR Squad
    if (gameMode === 'battle_royale' && brType === 'squad') {
      setEntryFee('10');
      setTotalSlots('12');
      setBrPerKill('8');
      setBr1stPrize('60');
      setBr2ndPrize('0');
      setBr3rdPrize('0');
    }
  }, [gameMode, brType, brMap, csFormat, csMode, lwFormat, lwMode, autoGen]);

  // Auto-calculate prizePool when individual prizes change
  useEffect(() => {
    if (gameMode === 'battle_royale') {
      const p1 = parseFloat(br1stPrize) || 0;
      const p2 = parseFloat(br2ndPrize) || 0;
      const p3 = parseFloat(br3rdPrize) || 0;
      setPrizePool(String(p1 + p2 + p3));
    } else {
      const winner = parseFloat(cslwWinnerPrize) || 0;
      setPrizePool(String(winner));
    }
  }, [br1stPrize, br2ndPrize, br3rdPrize, cslwWinnerPrize, gameMode]);

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
        entryFee: parseFloat(entryFee) || 0,
        prizePool: parseFloat(prizePool) || 0,
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
        payload.perKillReward = parseFloat(brPerKill) || 0;
        payload.firstPrize = parseFloat(br1stPrize) || 0;
        payload.secondPrize = parseFloat(br2ndPrize) || 0;
        payload.thirdPrize = parseFloat(br3rdPrize) || 0;
        payload.prizePool = parseFloat(prizePool) || 0;
        payload.prizeDistribution = [
          { rank: 1, amount: parseFloat(br1stPrize) || 0 },
          { rank: 2, amount: parseFloat(br2ndPrize) || 0 },
          { rank: 3, amount: parseFloat(br3rdPrize) || 0 }
        ];
      } else if (gameMode === 'clash_squad') {
        payload.format = csFormat;
        payload.mode = csMode;
        payload.winnerPrize = parseFloat(cslwWinnerPrize) || 0;
        payload.prizePool = parseFloat(prizePool) || 0;
        payload.prizeDistribution = [{ rank: 1, amount: parseFloat(cslwWinnerPrize) || 0 }];
      } else if (gameMode === 'lone_wolf') {
        payload.format = lwFormat;
        payload.mode = lwMode;
        payload.winnerPrize = parseFloat(cslwWinnerPrize) || 0;
        payload.prizePool = parseFloat(prizePool) || 0;
        payload.prizeDistribution = [{ rank: 1, amount: parseFloat(cslwWinnerPrize) || 0 }];
      }

      const apiEndpoint = isEditMode 
        ? `/admin/tournaments/${editTournament._id}`
        : '/admin/tournaments';
      const apiMethod = isEditMode ? 'PATCH' : 'POST';

      const res = await request(apiEndpoint, {
        method: apiMethod,
        body: JSON.stringify(payload)
      });

      if (res.success) {
        Alert.alert('Success 🎉', isEditMode ? 'Tournament updated successfully!' : 'Tournament catalog created successfully!', [
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
        <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide">{isEditMode ? 'Edit Tournament' : 'Create Tournament'}</Text>
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
                      setTotalSlots(item.id === 'battle_royale' ? '48' : '8');
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
              </View>
            )}

            {/* General form settings */}
            <View className="flex-row justify-between mb-4" style={{ gap: 12 }}>
              <View className="flex-1">
                <Text 
                  className="text-xs font-bold uppercase tracking-widest mb-2 ml-0.5 text-slate-500 dark:text-slate-400"
                >
                  Date (DD-MM-YYYY)
                </Text>
                <Pressable 
                  onPress={() => setShowDatePicker(true)}
                  className="flex-row items-center rounded-xl px-4 justify-between"
                  style={{
                    backgroundColor: isDark ? '#0A0E1A' : '#F1F5F9',
                    borderWidth: 1.5,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                    height: 50,
                  }}
                >
                  <Text style={{ color: isDark ? '#F1F5F9' : '#0F172A', fontSize: 14 }}>
                    {date || 'Select Date'}
                  </Text>
                  <Calendar size={18} color={isDark ? '#94A3B8' : '#64748B'} />
                </Pressable>
              </View>
              <View className="flex-1">
                <Text 
                  className="text-xs font-bold uppercase tracking-widest mb-2 ml-0.5 text-slate-500 dark:text-slate-400"
                >
                  Time (HH:MM)
                </Text>
                <View className="flex-row items-center">
                  <Pressable 
                    onPress={() => setShowTimePicker(true)}
                    className="flex-1 mr-2 flex-row items-center rounded-xl px-4 justify-between"
                    style={{
                      backgroundColor: isDark ? '#0A0E1A' : '#F1F5F9',
                      borderWidth: 1.5,
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                      height: 50,
                    }}
                  >
                    <Text style={{ color: isDark ? '#F1F5F9' : '#0F172A', fontSize: 14 }}>
                      {time || 'Select Time'}
                    </Text>
                    <Clock size={18} color={isDark ? '#94A3B8' : '#64748B'} />
                  </Pressable>
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

            <View className="flex-row justify-between mb-4" style={{ gap: 12 }}>
              <View className="flex-1">
                <Input
                  label="Entry Fee (Coins)"
                  value={entryFee}
                  onChangeText={setEntryFee}
                  placeholder="10"
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Prize Pool (Coins)"
                  value={prizePool}
                  onChangeText={setPrizePool}
                  placeholder="50"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Input
              label="Total Slots"
              value={totalSlots}
              onChangeText={(val) => {
                setAutoGen(false);
                setTotalSlots(val);
              }}
              placeholder="48"
              keyboardType="numeric"
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
              title={isEditMode ? "Update Tournament" : "Create Tournament"}
              onPress={handleCreate}
              loading={loading}
              className="mt-4 bg-rose-600 border border-rose-500"
            />
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Android DateTimePickers */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {Platform.OS === 'android' && showTimePicker && (
        <DateTimePicker
          value={pickerDate}
          mode="time"
          display="default"
          is24Hour={false}
          onChange={onChangeTime}
        />
      )}

      {/* iOS Date Picker Modal */}
      {Platform.OS === 'ios' && (
        <Modal
          transparent={true}
          visible={showDatePicker}
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <Pressable 
            className="flex-1 bg-black/60 justify-end"
            onPress={() => setShowDatePicker(false)}
          >
            <Pressable 
              className="bg-slate-900 border-t border-slate-800 p-6 rounded-t-3xl"
              onPress={(e) => e.stopPropagation()}
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white font-bold text-lg">Select Date</Text>
                <Pressable 
                  onPress={() => setShowDatePicker(false)}
                  className="bg-rose-600 px-4 py-2 rounded-xl"
                >
                  <Text className="text-white font-extrabold text-xs uppercase">Done</Text>
                </Pressable>
              </View>
              <View className="bg-slate-950 rounded-2xl p-4 items-center justify-center">
                <DateTimePicker
                  value={pickerDate}
                  mode="date"
                  display="spinner"
                  textColor="#FFFFFF"
                  onChange={onChangeDate}
                />
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* iOS Time Picker Modal */}
      {Platform.OS === 'ios' && (
        <Modal
          transparent={true}
          visible={showTimePicker}
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <Pressable 
            className="flex-1 bg-black/60 justify-end"
            onPress={() => setShowTimePicker(false)}
          >
            <Pressable 
              className="bg-slate-900 border-t border-slate-800 p-6 rounded-t-3xl"
              onPress={(e) => e.stopPropagation()}
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white font-bold text-lg">Select Time</Text>
                <Pressable 
                  onPress={() => setShowTimePicker(false)}
                  className="bg-rose-600 px-4 py-2 rounded-xl"
                >
                  <Text className="text-white font-extrabold text-xs uppercase">Done</Text>
                </Pressable>
              </View>
              <View className="bg-slate-950 rounded-2xl p-4 items-center justify-center">
                <DateTimePicker
                  value={pickerDate}
                  mode="time"
                  display="spinner"
                  textColor="#FFFFFF"
                  is24Hour={false}
                  onChange={onChangeTime}
                />
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </LinearGradient>
  );
}
