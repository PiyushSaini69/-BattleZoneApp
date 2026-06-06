import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Clipboard, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { Send, Key, Copy, ArrowLeft } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function MatchRoomScreen({ route, navigation }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
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
            isSelf ? 'bg-[#7C3AED] rounded-tr-none' : 'bg-slate-200 dark:bg-slate-900 rounded-tl-none border border-slate-350 dark:border-slate-800'
          }`}
        >
          {!isSelf && (
            <Text className="text-purple-600 dark:text-purple-400 font-extrabold text-[9px] uppercase mb-1">{item.username}</Text>
          )}
          <Text className={`text-xs leading-relaxed ${isSelf ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{item.message}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-slate-50 dark:bg-[#0B0F1A]"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View className="bg-white dark:bg-slate-955 p-4 border-b border-slate-200 dark:border-slate-900 flex-row items-center justify-between">
        <Pressable onPress={() => navigation.goBack()} className="p-1">
          <ArrowLeft size={20} color={isDark ? '#fff' : '#0F172A'} />
        </Pressable>
        <View className="items-center flex-1 mx-2">
          <Text className="text-slate-900 dark:text-white font-extrabold text-sm uppercase tracking-wide" numberOfLines={1}>
            {tournament?.title || 'Lobby Details'}
          </Text>
          <Text style={{ color: isDark ? '#94A3B8' : '#475569', fontSize: 9, textTransform: 'uppercase', fontWeight: 'bold', marginTop: 2 }}>Match Room Lobby</Text>
        </View>
        <Badge text="live chat" variant="danger" />
      </View>

      <View 
        className="p-4 border-b border-slate-200 dark:border-slate-950"
        style={{ backgroundColor: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(241, 245, 249, 0.5)' }}
      >
        <GlassCard 
          className="p-4 border border-transparent"
          style={{
            backgroundColor: isDark ? 'rgba(124, 58, 237, 0.05)' : 'rgba(124, 58, 237, 0.03)',
          }}
        >
          <View className="flex-row items-center mb-3">
            <Key size={16} color={isDark ? '#C084FC' : '#7C3AED'} style={{ marginRight: 6 }} />
            <Text className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-wider">Custom Game Room Details</Text>
          </View>
          
          {roomDetails && roomDetails.roomId ? (
            <View className="flex-row justify-between space-x-3">
              <View className="flex-1 bg-slate-200/50 dark:bg-slate-950 border border-slate-300 dark:border-slate-850 p-3 rounded-xl flex-row justify-between items-center">
                <View className="flex-1 mr-2">
                  <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase font-bold">Room ID</Text>
                  <Text className="text-slate-900 dark:text-white text-sm font-black mt-0.5" numberOfLines={1}>{roomDetails.roomId}</Text>
                </View>
                <Pressable onPress={() => copyToClipboard(roomDetails.roomId, 'Room ID')} className="p-1.5 bg-slate-300/40 dark:bg-slate-900 rounded-lg">
                  <Copy size={14} color={isDark ? '#94A3B8' : '#475569'} />
                </Pressable>
              </View>

              <View className="flex-1 bg-slate-200/50 dark:bg-slate-950 border border-slate-300 dark:border-slate-850 p-3 rounded-xl flex-row justify-between items-center">
                <View className="flex-1 mr-2">
                  <Text className="text-slate-500 dark:text-slate-400 text-[8px] uppercase font-bold">Room Password</Text>
                  <Text className="text-slate-900 dark:text-white text-sm font-black mt-0.5" numberOfLines={1}>{roomDetails.roomPassword}</Text>
                </View>
                <Pressable onPress={() => copyToClipboard(roomDetails.roomPassword, 'Room Password')} className="p-1.5 bg-slate-300/40 dark:bg-slate-900 rounded-lg">
                  <Copy size={14} color={isDark ? '#94A3B8' : '#475569'} />
                </Pressable>
              </View>
            </View>
          ) : (
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold text-center py-2.5">
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
              <Text className="text-slate-600 dark:text-slate-500 text-xs font-bold uppercase tracking-widest text-center mb-1">🎮 Chat Lobby Ready</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-[10px] text-center max-w-[200px] leading-relaxed">Coordinate matches and discuss rules with active lobby players in real-time!</Text>
            </View>
          }
        />
      </View>

      <View className="p-3 border-t border-slate-200 dark:border-slate-950 bg-white dark:bg-slate-950 flex-row items-center">
        <TextInput
          value={chatInput}
          onChangeText={setChatInput}
          placeholder="Send message to lobby..."
          placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
          style={{ 
            flex: 1, 
            backgroundColor: isDark ? '#090d16' : '#f1f5f9', 
            color: isDark ? '#ffffff' : '#0F172A', 
            borderRadius: 12, 
            paddingHorizontal: 16, 
            paddingVertical: 10, 
            fontSize: 13, 
            borderWidth: 1, 
            borderColor: isDark ? '#1e293b' : '#cbd5e1', 
            marginRight: 8 
          }}
        />
        <Pressable 
          onPress={handleSendMessage}
          style={{
            backgroundColor: '#7C3AED',
            width: 44,
            height: 44,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#8b5cf6',
          }}
        >
          <Send size={16} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
