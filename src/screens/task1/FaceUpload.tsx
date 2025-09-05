import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  launchCamera,
  launchImageLibrary,
  ImageLibraryOptions,
  CameraOptions,
  Asset,
} from 'react-native-image-picker';

const { width: screenWidth } = Dimensions.get('window');

interface SelectedImage {
  uri: string;
  fileName: string;
  size: number;
}

interface StoredImage {
  id: string;
  uri: string;
  fileName: string;
  uploadDate: string;
  size: number;
}

export default function FaceUploadScreen() {
  const navigation = useNavigation<any>();

  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const progressAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);

  const pickImageFromGallery = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.8,
    };

    const result = await launchImageLibrary(options);
    if (result.assets && result.assets[0]) {
      const asset: Asset = result.assets[0];
      setSelectedImage({
        uri: asset.uri ?? '',
        fileName: asset.fileName ?? 'face-image.jpg',
        size: asset.fileSize ?? 0,
      });
    }
  };

  const takePhotoWithCamera = async () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.8,
      cameraType: 'front',
    };

    const result = await launchCamera(options);
    if (result.assets && result.assets[0]) {
      const asset: Asset = result.assets[0];
      setSelectedImage({
        uri: asset.uri ?? '',
        fileName: asset.fileName ?? 'selfie.jpg',
        size: asset.fileSize ?? 0,
      });
    }
  };

  const simulateUpload = async () => {
    if (!selectedImage) return;

    setUploading(true);
    setUploadProgress(0);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 5 + 1;
      });
    }, 100);

    setTimeout(() => {
      setUploading(false);
      clearInterval(interval);
      setUploadProgress(100);
      saveImageToGallery();
      navigation.navigate('Success'); // ✅ navigate with React Navigation
    }, 3000);
  };

  const saveImageToGallery = async () => {
    if (!selectedImage) return;

    try {
      const newImage: StoredImage = {
        id: Date.now().toString(),
        uri: selectedImage.uri,
        fileName: selectedImage.fileName,
        uploadDate: new Date().toISOString(),
        size: selectedImage.size,
      };

      const existingImages = await AsyncStorage.getItem('uploadedImages');
      const images = existingImages ? JSON.parse(existingImages) : [];
      images.push(newImage);

      await AsyncStorage.setItem('uploadedImages', JSON.stringify(images));
    } catch (error) {
      console.error('Error saving image to gallery:', error);
    }
  };

  const resetUpload = () => {
    setSelectedImage(null);
    setUploading(false);
    setUploadProgress(0);
    progressAnim.setValue(0);
    scaleAnim.setValue(1);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Let's add a Photo</Text>
        {selectedImage && (
          <TouchableOpacity style={styles.closeButton} onPress={resetUpload}>
            {/* <X size={24} color="#000000" /> */}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {!selectedImage ? (
          <View style={styles.uploadArea}>
            <View style={styles.uploadOptions}>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImageFromGallery}>
                <View style={styles.buttonIcon}>
                  <Image 
                  style={{width:50, height:50}}
                  source={require("../../../assets/images/photo.png")}/>
                </View>
                <Text style={styles.buttonText}>From Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadButton} onPress={takePhotoWithCamera}>
                <View style={styles.buttonIcon}>
                  <Image 
                  style={{width:50, height:50}}
                  source={require("../../../assets/images/camera.png")}/>
                </View>
                <Text style={styles.buttonText}>Take a selfie</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.previewContainer}>
            <View style={styles.imagePreview}>
              <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
            </View>

            {uploading && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressTitle}>Uploading your photo...</Text>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        {
                          width: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          }),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressPercentage}>
                    {Math.min(Math.round(uploadProgress), 100)}%
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
        {!uploading && selectedImage && (
          <Animated.View style={[styles.uploadButtonContainer, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity style={styles.uploadActionButton} onPress={simulateUpload}>
              <Text style={styles.uploadActionText}>UPLOAD</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // same styles as before
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#000000' },
  closeButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, justifyContent: 'center' },
  uploadArea: { alignItems: 'center' },
  uploadOptions: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingHorizontal: 40 },
  uploadButton: { alignItems: 'center', gap: 16 },
  buttonIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonText: { fontSize: 16, fontWeight: '500', color: '#000000', textAlign: 'center' },
  previewContainer: { alignItems: 'center', justifyContent: 'center' },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: 'green',
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: 30,
    // elevation: 5,
    // shadowColor: '#000',
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  progressContainer: { width: screenWidth - 80, alignItems: 'center', marginBottom: 30 },
  progressTitle: { fontSize: 18, fontWeight: '600', color: '#000000', marginBottom: 20 },
  progressBarContainer: { width: '100%', marginBottom: 24 },
  progressBar: { width: '100%', height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: 12 },
  progressFill: { height: '100%', backgroundColor: '#8B5CF6', borderRadius: 4 },
  progressPercentage: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  uploadButtonContainer: { position: 'absolute', bottom: '5%', alignSelf: 'center', width: '90%' },
  uploadActionButton: { backgroundColor: '#000', paddingHorizontal: 60, paddingVertical: 16, borderRadius: 5 },
  uploadActionText: { color: '#FFF', fontSize: 16, fontWeight: '400', letterSpacing: 1, textAlign: 'center' },
});
