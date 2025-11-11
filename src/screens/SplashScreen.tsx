// src/screens/SplashScreen.tsx (updated)
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getAllTransactions } from '../services/db';
import { useStore } from '../store/useStore';
import { requestSmsPermission, startSmsListener } from '../services/smsReader';
import AuthGate from './AuthGate';

export default function SplashScreen({ navigation }: any) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
        setReady(true)
        navigation.replace('Onboarding')
    }, 3000);
  }, []);

  if (!ready) {
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        <Text style={{marginBottom:30,fontSize:24}}>Smart Expense Tracker</Text>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    null
  );
}
