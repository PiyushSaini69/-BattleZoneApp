import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { SocketProvider } from './src/context/SocketContext';
import AppNavigator from './src/navigation/AppNavigator';



export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <SocketProvider>
            <AppNavigator />
            <StatusBar style="light" backgroundColor="#090d16" />
          </SocketProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
