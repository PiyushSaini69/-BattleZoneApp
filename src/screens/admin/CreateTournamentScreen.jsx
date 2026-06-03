import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react-native';

export default function CreateTournamentScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [game, setGame] = useState('bgmi'); // bgmi, free_fire, valorant, cod_mobile
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
    <View className="flex-1 bg-[#0B0F1A]">
      <View className="bg-slate-950 p-4 border-b border-slate-900 flex-row items-center justify-between">
        <Pressable onPress={() => navigation.goBack()} className="p-1">
          <ArrowLeft size={20} color="#fff" />
        </Pressable>
        <Text className="text-white font-extrabold text-sm uppercase tracking-wide">Create Tournament</Text>
        <View className="w-6" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <GlassCard 
          className="p-5 mb-6"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.05)',
            backgroundColor: 'rgba(15, 23, 42, 0.6)'
          }}
        >
          {error !== '' && (
            <View 
              className="border rounded-xl p-3.5 mb-4"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.2)'
              }}
            >
              <Text className="text-red-400 text-xs font-semibold text-center">{error}</Text>
            </View>
          )}

          <Input
            label="Tournament Title"
            value={title}
            onChangeText={setTitle}
            placeholder="E.g., BGMI Neon Cup - Solo Arena"
          />

          <View className="mb-4">
            <Text className="text-slate-455 text-xs font-bold mb-1.5 ml-1">Select Game Title</Text>
            <View className="flex-row flex-wrap justify-between">
              {[
                { label: 'BGMI', value: 'bgmi' },
                { label: 'Free Fire', value: 'free_fire' },
                { label: 'Valorant', value: 'valorant' },
                { label: 'COD Mobile', value: 'cod_mobile' },
              ].map((g) => (
                <Pressable
                  key={g.value}
                  onPress={() => setGame(g.value)}
                  className={`px-3 py-2 rounded-lg border mb-2 w-[48%] items-center ${
                    game === g.value ? 'border-purple-500' : 'bg-slate-900 border-slate-800'
                  }`}
                  style={game === g.value ? { backgroundColor: 'rgba(124, 58, 237, 0.2)' } : null}
                >
                  <Text className={`text-[9px] font-bold uppercase tracking-wider ${game === g.value ? 'text-purple-300' : 'text-slate-450'}`}>
                    {g.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-slate-455 text-xs font-bold mb-1.5 ml-1">Team Arrangement</Text>
            <View className="flex-row justify-between">
              {['solo', 'duo', 'squad'].map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setTournamentType(t)}
                  className={`flex-1 mx-1 py-2 rounded-lg border items-center ${
                    tournamentType === t ? 'border-purple-500' : 'bg-slate-900 border-slate-800'
                  }`}
                  style={tournamentType === t ? { backgroundColor: 'rgba(124, 58, 237, 0.2)' } : null}
                >
                  <Text className={`text-[9px] font-bold uppercase tracking-wider ${tournamentType === t ? 'text-purple-300' : 'text-slate-455'}`}>
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
            onChangeText={prizePool}
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
    </View>
  );
}
