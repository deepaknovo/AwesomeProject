import SmsListener from '@ernestbies/react-native-android-sms-listener'
import { parseBankSms } from './smsParser';
import { Transaction } from '../types';
import { insertTransaction } from './db';
import { useStore } from '../store/useStore';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

export async function requestSmsPermission() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
    ]);

    if (
      granted['android.permission.READ_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.RECEIVE_SMS'] === PermissionsAndroid.RESULTS.GRANTED
    ) { 
        return true;
      console.log('✅ SMS permissions granted');
    } else {        
      console.log('❌ SMS permissions denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

/**
 * Start listening to incoming SMS and also read initial inbox via native module if available.
 * react-native-sms-receiver only listens to incoming messages.
 */
export function startSmsListener() {
  if (Platform.OS !== 'android') return;
  SmsListener.addListener((msg: { body: string; originatingAddress: string | undefined; }) => {
    // msg = { originatingAddress, body }
    try {
      const parsed = parseBankSms(msg.body, msg.originatingAddress);
      console.log('Parsed SMS:', parsed);
    //   Alert.alert('New Transaction Detected', JSON.stringify(parsed));
      if (parsed) {
        const tx: Transaction = {
          id: String(Date.now()) + Math.random(),
          amount: parsed.amount,
          type: parsed.type,
          date: parsed.date.toISOString(),
          bank: parsed.bank,
          description: parsed.description,
          category: undefined, 
          source: 'sms',
        };
        // Insert into DB and also update app store
        insertTransaction(tx);
        useStore.getState().addTransaction(tx);
      }
    } catch (e) {
      console.warn('SMS parse error', e);
    }
  });
  return () => SmsListener.remove();
}
