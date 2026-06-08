import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import { ArrowLeft, ShieldAlert } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

export default function DeclareResultsScreen({ route, navigation }) {
  const { tournamentId, title, slug, resultsDeclared: initialResultsDeclared } = route.params;
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const [participants, setParticipants] = useState([]);
  const [resultsInputs, setResultsInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resultsDeclared, setResultsDeclared] = useState(initialResultsDeclared || false);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      if (slug) {
        const tournRes = await request(`/tournaments/${slug}`);
        if (tournRes.success && tournRes.data?.tournament) {
          setResultsDeclared(tournRes.data.tournament.resultsDeclared);
        }
      }
      const res = await request(`/tournaments/${tournamentId}/participants`);
      if (res.success) {
        setParticipants(res.data);
        const initialInputs = {};
        res.data.forEach(p => {
          if (p.userId) {
            initialInputs[p.userId] = {
              kills: String(p.kills || '0'),
              rank: String(p.rank || '')
            };
          }
        });
        setResultsInputs(initialInputs);
      } else {
        Alert.alert('Error', 'Failed to load tournament participants.');
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, [tournamentId, slug]);

  const submitTournamentResults = async () => {
    const playerResults = [];
    let validationFailed = false;

    participants.forEach(p => {
      if (!p.userId) return;
      const input = resultsInputs[p.userId];
      const kills = parseInt(input?.kills || '0', 10);
      const rank = parseInt(input?.rank || '', 10);

      if (isNaN(rank) || rank <= 0) {
        validationFailed = true;
        return;
      }

      playerResults.push({
        userId: p.userId,
        kills: isNaN(kills) ? 0 : kills,
        rank: rank,
        points: 0
      });
    });

    if (validationFailed) {
      Alert.alert('Validation Error ⚠️', 'Please enter a valid Rank (positive number) for all participants.');
      return;
    }

    if (playerResults.length === 0) {
      Alert.alert('Error ⚠️', 'No participants with user accounts found.');
      return;
    }

    Alert.alert(
      'Confirm Results 🏆',
      'Are you sure you want to declare these results and credit prizes to all winners? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Credit Prizes',
          onPress: async () => {
            try {
              setSubmitting(true);
              const res = await request(`/admin/tournaments/${tournamentId}/results`, {
                method: 'POST',
                body: JSON.stringify({ playerResults })
              });
              if (res.success) {
                Alert.alert('Success 🎉', 'Match results submitted and prizes credited successfully!', [
                  { text: 'OK', onPress: () => navigation.goBack() }
                ]);
              } else {
                Alert.alert('Error', res.message || 'Failed to submit results.');
              }
            } catch (e) {
              Alert.alert('Error', e.message);
            } finally {
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={{ height: insets.top }} />
        <View className="bg-white/80 dark:bg-slate-950/40 px-4 py-3 border-b border-slate-200 dark:border-slate-900/60 flex-row items-center justify-between">
          <Pressable 
            onPress={() => navigation.goBack()} 
            className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <ArrowLeft size={18} color={isDark ? '#E2E8F0' : '#1E293B'} />
          </Pressable>
          <View className="items-center flex-1 mx-4">
            <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide" numberOfLines={1}>
              Declare Results
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] uppercase font-bold tracking-widest mt-0.5" numberOfLines={1}>
              {title}
            </Text>
          </View>
          <View className="w-9" />
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={isDark ? '#00E5FF' : '#7C3AED'} />
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-4">Loading match participants...</Text>
          </View>
        ) : (
          <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
            {participants.length === 0 ? (
              <GlassCard className="p-8 items-center" glowColor="red">
                <ShieldAlert size={36} color="#EF4444" />
                <Text className="text-slate-950 dark:text-white font-black text-sm uppercase tracking-wider text-center mt-3">No Participants</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs text-center mt-1">No players registered for this tournament yet.</Text>
              </GlassCard>
            ) : (
              <>
                <View className="mb-4">
                  <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-widest px-0.5 mb-2">Registered Player Rankings</Text>
                  {participants.map((p, idx) => {
                    if (!p.userId) return null;
                    const input = resultsInputs[p.userId] || { kills: '0', rank: '' };
                    return (
                      <GlassCard key={p.userId || idx} className="p-4 mb-4" glowColor="red">
                        <View className="flex-row justify-between items-center mb-3">
                          <View className="flex-1 mr-2">
                            <Text className="text-slate-900 dark:text-white font-black text-sm">{p.displayName || p.username}</Text>
                            <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase mt-0.5">Slot #{p.slotNumber}</Text>
                          </View>
                          <Text className="text-cyan-400 dark:text-cyan-400 font-mono text-[10px] uppercase">UID: {p.gameUID || 'N/A'}</Text>
                        </View>
                        
                        <View className="flex-row justify-between" style={{ gap: 12 }}>
                          <View className="flex-1">
                            <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase mb-1.5">Rank Position</Text>
                            <TextInput
                              editable={!resultsDeclared}
                              placeholder="e.g. 1, 2, 12"
                              value={input.rank}
                              onChangeText={(text) => {
                                setResultsInputs(prev => ({
                                  ...prev,
                                  [p.userId]: { ...prev[p.userId], rank: text }
                                }));
                              }}
                              keyboardType="numeric"
                              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                              style={{
                                backgroundColor: isDark ? '#090d16' : '#F1F5F9',
                                color: isDark ? '#ffffff' : '#0F172A',
                                borderRadius: 10,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                fontSize: 13,
                                borderWidth: 1,
                                borderColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#CBD5E1',
                              }}
                            />
                          </View>
                          <View className="flex-1">
                            <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase mb-1.5">Total Kills</Text>
                            <TextInput
                              editable={!resultsDeclared}
                              placeholder="0"
                              value={input.kills}
                              onChangeText={(text) => {
                                setResultsInputs(prev => ({
                                  ...prev,
                                  [p.userId]: { ...prev[p.userId], kills: text }
                                }));
                              }}
                              keyboardType="numeric"
                              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                              style={{
                                backgroundColor: isDark ? '#090d16' : '#F1F5F9',
                                color: isDark ? '#ffffff' : '#0F172A',
                                borderRadius: 10,
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                fontSize: 13,
                                borderWidth: 1,
                                borderColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#CBD5E1',
                              }}
                            />
                          </View>
                        </View>
                      </GlassCard>
                    );
                  })}
                </View>

                {resultsDeclared ? null : submitting ? (
                  <View className="py-4 items-center justify-center">
                    <ActivityIndicator size="small" color="#EF4444" />
                    <Text className="text-slate-500 text-[10px] uppercase font-bold mt-2">Crediting prizes & completing match...</Text>
                  </View>
                ) : (
                  <Pressable
                    onPress={submitTournamentResults}
                    className="overflow-hidden rounded-xl shadow-lg mt-2 mb-10"
                    style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
                  >
                    <LinearGradient
                      colors={['#EF4444', '#DC2626']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="py-4 items-center justify-center"
                    >
                      <Text className="text-white text-xs font-black uppercase tracking-wider">Credit Prizes & End Match 🏆</Text>
                    </LinearGradient>
                  </Pressable>
                )}
              </>
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
