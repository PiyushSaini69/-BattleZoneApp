import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import BottomTabNav from './BottomTabNav';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';
import TournamentDetailScreen from '../screens/tournament/TournamentDetailScreen';
import RegisterTournamentScreen from '../screens/tournament/RegisterTournamentScreen';
import MatchRoomScreen from '../screens/tournament/MatchRoomScreen';
import ViewResultsScreen from '../screens/tournament/ViewResultsScreen';
import SupportScreen from '../screens/support/SupportScreen';
import TicketDetailScreen from '../screens/support/TicketDetailScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import CreateTournamentScreen from '../screens/admin/CreateTournamentScreen';
import DeclareResultsScreen from '../screens/admin/DeclareResultsScreen';
import TermsScreen from '../screens/support/TermsScreen';
import PrivacyScreen from '../screens/support/PrivacyScreen';
import AboutUsScreen from '../screens/support/AboutUsScreen';
import NotificationScreen from '../screens/main/NotificationScreen';
import AddCoinScreen from '../screens/main/AddCoinScreen';
import RedeemCoinScreen from '../screens/main/RedeemCoinScreen';
import TransactionsScreen from '../screens/main/TransactionsScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import MyStatisticsScreen from '../screens/main/MyStatisticsScreen';
import { ActivityIndicator } from 'react-native';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loadingUser } = useContext(AuthContext);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (loadingUser) {
    return (
      <LinearGradient
        colors={isDark ? ['#060A13', '#0D1321'] : ['#F8FAFC', '#E2E8F0']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color={isDark ? '#00E5FF' : '#7C3AED'} />
      </LinearGradient>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user === null ? (
        // Unauthenticated Flow
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        </>
      ) : (
        // Authenticated Flow
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNav} />
          
          <Stack.Screen name="TournamentDetail" component={TournamentDetailScreen} />
          <Stack.Screen name="RegisterTournament" component={RegisterTournamentScreen} />
          <Stack.Screen name="MatchRoom" component={MatchRoomScreen} />
          <Stack.Screen name="ViewResults" component={ViewResultsScreen} />
          
          <Stack.Screen name="Support" component={SupportScreen} />
          <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
          
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="CreateTournament" component={CreateTournamentScreen} />
          <Stack.Screen name="DeclareResults" component={DeclareResultsScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          
          <Stack.Screen name="AddCoin" component={AddCoinScreen} />
          <Stack.Screen name="RedeemCoin" component={RedeemCoinScreen} />
          <Stack.Screen name="Transactions" component={TransactionsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="MyStatistics" component={MyStatisticsScreen} />
        </>
      )}
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
    </Stack.Navigator>
  );
}
