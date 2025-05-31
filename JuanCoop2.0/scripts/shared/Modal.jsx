import React, { useEffect, useState } from "react";
import styles from "@screens/stylesheets/Shared/Modal/style";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import Icons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { Platform } from "react-native";
import { MiniModalpop, MiniAnimatedPop } from "./MiniCardPop";
import { colorCode } from "@stylesheets/colorCode";
import ImageViewer from "react-native-image-zoom-viewer";

export const CamModal = ({
  modalVisible,
  onPress,
  isMultiple,
  isCurrent,
  ImageReturn,
}) => {
  const [images, setImages] = useState([]);
  const [launchCamera, setLaunchCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [modalTimeout, setModalTimeout] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);

  const maxImages = isMultiple;
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasCameraPermission(
        cameraStatus.status === "granted" && galleryStatus.status === "granted"
      );
    })();
  }, []);

  const takePicture = async () => {
    setLaunchCamera(true);

    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    if (cameraPermission.status !== "granted") {
      console.log("Camera permission not granted");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        assets: [4, 3],
        quality: 1,
      });

      setLaunchCamera(false);
      if (
        !result.canceled &&
        result.assets?.length > 0 &&
        result.assets[0]?.uri
      ) {
        const uris = result.assets.map((asset) => asset.uri);
        console.log("Image URIs:", uris);
        setImages((prev) => [...prev, ...uris].slice(0, maxImages));
      } else {
        console.log("No image captured or selection canceled.");
      }
    } catch (error) {
      console.error("Error launching camera:", error);
    }
  };

  useEffect(() => {
    if (ImageReturn && images.length > 0) {
      ImageReturn(images);
    }
  }, [images]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: maxImages - images.length,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...uris].slice(0, maxImages));
    }
  };

  const options = [
    {
      title: "Camera",
      icon: "camera-outline",
      action: async () => {
        if (!hasCameraPermission || isCurrent >= maxImages) {
          setModalTimeout(true);
          setTimeout(() => setModalTimeout(false), 2000);
          return;
        }
        await takePicture();
      },
      disable: Platform.OS === "android" && Platform.Version <= 29 === true,
    },
    {
      title: "Gallery",
      icon: "image-outline",
      action: async () => {
        if (!hasCameraPermission || isCurrent >= maxImages) {
          setModalTimeout(true);
          setTimeout(() => setModalTimeout(false), 2000);
          return;
        }

        await pickImage();

        setTimeout(() => onPress(false), 500);
      },
    },
    {
      title: "Cancel",
      icon: "close-outline",
      action: () => onPress(false),
    },
  ];

  console.log(isCurrent);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => onPress(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Choose an option to get an image:
          </Text>
          <View style={styles.buttonRow}>
            {options.map((option, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={option.action}
                style={{ alignItems: "center", marginHorizontal: 12 }}
                disabled={option.disable}
              >
                <Icons
                  name={option.icon}
                  style={{
                    fontSize: 30,
                    color: option.disable ? "#aaa" : "#222",
                  }}
                />
                <Text style={{ color: option.disable ? "#aaa" : "#222" }}>
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {hasCameraPermission === false ? (
          <MiniModalpop
            content="😨 Permission to access camera was denied."
            visible={modalTimeout}
            color={colorCode.PASTELRED}
          />
        ) : isCurrent >= maxImages ? (
          <MiniModalpop
            content="🤧 Maximum number of images reached."
            visible={modalTimeout}
            color={colorCode.PASTELRED}
          />
        ) : cameraPermission ? (
          <MiniModalpop
            content="🤧 Camera permission not granted."
            visible={modalTimeout}
            color={colorCode.PASTELRED}
          />
        ) : (
          <MiniAnimatedPop
            content="⌛ Please wait..."
            visible={modalTimeout}
            color={colorCode.PASTELGREEN}
          />
        )}
      </View>
    </Modal>
  );
};

export const ImageShowModal = ({ modalVisible, onPress, selectedImage }) => {
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      onRequestClose={() => onPress(false)}
    >
      <View style={styles.modalContainer}>
        <ImageViewer
          imageUrls={[{ url: selectedImage || "https://via.placeholder.com/150" }]}
          enableSwipeDown={true}
          backgroundColor="transparent"
          onSwipeDown={() => onPress(false)}
          style={styles.imageShow}
          
        />
      </View>
    </Modal>
  );
};
