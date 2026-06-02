import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import BottomTabNav from './BottomTabNav';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import TournamentDetailScreen from '../screens/tournament/TournamentDetailScreen';
import MatchRoomScreen from '../screens/tournament/MatchRoomScreen';
import SupportScreen from '../screens/support/SupportScreen';
import TicketDetailScreen from '../screens/support/TicketDetailScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import CreateTournamentScreen from '../screens/admin/CreateTournamentScreen';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loadingUser } = useContext(AuthContext);

  if (loadingUser) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0B0F1A', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user === null ? (
        // Unauthenticated Flow
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        // Authenticated Flow
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNav} />
          
          <Stack.Screen name="TournamentDetail" component={TournamentDetailScreen} />
          <Stack.Screen name="MatchRoom" component={MatchRoomScreen} />
          
          <Stack.Screen name="Support" component={SupportScreen} />
          <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
          
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="CreateTournament" component={CreateTournamentScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
