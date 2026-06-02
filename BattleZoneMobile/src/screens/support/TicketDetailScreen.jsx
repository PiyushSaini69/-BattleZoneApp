import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, Pressable, FlatList, RefreshControl, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import Badge from '../../components/ui/Badge';
import { Send, ArrowLeft } from 'lucide-react-native';

export default function TicketDetailScreen({ route, navigation }) {
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
      <View className={`mb-3 flex-row ${isSelf ? 'justify-end' : 'justify-start'}`}>
        <View 
          className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
            isSelf ? 'bg-[#7C3AED] rounded-tr-none' : 'bg-slate-900 rounded-tl-none border border-slate-800'
          }`}
        >
          {!isSelf && (
            <Text className="text-purple-400 font-extrabold text-[9px] uppercase mb-0.5">
              Support Staff
            </Text>
          )}
          <Text className="text-white text-xs leading-relaxed">{item.message}</Text>
          <Text className="text-slate-450 text-[7px] text-right mt-1 font-semibold uppercase">
            {new Date(item.sentAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  if (!ticket) {
    return (
      <View className="flex-1 bg-[#0B0F1A] justify-center items-center">
        <Text className="text-slate-450 text-sm font-semibold">Loading ticket log...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-[#0B0F1A]"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View className="bg-slate-950 p-4 border-b border-slate-900 flex-row items-center justify-between">
        <Pressable onPress={() => navigation.goBack()} className="p-1">
          <ArrowLeft size={20} color="#fff" />
        </Pressable>
        <View className="items-center flex-1 mx-2">
          <Text className="text-white font-extrabold text-sm uppercase tracking-wide" numberOfLines={1}>
            {ticket.subject}
          </Text>
          <Text className="text-slate-450 text-[9px] uppercase font-bold mt-0.5">Ticket ID: {ticket.ticketId}</Text>
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" colors={["#7C3AED"]} />
          }
        />
      </View>

      {ticket.status === 'closed' ? (
        <View className="p-4 bg-slate-950 items-center justify-center border-t border-slate-900">
          <Text className="text-red-400 font-extrabold text-xs uppercase tracking-wide">This ticket is closed</Text>
        </View>
      ) : (
        <View className="p-3 border-t border-slate-950 bg-slate-950 flex-row items-center">
          <TextInput
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Type your reply here..."
            placeholderTextColor="#64748B"
            style={{ flex: 1, backgroundColor: '#090d16', color: '#ffffff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, fontSize: 13, borderWidth: 1, borderColor: '#1e293b', marginRight: 8 }}
          />
          <Pressable 
            onPress={handleSendReply}
            disabled={loading}
            className="bg-[#7C3AED] w-11 h-11 rounded-xl items-center justify-center border border-purple-500 shadow-md shadow-purple-500/20"
          >
            <Send size={16} color="#fff" />
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
