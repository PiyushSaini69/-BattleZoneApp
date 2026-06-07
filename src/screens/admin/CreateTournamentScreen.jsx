import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

export default function CreateTournamentScreen({ navigation }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [title, setTitle] = useState('');
  const [game, setGame] = useState('free_fire'); // Only Free Fire is supported
  const [gameMode, setGameMode] = useState('battle_royale'); // battle_royale, clash_squad, lone_wolf, custom
  const [tournamentType, setTournamentType] = useState('solo'); // solo, duo, squad
  const [entryFee, setEntryFee] = useState('20');
  const [prizePool, setPrizePool] = useState('1000');
  const [totalSlots, setTotalSlots] = useState('50');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setError('');
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    setLoading(true);
    try {
      const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const res = await request('/admin/tournaments', {
        method: 'POST',
        body: JSON.stringify({
          title,
          game,
          gameMode,
          tournamentType,
          entryFee: parseFloat(entryFee),
          prizePool: parseFloat(prizePool),
          totalSlots: parseInt(totalSlots),
          scheduledAt
        })
      });

      if (res.success) {
        Alert.alert('Success 🎉', 'Tournament catalog successfully created!', [
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
      colors={['#060A13', '#0D1321']}
      className="flex-1"
    >
      <View className="bg-slate-955/40 p-4 border-b border-slate-900/60 flex-row items-center justify-between">
        <Pressable onPress={() => navigation.goBack()} className="p-1">
          <ArrowLeft size={20} color="#fff" />
        </Pressable>
        <Text className="text-white font-extrabold text-sm uppercase tracking-wide">Create Tournament</Text>
        <View className="w-6" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
        <GlassCard className="p-5 mb-6" glowColor="purple">
          {error !== '' && (
            <View 
              className="border rounded-xl p-3.5 mb-4"
              style={{
                backgroundColor: 'rgba(244, 63, 94, 0.08)',
                borderColor: 'rgba(244, 63, 94, 0.35)'
              }}
            >
              <Text className="text-rose-455 text-xs font-bold text-center">{error}</Text>
            </View>
          )}

          <Input
            label="Tournament Title"
            value={title}
            onChangeText={setTitle}
            placeholder="E.g., Free Fire Neon Cup - Solo Tournament"
          />

          <View className="mb-5 px-0.5">
            <Text className="text-slate-400 text-xs font-extrabold mb-2.5 uppercase tracking-wide">Team Arrangement</Text>
            <View className="flex-row justify-between bg-slate-950/60 border border-slate-900 rounded-xl p-1">
              {['solo', 'duo', 'squad'].map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setTournamentType(t)}
                  className={`flex-1 py-2 rounded-lg items-center ${
                    tournamentType === t 
                      ? 'bg-slate-800' 
                      : ''
                  }`}
                  style={tournamentType === t ? {
                    shadowColor: '#8B5CF6',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 2
                  } : {}}
                >
                  <Text className={`text-[9px] font-extrabold uppercase tracking-wider ${tournamentType === t ? 'text-violet-400' : 'text-slate-400'}`}>
                    {t}
                  </Text>
                </Pressable>
              ))}
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
            label="Prize Pool (₹)"
            value={prizePool}
            onChangeText={setPrizePool}
            placeholder="1000"
            keyboardType="number-pad"
          />

          <Input
            label="Total Available Slots"
            value={totalSlots}
            onChangeText={setTotalSlots}
            placeholder="50"
            keyboardType="number-pad"
          />

          <Button
            title="Publish Tournament"
            onPress={handleCreate}
            loading={loading}
            className="mt-4"
          />
        </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
