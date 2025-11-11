import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AuthGate from '../screens/AuthGate';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="AuthGate" component={AuthGate} />
      </Stack.Navigator>
   
  );
}
