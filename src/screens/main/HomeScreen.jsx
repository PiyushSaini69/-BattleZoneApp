import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, RefreshControl, Image, useColorScheme as useRNColorScheme } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { request } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import { Trophy } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [announcements, setAnnouncements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHomeData = async () => {
    try {
      const res = await request('/admin/announcements');
      if (res.success) setAnnouncements(res.data);
    } catch (e) {
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const { colorScheme } = useColorScheme();
  const systemScheme = useRNColorScheme();
  const isDark = colorScheme === 'system' ? systemScheme === 'dark' : colorScheme === 'dark';

  return (
    <LinearGradient
      colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
      className="flex-1"
    >
      <View className="px-4">
        <Header navigation={navigation} />
      </View>
      <ScrollView 
        className="flex-1" 
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={isDark ? "#00E5FF" : "#7C3AED"} 
            colors={[isDark ? "#00E5FF" : "#7C3AED"]} 
            progressBackgroundColor={isDark ? "#0A0E1A" : "#FFFFFF"}
          />
        }
        contentContainerStyle={{ 
          paddingHorizontal: 16, 
          paddingBottom: 100 
        }}
      >

        <View 
          className="rounded-2xl overflow-hidden mt-2 mb-4"
        >
          <Pressable 
            onPress={() => navigation.navigate('TournamentsTab')}
            className="w-full justify-center items-center bg-black"
            style={{ aspectRatio: 2 }}
          >
            <Image 
              source={require('../../../assets/free_fire_banner.jpg')} 
              className="w-full h-full"
              resizeMode="stretch"
            />
          </Pressable>
        </View>

        <GlassCard 
          className="p-5 items-center mt-2 mb-6"
          glowColor="cyan"
        >
          <Trophy size={38} color={isDark ? "#00E5FF" : "#0891B2"} style={isDark ? {
            shadowColor: '#00E5FF',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 8,
          } : {}} />
          <Text className="text-slate-900 dark:text-white font-black text-lg mt-3 text-center uppercase tracking-wider">JOIN LIVE TOURNAMENTS</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-xs text-center mt-1.5 mb-5 leading-relaxed px-2">
            Compete against players across India for real prize money pools!
          </Text>
          <Button 
            title="Explore Tournaments"
            onPress={() => navigation.navigate('TournamentsTab')}
            variant="primary"
            className="w-full"
          />
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}
