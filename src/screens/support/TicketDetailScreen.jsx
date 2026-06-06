import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, Pressable, FlatList, RefreshControl, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import Badge from '../../components/ui/Badge';
import { Send, ArrowLeft } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

export default function TicketDetailScreen({ route, navigation }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { ticketId } = route.params;
  const { user } = useContext(AuthContext);

  const [ticket, setTicket] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef(null);

  const loadTicketDetail = async () => {
    try {
      const res = await request(`/support/tickets/${ticketId}`);
      if (res.success) {
        setTicket(res.data);
      }
    } catch (e) {
      console.log('Error fetching ticket details:', e.message);
    }
  };

  useEffect(() => {
    loadTicketDetail();
  }, [ticketId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTicketDetail();
    setRefreshing(false);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    setLoading(true);
    try {
      const res = await request(`/support/tickets/${ticketId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ message: replyText.trim() })
      });
      if (res.success) {
        setReplyText('');
        await loadTicketDetail();
      }
    } catch (e) {
      console.log('Reply error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isSelf = item.senderId === user?.id || item.senderId?._id === user?.id;

    return (
      <View className={`mb-3.5 flex-row ${isSelf ? 'justify-end' : 'justify-start'}`}>
        {isSelf ? (
          <LinearGradient
            colors={['#8B5CF6', '#6D28D9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="max-w-[80%] rounded-2xl px-4 py-2.5 rounded-tr-none"
          >
            <Text className="text-xs leading-relaxed text-white">{item.message}</Text>
            <Text className="text-[7px] text-right mt-1 font-bold uppercase text-purple-200">
              {new Date(item.sentAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </LinearGradient>
        ) : (
          <View 
            className="max-w-[80%] rounded-2xl px-4 py-2.5 rounded-tl-none bg-[#0A0E1A] border border-slate-800/80"
          >
            <Text className="text-cyan-400 font-extrabold text-[9px] uppercase mb-1">
              Support Staff
            </Text>
            <Text className="text-xs leading-relaxed text-white">{item.message}</Text>
            <Text className="text-[7px] text-right mt-1 font-bold uppercase text-slate-500">
              {new Date(item.sentAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (!ticket) {
    return (
      <LinearGradient colors={['#060A13', '#0D1321']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text className="text-slate-400 text-sm font-semibold">Loading ticket log...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#060A13', '#0D1321']}
      className="flex-1"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View className="bg-slate-950/40 p-4 border-b border-slate-900/60 flex-row items-center justify-between">
          <Pressable onPress={() => navigation.goBack()} className="p-1">
            <ArrowLeft size={20} color="#fff" />
          </Pressable>
          <View className="items-center flex-1 mx-2">
            <Text className="text-white font-extrabold text-sm uppercase tracking-wide" numberOfLines={1}>
              {ticket.subject}
            </Text>
            <Text className="text-slate-400 text-[9px] uppercase font-bold mt-1">Ticket ID: {ticket.ticketId}</Text>
          </View>
          <Badge text={ticket.status} variant={ticket.status === 'open' ? 'success' : 'info'} />
        </View>

        <View className="flex-1 px-4 py-2">
          <FlatList
            ref={flatListRef}
            data={ticket.messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderMessage}
            contentContainerStyle={{ paddingVertical: 10 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                tintColor="#00E5FF" 
                colors={["#00E5FF"]} 
                progressBackgroundColor="#0A0E1A"
              />
            }
          />
        </View>

        {ticket.status === 'closed' ? (
          <View className="p-4 bg-slate-950/60 items-center justify-center border-t border-slate-900">
            <Text className="text-rose-400 font-extrabold text-xs uppercase tracking-wide">This ticket is closed</Text>
          </View>
        ) : (
          <View className="p-3 border-t border-slate-900 bg-slate-950/80 flex-row items-center">
            <TextInput
              value={replyText}
              onChangeText={setReplyText}
              placeholder="Type your reply here..."
              placeholderTextColor="#64748B"
              style={{ 
                flex: 1, 
                backgroundColor: '#090d16', 
                color: '#ffffff', 
                borderRadius: 12, 
                paddingHorizontal: 16, 
                paddingVertical: 10, 
                fontSize: 13, 
                borderWidth: 1, 
                borderColor: 'rgba(0, 229, 255, 0.2)', 
                marginRight: 8 
              }}
            />
            <Pressable 
              onPress={handleSendReply}
              disabled={loading}
              style={{
                backgroundColor: '#8B5CF6',
                width: 44,
                height: 44,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#A78BFA',
              }}
            >
              <Send size={16} color="#fff" />
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
