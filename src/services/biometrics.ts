import * as Keychain from 'react-native-keychain';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export async function isBiometricAvailable() {
  const { available } = await rnBiometrics.isSensorAvailable();
  return available;
}

export async function promptBiometric(promptMessage: string) {
  try {
    const result = await rnBiometrics.simplePrompt({ promptMessage });
    return result.success;
  } catch (e) {
    return false;
  }
}

export async function savePin(pin: string) {
  await Keychain.setGenericPassword('user', pin, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  });
}

export async function getSavedPin() {
  const creds = await Keychain.getGenericPassword();
  return creds ? creds.password : null;
}
