import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getAllTransactions } from '../services/db';
import { useStore } from '../store/useStore';
import { requestSmsPermission, startSmsListener } from '../services/smsReader';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    let isMounted = true;

    async function init() {
      const list = await getAllTransactions();
      if (isMounted) useStore.getState().setTransactions(list);

      const hasSms = await requestSmsPermission();
      if (hasSms && isMounted) {
        console.log('📲 Initializing SMS listener...');
        startSmsListener();
      }

      navigation.replace('Dashboard');
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Smart Expense Tracker</Text>
      <ActivityIndicator style={{ marginTop: 10 }} />
    </View>
  );
}
