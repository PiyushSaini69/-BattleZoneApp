import React, { useContext } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/main/HomeScreen';
import TournamentsScreen from '../screens/main/TournamentsScreen';
import WalletScreen from '../screens/main/WalletScreen';
import LeaderboardScreen from '../screens/main/LeaderboardScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import { Home, Trophy, Wallet as WalletIcon, Award, User, Shield } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import { useColorScheme } from 'nativewind';

const Tab = createBottomTabNavigator();

export default function BottomTabNav() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useContext(AuthContext);
  const isAdmin = user && ['admin', 'superadmin', 'moderator'].includes(user.role);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          const iconSize = 20;
          let iconComponent;
          switch (route.name) {
            case 'HomeTab':
              iconComponent = <Home size={iconSize} color={color} />;
              break;
            case 'TournamentsTab':
              iconComponent = <Trophy size={iconSize} color={color} />;
              break;
            case 'WalletTab':
              iconComponent = <WalletIcon size={iconSize} color={color} />;
              break;
            case 'LeaderboardTab':
              iconComponent = <Award size={iconSize} color={color} />;
              break;
            case 'ProfileTab':
              iconComponent = <User size={iconSize} color={color} />;
              break;
            case 'AdminTab':
              iconComponent = <Shield size={iconSize} color={color} />;
              break;
            default:
              iconComponent = null;
          }

          if (focused && isDark) {
            return (
              <View className="items-center justify-center relative">
                {iconComponent}
                <View 
                  className="w-1 h-1 rounded-full bg-cyan-400 absolute -bottom-2" 
                  style={{
                    shadowColor: '#00E5FF',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.9,
                    shadowRadius: 4,
                    elevation: 3,
                  }} 
                />
              </View>
            );
          }
          return iconComponent;
        },
        tabBarActiveTintColor: isDark ? '#00E5FF' : '#7C3AED',
        tabBarInactiveTintColor: isDark ? '#4B5563' : '#94A3B8',
        tabBarStyle: {
          backgroundColor: isDark ? 'rgba(10, 14, 26, 0.96)' : '#ffffff',
          borderTopWidth: 1,
          borderTopColor: isDark ? 'rgba(0, 229, 255, 0.15)' : '#e2e8f0',
          height: 74,
          paddingBottom: 14,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: 'extrabold',
          textTransform: 'uppercase',
          letterSpacing: 0.75,
        },
        headerStyle: {
          backgroundColor: isDark ? '#060A13' : '#f8fafc',
          borderBottomWidth: 1,
          borderBottomColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#e2e8f0',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: isDark ? '#ffffff' : '#0f172a',
          fontWeight: '900',
          fontSize: 16,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
        },
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ title: 'Home', headerShown: false }} 
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
      {isAdmin && (
        <Tab.Screen 
          name="AdminTab" 
          component={AdminDashboardScreen} 
          options={{ title: 'Admin', headerTitle: 'Admin Panel', headerShown: false }} 
        />
      )}
    </Tab.Navigator>
  );
}
