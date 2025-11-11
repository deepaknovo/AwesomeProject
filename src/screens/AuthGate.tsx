// src/screens/AuthGate.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  isBiometricAvailable,
  promptBiometric,
  savePin,
  getSavedPin,
} from '../services/biometrics';

export default function AuthGate({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(true);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinExists, setPinExists] = useState(false);
  const [firstTimeSetup, setFirstTimeSetup] = useState(false);
  const [newPin, setNewPin] = useState('');

  useEffect(() => {
    (async () => {
      const savedPin = await getSavedPin();
      setPinExists(!!savedPin);

      const biometricSupported = await isBiometricAvailable();

      if (savedPin) {
        // Existing PIN → try biometric first
        if (biometricSupported) {
          const ok = await promptBiometric('Unlock Smart Expense Tracker');
          if (ok) return onSuccess();
          // Biometric failed → fallback to PIN input
          setShowPinInput(true);
        } else {
          setShowPinInput(true);
        }
      } else {
        // First time user → ask to setup PIN and optionally enable biometrics
        setFirstTimeSetup(true);
      }

      setLoading(false);
    })();
  }, []);

  const handlePinCheck = async () => {
    const saved = await getSavedPin();
    if (pinInput === saved) {
      onSuccess();
    } else {
      Alert.alert('Incorrect PIN', 'Please try again.');
      setPinInput('');
    }
  };

  const handleFirstTimeSetup = async () => {
    if (newPin.length < 4) {
      Alert.alert('PIN too short', 'Please enter a PIN of at least 4 digits.');
      return;
    }
    await savePin(newPin);
    Alert.alert(
      'Setup Complete',
      'You can now use biometric authentication next time (if supported).',
      [{ text: 'OK', onPress: () => onSuccess() }]
    );
  };

  if (loading) {
    return (
      <View style={{flex:1, alignItems:'center', marginTop:100}}>
             <Text style={{marginBottom:30,fontSize:24}}>Smart Expense Tracker</Text>
              
            </View>
    );
  }

  if (firstTimeSetup) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 12 }}>
          Welcome! Please set a PIN for your app:
        </Text>
        <TextInput
          value={newPin}
          onChangeText={setNewPin}
          keyboardType="numeric"
          secureTextEntry
          placeholder="Enter PIN"
          style={{
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        />
        <Button title="Save PIN" onPress={handleFirstTimeSetup} />
      </View>
    );
  }

  if (showPinInput) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ marginBottom: 8 }}>Enter your PIN</Text>
        <TextInput
          value={pinInput}
          onChangeText={setPinInput}
          keyboardType="numeric"
          secureTextEntry
          style={{ borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 }}
        />
        <Button title="Unlock" onPress={handlePinCheck} />
      </View>
    );
  }

  // Should not reach here unless biometric already succeeded
  return null;
}
