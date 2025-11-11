// src/screens/OnboardingScreen.tsx (updated)
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getAllTransactions } from '../services/db';
import { useStore } from '../store/useStore';
import { requestSmsPermission, startSmsListener } from '../services/smsReader';
import AuthGate from './AuthGate';

export default function OnboardingScreen({ navigation }: any) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      const list = await getAllTransactions();
      useStore.getState().setTransactions(list);
      const hasSms = await requestSmsPermission();
      if (hasSms) startSmsListener();
      // Delay navigation until AuthGate calls onSuccess
      setReady(true);
    }
    init();
  }, []);

  if (!ready) {
    return (
      <View style={{flex:1, alignItems:'center', marginTop:100}}>
       <Text style={{marginBottom:30,fontSize:24}}>Smart Expense Tracker</Text>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <AuthGate onSuccess={() => navigation.replace('Dashboard')} />
  );
}
