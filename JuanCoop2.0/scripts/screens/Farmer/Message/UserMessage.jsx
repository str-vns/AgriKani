import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';  
import styles from '@stylesheets/Message/UserMessage';
import Loader from '@shared/Loader';
import NoItem from '@shared/NoItem';
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
    ? messages.image.map(item => ({ url: item.url || item })) 
    : [];


  return (
    <View
      style={[
        styles.messageContainer,
        own ? styles.sent : styles.received,
      ]}
    >
      <Text style={styles.messageText}>{messageText}</Text>

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

      <Text style={styles.time}>
   {time} 
</Text>

      {showImageModal && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showImageModal}
          onRequestClose={closeModal}  
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

export default UserMessage;
