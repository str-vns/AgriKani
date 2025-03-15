import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";
import { Picker } from "@react-native-picker/picker";
import { allCoops } from "@redux/Actions/coopActions";
import { createMember } from "@redux/Actions/memberActions";
import { sendNotifications } from "@redux/Actions/notificationActions";
import { useSocket } from "../../../SocketIo";
import * as ImagePicker from "expo-image-picker";
import styles from "@screens/stylesheets/UserRegis/memberRegistration";
import Ionicons from "react-native-vector-icons/Ionicons";
import messaging from "@react-native-firebase/messaging";
import { memberDetails } from "@redux/Actions/memberActions";

function MemberRegistration() {
  const { coops } = useSelector((state) => state.allofCoops);
  const { loading, members, error } = useSelector((state) => state.memberList);
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const socket = useSocket();
  const navigation = useNavigation();
  const userId = context?.stateUser?.userProfile?._id;
  const userName = context?.stateUser?.userProfile?.firstName;
  const userLast = context?.stateUser?.userProfile?.lastName;
  const [token, setToken] = useState();
  const [fcmToken, setFcmToken] = useState();
  const [address, setAddress] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [coopId, setCoopId] = useState("");
  const [barangayClearance, setBarangayClearance] = useState(null);
  const [validId, setValidId] = useState(null);
  const [mainbarangayClearance, setMainBarangayClearance] = useState("");
  const [mainValidId, setMainValidId] = useState("");
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [launchCamera, setLaunchCamera] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [errors, setErrors] = useState(null);
  const handleBackClick = () => {
    navigation.navigate("UserProfile");
  };

  
  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        const FCM = await messaging().getToken();
        setToken(res);
        setFcmToken(FCM);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };
    fetchJwt();
  }, [userId, dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(allCoops());
      dispatch(memberDetails(userId, token));
    }, [])
  );


  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const cameraRollStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasCameraPermission(cameraRollStatus.status === "granted");
    })();
  }, []);

  const addBarrangayClearance = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setBarangayClearance(selectedImageUri);
      setMainBarangayClearance(selectedImageUri);
      setModalVisible(false);
    }
  };

  const addValidId = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setValidId(selectedImageUri);
      setMainValidId(selectedImageUri);
      setModalVisible2(false);
    }
  };

  const takeBarrangayClearance = async () => {
    setLaunchCamera(true);

    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== "granted") {
      console.log("Camera permission not granted");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      aspect: [4, 3],
      quality: 0.1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setBarangayClearance(imageUri);
      setMainBarangayClearance(imageUri);
      console.log(imageUri);
    } else {
      console.log("No image captured or selection canceled.");
    }
  };

  const takeValidId = async () => {
    setLaunchCamera(true);

    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== "granted") {
      console.log("Camera permission not granted");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      aspect: [4, 3],
      quality: 0.1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setValidId(imageUri);
      setMainValidId(imageUri);
      setModalVisible2(false);
    } else {
      console.log("No image captured or selection canceled.");
    }
  };

  const memberRegistration = async () => {
    if (
      !address ||
      !barangay ||
      !city ||
      !coopId ||
      !barangayClearance ||
      !validId
    ) {
      setErrors("Please fill up all fields.");
      setLoadings(false);
      return;
    }

    const memberRegistration = {
      address: address,
      barangay: barangay,
      city: city,
      coopId: coopId.coopId,
      barangayClearance: barangayClearance,
      validId: validId,
      userId: userId,
    };

    const notification = {
      title: `Request for Membership Registration`,
      content: `You have a new request for membership registration name ${userName} ${userLast}. Please check the application for approval.`,
      user: coopId.userId,
      fcmToken: fcmToken,
      type: "members",
    };

    socket.emit("sendNotification", {
      senderName: userName,
      receiverName: coopId.userId,
      type: "Request for Membership Registration",
    });

    dispatch(sendNotifications(notification, token));
    dispatch(createMember(memberRegistration, token));

    setAddress("");
    setBarangay("");
    setCity("");
    setCoopId("");
    setBarangayClearance(null);
    setValidId(null);
    setMainBarangayClearance("");
    setMainValidId("");

    Alert.alert(
      "Member Registration",
      "Member Registration Successful, We will send to email if your Registration was accepted by Cooperative that you Choose",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        {/* <View style={styles.header}>
          <TouchableOpacity
            style={styles.drawerButton}
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="menu" size={34} color="black" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Member Registration</Text>
        </View> */}
        <Image source={require("@assets/img/logo.png")} style={styles.logo} />
        <Text style={styles.textHeaderInput}>Address</Text>
        <TextInput
          placeholder="Address"
          style={styles.input}
          onChangeText={(text) => setAddress(text)}
          value={address}
        />

        <Text style={styles.textHeaderInput}>Barangay</Text>
        <TextInput
          placeholder="Barangay"
          style={styles.input}
          onChangeText={(text) => setBarangay(text)}
          value={barangay}
        />

        <Text style={styles.textHeaderInput}>City</Text>
        <TextInput
          placeholder="City"
          style={styles.input}
          onChangeText={(text) => setCity(text)}
          value={city}
        />
        <Text style={styles.textHeaderInput}>Choose Cooperative To Join</Text>
        <View style={styles.CoopContainer}>
        <Picker
  selectedValue={coopId}
  style={styles.pickerStyle}
  onValueChange={(itemValue) => setCoopId(itemValue)}
>
  {/* <Picker.Item label="Select Cooperative" value="" enabled={false} />
  {coops && coops.length > 0 ? (
    coops
    .filter(coop => !members.some(member => member.coopId?._id === coop._id))
      .map((coop, index) => (
        <Picker.Item
          key={index}
          label={coop.farmName || "None"}
          value={{ coopId: coop._id, userId: coop.user._id }}
          style={styles.pickerText}
        />
      ))
  ) : (
    <Text>No Cooperative</Text>
  )}
</Picker> */}
<Picker.Item label="Select Cooperative" value="" enabled={false} />
{coops && coops.length > 0 ? (
  coops
    .filter(coop => !(members?.some(member => member.coopId?._id === coop._id) ?? false)) // Ensures it works even if members is undefined
    .map((coop, index) => (
      <Picker.Item
        key={index}
        label={coop.farmName || "None"}
        value={{ coopId: coop._id, userId: coop.user._id }}
        style={styles.pickerText}
      />
    ))
) : (
  <Text>No Cooperative</Text>
)}
</Picker>

        </View>

        <Text style={styles.imageText}>Barangay Clearance</Text>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.imageButton}
        >
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            {mainbarangayClearance ? (
              <Image
                source={{ uri: mainbarangayClearance }}
                style={styles.image}
              />
            ) : (
              <View style={styles.ImageCard}>
                <View style={styles.cardContent}>
                  <View style={styles.imageInfo}>
                    <Ionicons name="camera-outline" size={50} color="black" />
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>

        <Text style={styles.imageText}>Valid ID</Text>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.imageButton}
        >
          <TouchableOpacity onPress={() => setModalVisible2(true)}>
            {mainValidId ? (
              <Image source={{ uri: mainValidId }} style={styles.image} />
            ) : (
              <View style={styles.ImageCard}>
                <View style={styles.cardContent}>
                  <View style={styles.imageInfo}>
                    <Ionicons name="camera-outline" size={50} color="black" />
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>

        {errors && <Text style={styles.errorText}>{errors}</Text>}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => memberRegistration()}
          disabled={loadings}
        >
          {loadings ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Apply</Text>
          )}
        </TouchableOpacity>

        {/* Barangay Clearance */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Choose an option to get a image:
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    takeBarrangayClearance();
                  }}
                  title="Take Picture"
                  variant={"ghost"}
                >
                  <Ionicons name="camera-outline" style={{ fontSize: 30 }} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    addBarrangayClearance();
                  }}
                  title="Add Image"
                  variant={"ghost"}
                >
                  <Ionicons name="image-outline" style={{ fontSize: 30 }} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  title="Cancel"
                  variant={"ghost"}
                  style={{ marginTop: 5.5 }}
                >
                  <Text>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Valid ID */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => setModalVisible2(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Choose an option to get a image:
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible2(false);
                    takeValidId();
                  }}
                  title="Take Picture"
                  variant={"ghost"}
                >
                  <Ionicons name="camera-outline" style={{ fontSize: 30 }} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible2(false);
                    addValidId();
                  }}
                  title="Add Image"
                  variant={"ghost"}
                >
                  <Ionicons name="image-outline" style={{ fontSize: 30 }} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible2(false)}
                  title="Cancel"
                  variant={"ghost"}
                  style={{ marginTop: 5.5 }}
                >
                  <Text>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

export default MemberRegistration;
