import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl, Modal, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Plus, ArrowLeft } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

export default function SupportScreen({ navigation }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [tickets, setTickets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('payment'); // payment, tournament, account, technical, other

  const loadTickets = async () => {
    try {
      const res = await request('/support/tickets');
      if (res.success) setTickets(res.data);
    } catch (e) {
      console.log('Error fetching tickets:', e.message);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTickets();
    setRefreshing(false);
  };

  const handleCreateTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Fields Required ⚠️', 'Please enter subject and message.');
      return;
    }

    setLoading(true);
    try {
      const res = await request('/support/tickets', {
        method: 'POST',
        body: JSON.stringify({ subject, category, message })
      });
      if (res.success) {
        Alert.alert('Success 🎉', 'Support ticket created successfully!');
        setSubject('');
        setMessage('');
        setShowCreateModal(false);
        await loadTickets();
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'open': return 'success';
      case 'in_progress': return 'warning';
      case 'resolved': return 'info';
      default: return 'slate';
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-200/60 dark:border-white/5">
          <View className="flex-row items-center">
            <Pressable 
              onPress={() => navigation.goBack()}
              className="p-2 mr-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 active:bg-slate-200 active:dark:bg-white/10"
            >
              <ArrowLeft size={18} color={isDark ? '#00E5FF' : '#7C3AED'} />
            </Pressable>
            <Text className="text-slate-900 dark:text-white text-base font-black uppercase tracking-widest">
              Support Desk
            </Text>
          </View>
          
          <Pressable 
            onPress={() => setShowCreateModal(true)}
            className="bg-violet-600 dark:bg-violet-650 w-9 h-9 rounded-xl items-center justify-center border border-violet-500"
            style={{
              shadowColor: isDark ? '#8B5CF6' : '#7C3AED',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 3,
            }}
          >
            <Plus size={18} color="#fff" />
          </Pressable>
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor={isDark ? '#00E5FF' : '#7C3AED'} 
              colors={[isDark ? '#00E5FF' : '#7C3AED']} 
              progressBackgroundColor={isDark ? '#0A0E1A' : '#FFFFFF'}
            />
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        >
          <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-4 px-0.5">Your Open & Past Tickets</Text>
          
          {tickets.length === 0 ? (
            <GlassCard className="py-12 items-center" glowColor="purple">
              <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold text-center mb-4">No active support tickets found.</Text>
              <Button title="Raise New Ticket" onPress={() => setShowCreateModal(true)} className="px-6 py-2.5" />
            </GlassCard>
          ) : (
            tickets.map((t) => (
              <Pressable 
                key={t._id}
                onPress={() => navigation.navigate('TicketDetail', { ticketId: t._id })}
              >
                <GlassCard 
                  className="mb-3.5 flex-row justify-between items-center py-4 px-4"
                  glowColor="purple"
                >
                  <View className="flex-1 mr-3">
                    <View className="flex-row items-center mb-1.5">
                      <Badge text={t.category} variant="purple" />
                      <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase ml-2">ID: {t.ticketId}</Text>
                    </View>
                    <Text className="text-slate-900 dark:text-white font-bold text-sm" numberOfLines={1}>{t.subject}</Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-[9px] mt-1.5 font-bold uppercase tracking-wider">
                      Last activity: {new Date(t.updatedAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Badge text={t.status.replace('_', ' ')} variant={getStatusVariant(t.status)} />
                </GlassCard>
              </Pressable>
            ))
          )}
        </ScrollView>

        <Modal transparent visible={showCreateModal} animationType="slide">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
          >
            <View 
              className="flex-1 justify-center items-center p-6"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            >
              <GlassCard 
                className="w-full max-w-sm p-6"
                glowColor="purple"
              >
                <Text className="text-slate-900 dark:text-[#00E5FF] text-base font-black text-center mb-4 uppercase tracking-wide">Raise Ticket</Text>

                <Input
                  label="Subject"
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="Brief description of the problem"
                />

                <View className="mb-4 px-0.5">
                  <Text className="text-slate-500 dark:text-slate-400 text-xs font-extrabold mb-2 uppercase tracking-wide">Category</Text>
                  <View className="flex-row flex-wrap justify-between">
                    {['payment', 'tournament', 'technical', 'other'].map((cat) => (
                      <Pressable
                        key={cat}
                        onPress={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg border mb-2 w-[48%] items-center ${
                          category === cat 
                            ? 'border-purple-500 bg-purple-500/10 dark:bg-slate-800' 
                            : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-900'
                        }`}
                        style={category === cat ? {
                          shadowColor: '#8B5CF6',
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                          elevation: 2
                        } : {}}
                      >
                        <Text className={`text-[9px] font-extrabold uppercase tracking-wider ${
                          category === cat 
                            ? 'text-purple-600 dark:text-violet-400' 
                            : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View className="mb-4 w-full px-0.5">
                  <Text className="text-slate-500 dark:text-slate-400 text-xs font-extrabold mb-1.5 uppercase tracking-wide">Describe Your Issue</Text>
                  <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Provide exact details so support can help you..."
                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                    multiline
                    numberOfLines={4}
                    style={{ 
                      textAlignVertical: 'top', 
                      height: 90, 
                      backgroundColor: isDark ? '#090d16' : '#F8FAFC', 
                      color: isDark ? '#ffffff' : '#0F172A', 
                      borderWidth: 1, 
                      borderColor: isDark ? 'rgba(0, 229, 255, 0.2)' : '#CBD5E1', 
                      borderRadius: 12, 
                      padding: 12,
                      fontSize: 13 
                    }}
                  />
                </View>

                <View className="flex-row justify-between mt-4">
                  <Pressable 
                    onPress={() => setShowCreateModal(false)}
                    className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 active:bg-slate-200 active:dark:bg-white/10"
                    style={{ flex: 1, marginRight: 8, borderRadius: 12, paddingVertical: 12 }}
                  >
                    <Text className="text-slate-600 dark:text-slate-300 text-center font-bold text-xs uppercase tracking-wide">Cancel</Text>
                  </Pressable>
                  <Pressable 
                    onPress={handleCreateTicket}
                    disabled={loading}
                    className="bg-purple-600 dark:bg-purple-700 active:bg-purple-700 active:dark:bg-purple-800"
                    style={{ flex: 1, marginLeft: 8, borderRadius: 12, paddingVertical: 12 }}
                  >
                    <Text className="text-white text-center font-bold text-xs uppercase tracking-wide">Submit</Text>
                  </Pressable>
                </View>
              </GlassCard>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}
