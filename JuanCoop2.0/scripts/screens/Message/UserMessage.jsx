import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';  
import moment from 'moment';

const UserMessage = ({ messages, own }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const openModal = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
    setShowImageModal(false);
  };

  const time = moment(messages?.createdAt).fromNow();
  
  const messageText = messages?.decryptedText || messages?.text;
  const images = messages?.image && Array.isArray(messages.image) 
    ? messages.image.map(item => ({ url: item.url || item }))  // handle if item is a string URL or an object with `url` key
    : [];

  return (
    <View
      style={[
        styles.messageContainer,
        own ? styles.sent : styles.received,
      ]}
    >
      <Text style={styles.messageText}>{messageText}</Text>

      {/* Handle images: first show image URLs if available */}
      {images.length > 0 &&
        images.map((item, index) => (
          <View key={index} style={styles.imageContainer}>
            <TouchableOpacity onPress={() => openModal(index)}>
              <Image
                source={{ uri: item.url }}
                style={styles.messageImage}
              />
            </TouchableOpacity>
          </View>
        ))
      }

      {/* Render the time of the message */}
      <Text style={styles.time}>
   {time} 
</Text>

      {/* Modal to display the full image */}
      {showImageModal && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showImageModal}
          onRequestClose={closeModal}  // Allow closing modal via hardware back button on Android
        >
          <TouchableOpacity style={styles.modalBackground} onPress={closeModal}>
            <View style={styles.modalContainer}>
              <ImageViewer
                imageUrls={images}
                index={selectedImageIndex}
                onClick={closeModal}
                enableImageZoom={true}
                backgroundColor="rgba(0, 0, 0, 0.9)"
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageContainer: {
    marginVertical: 10,
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  received: {
    backgroundColor: '#fef8e5',
    alignSelf: 'flex-start',
  },
  sent: {
    backgroundColor: '#fefdf9',
    alignSelf: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#555',
    alignSelf: 'flex-end',
    marginTop: 5,
    paddingLeft: 10,
  },
  imageContainer: {
    marginVertical: 5,
  },
  messageImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserMessage;
