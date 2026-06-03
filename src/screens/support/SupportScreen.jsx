import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl, Modal, Alert } from 'react-native';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Plus, ArrowLeft } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

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
    <View className="flex-1 bg-slate-50 dark:bg-[#0B0F1A]">
      <View className="bg-white dark:bg-slate-955 p-4 border-b border-slate-200 dark:border-slate-900 flex-row items-center justify-between">
        <Pressable onPress={() => navigation.goBack()} className="p-1">
          <ArrowLeft size={20} color={isDark ? '#fff' : '#0F172A'} />
        </Pressable>
        <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide">Support Desk</Text>
        <Pressable 
          onPress={() => setShowCreateModal(true)}
          className="bg-[#7C3AED] w-8 h-8 rounded-lg items-center justify-center border border-transparent"
        >
          <Plus size={16} color="#fff" />
        </Pressable>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" colors={["#7C3AED"]} />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-4">Your Open & Past Tickets</Text>
        
        {tickets.length === 0 ? (
          <GlassCard className="py-12 items-center">
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
              >
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center mb-1">
                    <Badge text={t.category} variant="purple" />
                    <Text className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase ml-2">ID: {t.ticketId}</Text>
                  </View>
                  <Text className="text-slate-900 dark:text-white font-bold text-sm" numberOfLines={1}>{t.subject}</Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-[9px] mt-1 font-semibold uppercase">
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
        <View 
          className="flex-1 justify-center items-center p-6"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        >
          <GlassCard 
            className="w-full max-w-sm p-6"
            style={{ 
              backgroundColor: isDark ? '#020617' : '#ffffff',
              borderColor: isDark ? 'rgba(124, 58, 237, 0.35)' : 'rgba(124, 58, 237, 0.15)',
              borderWidth: 1 
            }}
          >
            <Text className="text-[#7C3AED] dark:text-[#C084FC] text-base font-black text-center mb-4 uppercase tracking-wide">Raise Ticket</Text>

            <Input
              label="Subject"
              value={subject}
              onChangeText={setSubject}
              placeholder="Brief description of the problem"
            />

            <View className="mb-4">
              <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-1.5 ml-1">Category</Text>
              <View className="flex-row flex-wrap justify-between">
                {['payment', 'tournament', 'technical', 'other'].map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg border mb-2 w-[48%] items-center ${
                      category === cat 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' 
                        : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-850'
                    }`}
                  >
                    <Text className={`text-[9px] font-bold uppercase tracking-wider ${category === cat ? 'text-[#7C3AED] dark:text-purple-300' : 'text-slate-500 dark:text-slate-450'}`}>
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="mb-4 w-full">
              <Text className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-1.5 ml-1">Describe Your Issue</Text>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Provide exact details so support can help you..."
                placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                multiline
                numberOfLines={4}
                style={{ 
                  textAlignVertical: 'top', 
                  height: 80, 
                  backgroundColor: isDark ? '#020617' : '#f1f5f9', 
                  color: isDark ? '#ffffff' : '#0F172A', 
                  borderWidth: 1, 
                  borderColor: isDark ? '#1E293B' : '#cbd5e1', 
                  borderRadius: 12, 
                  padding: 10,
                  fontSize: 14 
                }}
              />
            </View>

            <View className="flex-row justify-between mt-4">
              <Pressable 
                onPress={() => setShowCreateModal(false)}
                style={{ flex: 1, marginRight: 8, backgroundColor: isDark ? '#1e293b' : '#f1f5f9', borderColor: isDark ? '#334155' : '#cbd5e1', borderWidth: 1, borderRadius: 12, paddingVertical: 12 }}
              >
                <Text className="text-slate-700 dark:text-slate-350 text-center font-bold text-xs uppercase">Cancel</Text>
              </Pressable>
              <Pressable 
                onPress={handleCreateTicket}
                disabled={loading}
                style={{ flex: 1, marginLeft: 8, backgroundColor: '#7c3aed', borderColor: '#a78bfa', borderWidth: 1, borderRadius: 12, paddingVertical: 12 }}
              >
                <Text className="text-white text-center font-bold text-xs uppercase">Submit</Text>
              </Pressable>
            </View>
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
}
