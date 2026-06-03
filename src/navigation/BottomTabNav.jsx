import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/main/HomeScreen';
import TournamentsScreen from '../screens/main/TournamentsScreen';
import WalletScreen from '../screens/main/WalletScreen';
import LeaderboardScreen from '../screens/main/LeaderboardScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { Home, Trophy, Wallet as WalletIcon, Award, User } from 'lucide-react-native';

import { useColorScheme } from 'nativewind';

const Tab = createBottomTabNavigator();

export default function BottomTabNav() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          const iconSize = 20;
          switch (route.name) {
            case 'HomeTab':
              return <Home size={iconSize} color={color} />;
            case 'TournamentsTab':
              return <Trophy size={iconSize} color={color} />;
            case 'WalletTab':
              return <WalletIcon size={iconSize} color={color} />;
            case 'LeaderboardTab':
              return <Award size={iconSize} color={color} />;
            case 'ProfileTab':
              return <User size={iconSize} color={color} />;
            default:
              return null;
          }
        },
        tabBarActiveTintColor: isDark ? '#C084FC' : '#7C3AED',
        tabBarInactiveTintColor: isDark ? '#64748B' : '#94A3B8',
        tabBarStyle: {
          backgroundColor: isDark ? '#090d16' : '#ffffff',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#1e293b' : '#e2e8f0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
        headerStyle: {
          backgroundColor: isDark ? '#0B0F1A' : '#f8fafc',
          borderBottomWidth: 1,
          borderBottomColor: isDark ? '#1e293b' : '#e2e8f0',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: isDark ? '#ffffff' : '#0f172a',
          fontWeight: '900',
          fontSize: 16,
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ title: 'Home', headerTitle: 'BattleZone Hub' }} 
      />
      <Tab.Screen 
        name="TournamentsTab" 
        component={TournamentsScreen} 
        options={{ title: 'Arenas', headerTitle: 'Arenas Catalog' }} 
      />
      <Tab.Screen 
        name="WalletTab" 
        component={WalletScreen} 
        options={{ title: 'Wallet', headerTitle: 'Gamer Wallet' }} 
      />
      <Tab.Screen 
        name="LeaderboardTab" 
        component={LeaderboardScreen} 
        options={{ title: 'Leaderboard', headerTitle: 'Global Ranks' }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ title: 'Profile', headerTitle: 'Warrior Profile' }} 
      />
    </Tab.Navigator>
  );
}
