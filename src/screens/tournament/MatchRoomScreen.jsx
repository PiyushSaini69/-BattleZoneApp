import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Clipboard, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import { Send, Key, Copy, ArrowLeft, Lock } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MatchRoomScreen({ route, navigation }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { tournamentId } = route.params;
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const [tournament, setTournament] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(true);

  const flatListRef = useRef(null);

  const formatTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes} ${ampm}`;
    } catch (e) {
      return '';
    }
  };

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

  const loadChatHistory = async () => {
    try {
      setLoadingChat(true);
      const res = await request(`/tournaments/${tournamentId}/chat`);
      if (res.success) {
        setChatMessages(res.data);
      }
    } catch (e) {
      console.log('Error loading chat history:', e.message);
    } finally {
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    loadLobbyDetails();
    loadChatHistory();
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
      userId: user.id || user._id,
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
    if (item.isSystem) {
      return (
        <View className="items-center my-3 px-4">
          <View className="bg-slate-100/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-full px-4 py-1.5 shadow-sm">
            <Text className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-center">
              {item.message}
            </Text>
          </View>
        </View>
      );
    }

    const isSelf = item.username === user?.username;
    const timeStr = formatTime(item.createdAt || new Date());

    return (
      <View className={`mb-3.5 flex-row ${isSelf ? 'justify-end' : 'justify-start'}`}>
        {isSelf ? (
          <LinearGradient
            colors={['#8B5CF6', '#6D28D9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="max-w-[80%] rounded-2xl px-4 py-2.5 rounded-tr-none shadow-sm"
          >
            <Text className="text-xs leading-relaxed text-white pr-2">{item.message}</Text>
            <Text className="text-[8px] text-slate-200/70 text-right mt-1 font-semibold">{timeStr}</Text>
          </LinearGradient>
        ) : (
          <View 
            className="max-w-[80%] rounded-2xl px-4 py-2.5 rounded-tl-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <Text className="text-rose-500 dark:text-cyan-400 font-black text-[9px] uppercase mb-1 tracking-wide">{item.username}</Text>
            <Text className="text-xs leading-relaxed text-slate-800 dark:text-slate-100 pr-2">{item.message}</Text>
            <Text className="text-[8px] text-slate-400 dark:text-slate-550 text-right mt-1 font-semibold">{timeStr}</Text>
          </View>
        )}
      </View>
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
        {/* Header bar */}
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
              {tournament?.title || 'Lobby Details'}
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[9px] uppercase font-bold tracking-widest mt-0.5">Match Room Lobby</Text>
          </View>
          <Badge text="live chat" variant="danger" />
        </View>

        {/* Custom Game details block */}
        <View className="p-4 border-b border-slate-200 dark:border-slate-900 bg-transparent">
          <GlassCard className="p-4" glowColor="purple">
            <View className="flex-row items-center mb-3">
              <Key size={16} color={isDark ? '#00E5FF' : '#7C3AED'} style={{ marginRight: 6 }} />
              <Text className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-wider">Custom Game Room Details</Text>
            </View>
            
            {roomDetails && roomDetails.roomId ? (
              <View className="flex-row justify-between" style={{ gap: 10 }}>
                <View className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex-row justify-between items-center">
                  <View className="flex-1 mr-2">
                    <Text className="text-slate-400 dark:text-slate-500 text-[8px] uppercase font-bold tracking-wider">Room ID</Text>
                    <Text className="text-slate-900 dark:text-white text-sm font-black mt-0.5" numberOfLines={1}>{roomDetails.roomId}</Text>
                  </View>
                  <Pressable 
                    onPress={() => copyToClipboard(roomDetails.roomId, 'Room ID')} 
                    className="p-1.5 bg-slate-200 dark:bg-slate-900 rounded-lg"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Copy size={13} color={isDark ? '#00E5FF' : '#7C3AED'} />
                  </Pressable>
                </View>

                <View className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex-row justify-between items-center">
                  <View className="flex-1 mr-2">
                    <Text className="text-slate-400 dark:text-slate-500 text-[8px] uppercase font-bold tracking-wider">Room Password</Text>
                    <Text className="text-slate-900 dark:text-white text-sm font-black mt-0.5" numberOfLines={1}>{roomDetails.roomPassword}</Text>
                  </View>
                  <Pressable 
                    onPress={() => copyToClipboard(roomDetails.roomPassword, 'Room Password')} 
                    className="p-1.5 bg-slate-200 dark:bg-slate-900 rounded-lg"
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Copy size={13} color={isDark ? '#00E5FF' : '#7C3AED'} />
                  </Pressable>
                </View>
              </View>
            ) : (
              <View className="flex-row items-center justify-center py-3 bg-slate-100/50 dark:bg-slate-950/50 rounded-xl border border-dashed border-slate-350 dark:border-slate-800">
                <Lock size={14} color={isDark ? '#64748B' : '#94A3B8'} style={{ marginRight: 6 }} />
                <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold text-center">
                  Room details will unlock automatically when live!
                </Text>
              </View>
            )}
          </GlassCard>
        </View>

        {/* Chat message lobby */}
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
              loadingChat ? (
                <View className="py-20 items-center px-4">
                  <ActivityIndicator size="small" color={isDark ? '#00E5FF' : '#7C3AED'} />
                  <Text className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider mt-3">Syncing chat feed...</Text>
                </View>
              ) : (
                <View className="py-20 items-center px-4">
                  <Text className="text-slate-800 dark:text-slate-200 text-sm font-extrabold uppercase tracking-widest text-center mb-1.5">🎮 Chat Lobby Ready</Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs text-center max-w-[240px] leading-relaxed">Coordinate matches and discuss rules with active lobby players in real-time!</Text>
                </View>
              )
            }
          />
        </View>

        {/* Chat Input Bar */}
        <View 
          style={{ paddingBottom: insets.bottom > 0 ? insets.bottom + 6 : 12 }}
          className="p-3 border-t border-slate-250 dark:border-slate-900 bg-white/95 dark:bg-slate-950/80 flex-row items-center"
        >
          <TextInput
            value={chatInput}
            onChangeText={setChatInput}
            placeholder="Send message to lobby..."
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            style={{ 
              flex: 1, 
              backgroundColor: isDark ? '#090d16' : '#F1F5F9', 
              color: isDark ? '#ffffff' : '#0F172A', 
              borderRadius: 12, 
              paddingHorizontal: 16, 
              paddingVertical: 10, 
              fontSize: 13, 
              borderWidth: 1, 
              borderColor: isDark ? 'rgba(0, 229, 255, 0.2)' : '#CBD5E1', 
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
              borderColor: '#8B5CF6',
            }}
          >
            <Send size={16} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
