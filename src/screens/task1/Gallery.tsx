import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
 
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const imageSize = (screenWidth - 60) / 2;
 
interface StoredImage {
  id: string;
  uri: string;
  fileName: string;
  uploadDate: string;
  size: number;
}
 
export default function GalleryScreen() {
    const navigation = useNavigation<any>();
  const [images, setImages] = useState<StoredImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<StoredImage | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
 
  useEffect(() => {
    loadImages();
  }, []);
 
  const loadImages = async () => {
    try {
      const storedImages = await AsyncStorage.getItem('uploadedImages');
      if (storedImages) {
        const parsedImages = JSON.parse(storedImages);
        setImages(parsedImages.reverse()); // Show newest first
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };
 
  const onRefresh = async () => {
    setRefreshing(true);
    await loadImages();
    setRefreshing(false);
  };
 
  const deleteImage = async (imageId: string) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedImages = images.filter(img => img.id !== imageId);
              setImages(updatedImages);
              await AsyncStorage.setItem('uploadedImages', JSON.stringify(updatedImages));
              setModalVisible(false);
            } catch (error) {
              console.error('Error deleting image:', error);
            }
          },
        },
      ]
    );
  };
 
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
 
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
 
  const renderImageItem = ({ item, index }: { item: StoredImage; index: number }) => (
    <TouchableOpacity
      style={styles.imageItem}
      onPress={() => {
        setSelectedImage(item);
        setModalVisible(true);
      }}>
      <Image source={{ uri: item.uri }} style={styles.thumbnailImage} />
      <View style={styles.imageOverlay}>
        <Text style={styles.imageNumber}>#{index + 1}</Text>
      </View>
    </TouchableOpacity>
  );
 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Gallery</Text>
        <View style={styles.placeholder} />
      </View>
 
      <View style={styles.content}>
        {images.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No photos yet</Text>
            <Text style={styles.emptySubtitle}>
              Upload your first photo to see it here
            </Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => navigation.navigate('FaceUpload')}>
              <Text style={styles.uploadButtonText}>Take a Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.galleryCount}>
              {images.length} photo{images.length !== 1 ? 's' : ''}
            </Text>
            <FlatList
              data={images}
              renderItem={renderImageItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.gridContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </>
        )}
      </View>
 
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}>
              {/* <ArrowLeft size={24} color="#FFFFFF" /> */}
            </TouchableOpacity>
 
            {selectedImage && (
              <>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.fullImage}
                />
                
                <View style={styles.imageDetails}>
                  <View style={styles.detailRow}>
                    {/* <Calendar size={16} color="#6B7280" /> */}
                    <Text style={styles.detailText}>
                      {formatDate(selectedImage.uploadDate)}
                    </Text>
                  </View>
                  <Text style={styles.fileName}>{selectedImage.fileName}</Text>
                  <Text style={styles.fileSize}>
                    {formatFileSize(selectedImage.size)}
                  </Text>
                </View>
 
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteImage(selectedImage.id)}>
                  {/* <Trash2 size={20} color="#FFFFFF" /> */}
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  uploadButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  galleryCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  imageItem: {
    width: imageSize,
    height: imageSize,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#ccc',
    margin: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  imageNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    zIndex: 1,
  },
  fullImage: {
    width: screenWidth - 40,
    height: screenWidth - 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  imageDetails: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
  },
  fileName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileSize: {
    color: '#D1D5DB',
    fontSize: 14,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});