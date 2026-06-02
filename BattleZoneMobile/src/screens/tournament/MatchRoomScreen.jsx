import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Clipboard, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { Send, Key, Copy, ArrowLeft } from 'lucide-react-native';

export default function MatchRoomScreen({ route, navigation }) {
  const { tournamentId } = route.params;
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const [tournament, setTournament] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const flatListRef = useRef(null);

  const loadLobbyDetails = async () => {
    try {
      const res = await request(`/tournaments/${tournamentId}/room`);
      if (res.success) {
        setRoomDetails(res.data);
      }

      const tournsRes = await request(`/tournaments`);
      if (tournsRes.success) {
        const found = tournsRes.data.tournaments.find(x => x._id === tournamentId);
        if (found) setTournament(found);
      }
    } catch (e) {
      console.log('Error loading lobby details:', e.message);
    }
  };

  useEffect(() => {
    loadLobbyDetails();
  }, [tournamentId]);

  useEffect(() => {
    if (socket) {
      socket.emit('join:room_chat', tournamentId);
      setChatMessages([]);

      socket.on('room:message', (msg) => {
        setChatMessages((prev) => [...prev, msg]);
      });

      socket.on('tournament:room_update', (data) => {
        if (data.tournamentId === tournamentId) {
          loadLobbyDetails();
          Alert.alert('Room Updated 🔑', 'The custom game Room ID and Password details have been updated by the moderator.');
        }
      });

      return () => {
        socket.off('room:message');
        socket.off('tournament:room_update');
      };
    }
  }, [socket, tournamentId]);

  const handleSendMessage = () => {
    if (!chatInput.trim() || !socket || !user) return;
    
    socket.emit('send:message', {
      tournamentId,
      username: user.username,
      message: chatInput.trim(),
      avatar: user.avatar
    });
    setChatInput('');
  };

  const copyToClipboard = (text, label) => {
    Clipboard.setString(text);
    Alert.alert('Copied! 📋', `${label} has been copied to your clipboard.`);
  };

  const renderMessage = ({ item }) => {
    const isSelf = item.username === user?.username;

    return (
      <View className={`mb-3.5 flex-row ${isSelf ? 'justify-end' : 'justify-start'}`}>
        <View 
          className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
            isSelf ? 'bg-[#7C3AED] rounded-tr-none' : 'bg-slate-900 rounded-tl-none border border-slate-800'
          }`}
        >
          {!isSelf && (
            <Text className="text-purple-400 font-extrabold text-[9px] uppercase mb-1">{item.username}</Text>
          )}
          <Text className="text-white text-xs leading-relaxed">{item.message}</Text>
        </View>
      </View>
    );
  };

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
            {tournament?.title || 'Lobby Details'}
          </Text>
          <Text className="text-slate-450 text-[9px] uppercase font-bold mt-0.5">Match Room Lobby</Text>
        </View>
        <Badge text="live chat" variant="danger" />
      </View>

      <View className="p-4 bg-slate-900/30 border-b border-slate-950">
        <GlassCard className="p-4 bg-[#7C3AED]/5 border-purple-500/20">
          <View className="flex-row items-center mb-3">
            <Key size={16} color="#C084FC" style={{ marginRight: 6 }} />
            <Text className="text-white font-black text-xs uppercase tracking-wider">Custom Game Room Details</Text>
          </View>
          
          {roomDetails && roomDetails.roomId ? (
            <View className="flex-row justify-between space-x-3">
              <View className="flex-1 bg-slate-950 border border-slate-850 p-3 rounded-xl flex-row justify-between items-center">
                <View className="flex-1 mr-2">
                  <Text className="text-slate-450 text-[8px] uppercase font-bold">Room ID</Text>
                  <Text className="text-white text-sm font-black mt-0.5" numberOfLines={1}>{roomDetails.roomId}</Text>
                </View>
                <Pressable onPress={() => copyToClipboard(roomDetails.roomId, 'Room ID')} className="p-1.5 bg-slate-900 rounded-lg">
                  <Copy size={14} color="#94A3B8" />
                </Pressable>
              </View>

              <View className="flex-1 bg-slate-950 border border-slate-850 p-3 rounded-xl flex-row justify-between items-center">
                <View className="flex-1 mr-2">
                  <Text className="text-slate-450 text-[8px] uppercase font-bold">Room Password</Text>
                  <Text className="text-white text-sm font-black mt-0.5" numberOfLines={1}>{roomDetails.roomPassword}</Text>
                </View>
                <Pressable onPress={() => copyToClipboard(roomDetails.roomPassword, 'Room Password')} className="p-1.5 bg-slate-900 rounded-lg">
                  <Copy size={14} color="#94A3B8" />
                </Pressable>
              </View>
            </View>
          ) : (
            <Text className="text-slate-450 text-xs font-semibold text-center py-2.5">
              🔑 Room details will unlock here automatically when match is live!
            </Text>
          )}
        </GlassCard>
      </View>

      <View className="flex-1 px-4 py-2">
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingVertical: 10 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View className="py-20 items-center">
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest text-center mb-1">🎮 Chat Lobby Ready</Text>
              <Text className="text-slate-450 text-[10px] text-center max-w-[200px] leading-relaxed">Coordinate matches and discuss rules with active lobby players in real-time!</Text>
            </View>
          }
        />
      </View>

      <View className="p-3 border-t border-slate-950 bg-slate-950 flex-row items-center">
        <TextInput
          value={chatInput}
          onChangeText={setChatInput}
          placeholder="Send message to lobby..."
          placeholderTextColor="#64748B"
          style={{ flex: 1, backgroundColor: '#090d16', color: '#ffffff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, fontSize: 13, borderWidth: 1, borderColor: '#1e293b', marginRight: 8 }}
        />
        <Pressable 
          onPress={handleSendMessage}
          className="bg-[#7C3AED] w-11 h-11 rounded-xl items-center justify-center border border-purple-500 shadow-md shadow-purple-500/20"
        >
          <Send size={16} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
