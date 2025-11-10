// src/screens/OnboardingScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { requestSmsPermission, startSmsListener } from '../services/smsReader';

export default function OnboardingScreen({ navigation }: any) {
  const handleContinue = async () => {
    // const granted = await requestSmsPermission();
    // if (granted) {
    //   startSmsListener();
    // }
    // navigation.replace('Dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Smart Expense Tracker 💼</Text>
      <Text style={styles.desc}>
        This app automatically tracks your bank transactions by reading SMS messages securely on your device.
      </Text>

      <Text style={styles.note}>
        🔒 We do not upload any SMS or data to the cloud. Everything stays on your device.
      </Text>

      <Button title="Continue" onPress={handleContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  desc: { textAlign: 'center', fontSize: 16, marginBottom: 20, color: '#555' },
  note: { textAlign: 'center', fontSize: 14, color: '#888', marginBottom: 30 },
});
