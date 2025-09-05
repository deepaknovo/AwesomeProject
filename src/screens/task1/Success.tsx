import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
 
export default function SuccessScreen() {
    const navigation = useNavigation<any>();
  const handleContinue = () => {
    navigation.navigate('Gallery');
  };
 
  const handleTakeAnother = () => {
    navigation.navigate('FaceUpload');
  };
 
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <Image
            source={require('../../../assets/images/success.png')}
            style={styles.successIcon}
          />
        </View>
        
        <Text style={styles.successTitle}>Selfie captured perfectly!</Text>
        <Text style={styles.successSubtitle}>
          Let's build your own fashion avatar.
        </Text>
        
        <View style={styles.progressIndicator}>
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={[styles.progressLine, styles.activeDot]} />
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={[styles.progressLine , styles.activeDot]} />
          <View style={[styles.progressDot, styles.activeDot]} />
        </View>
        
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}>
          <Text style={styles.continueButtonText}>View Gallery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleTakeAnother}>
          <Text style={styles.secondaryButtonText}>Take Another Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  successIcon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  activeDot: {
    backgroundColor: '#10B981',
  },
  progressLine: {
    width: 30,
    height: 2,
    backgroundColor: '#E5E7EB',
  },
  continueButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#000000',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 16,
  },
  secondaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});