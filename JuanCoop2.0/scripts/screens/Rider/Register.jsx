import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "@screens/stylesheets/Rider/Register";
import Ionicons from "react-native-vector-icons/Ionicons";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { OTPregister, checkEmail } from "@redux/Actions/userActions";
import axios from "axios";
import baseURL from "@assets/commons/baseurl";

const Register = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const userId = context.stateUser?.userProfile?._id;
  const { isEmailAvailable } = useSelector((state) => state.checkDuplication);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [phoneNum, setPhoneNum] = useState("09");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState(null);
  const [driversLicenseImage, setDriversLicenseImage] = useState(null);
  const [mainLisence, setMainLisence] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [launchCamera, setLaunchCamera] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [errors, setErrors] = useState(null);
  const [checked, setChecked] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const handleTermCondition = () => {
    setTermsModalVisible(true);
  };
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const cameraRollStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasCameraPermission(cameraRollStatus.status === "granted");
    })();
  }, []);

  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
      setMainImage(selectedImageUri);
      setModalVisible(false);
    }
  };

  const addLicense = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setDriversLicenseImage(selectedImageUri);
      setMainLisence(selectedImageUri);
      setModalVisible2(false);
    }
  };

  const takeImage = async () => {
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
      setImage(imageUri);
      setMainImage(imageUri);
      setModalVisible(false);
    } else {
      console.log("No image captured or selection canceled.");
    }
  };

  const takeLicense = async () => {
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
      setDriversLicenseImage(imageUri);
      setMainLisence(imageUri);
      setModalVisible2(false);
    } else {
      console.log("No image captured or selection canceled.");
    }
  };

  const handleCancel = async () => {
    setFirstName("");
    setLastName("");
    setAge("");
    setGender("");
    setPhoneNum("");
    setEmail("");
    setPassword("");
    setMainLisence(null);
    setMainImage(null);
    setModalVisible(false);
    setModalVisible2(false);
    navigation.goBack();
  };

  const handleSave = async () => {
    setLoadings(true);
    const { data } = await axios.post(`${baseURL}check-email`, { email });
    const response = await axios.post(`${baseURL}check-driver-email`, {
      email,
    });
    console.log("Response: ", response.data.details);
    if (
      !firstName ||
      !lastName ||
      !age ||
      !phoneNum ||
      !email ||
      !password ||
      !image ||
      !driversLicenseImage ||
      !gender
    ) {
      setErrors("All fields are required.");
      setLoadings(false);
      return;
    } else if (!checked) {
      setErrors("Please accept the terms and conditions");
      setTimeout(() => {
        setErrors("");
      }, 5000);
      setLoadings(false);
    } else if (data.details === true || response.data.details === true) {
      setErrors("Email already exists");
      setTimeout(() => {
        setErrors("");
      }, 5000);
      setLoadings(false);
    } else if (age < 18) {
      setErrors("You must be 18 years or older to register");
      setTimeout(() => {
        setErrors("");
      }, 5000);
      setLoadings(false);
    } else if (age > 164) {
      setErrors("Invalid age");
      setTimeout(() => {
        setErrors("");
      }, 5000);
      setLoadings(false);
    } else if (phoneNum.length < 11) {
      setErrors("Invalid phone number");
      setTimeout(() => {
        setErrors("");
      }, 5000);
      setLoadings(false);
    } else if (password !== confirmPassword) {
      setErrors("Passwords do not match");
      setTimeout(() => {
        setErrors("");
      }, 5000);
      setLoadings(false);
    } else if (password.length < 8) {
      setErrors("Password must be at least 8 characters");
      setTimeout(() => {
        setErrors("");
      }, 5000);
      setLoadings(false);
    } else if (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
      setErrors("Password must contain at least one number, one letter ");
      setTimeout(() => {
        setErrors("");
      }, 5000);
      setLoadings(false);
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setErrors("Password must contain at least one special character");
      setTimeout(() => {
        setErrors("");
      }, 5000);
      setLoadings(false);
    } else {
      dispatch(OTPregister({ email }));
      const riderRegister = {
        firstName: firstName,
        lastName: lastName,
        age: age,
        phoneNum: phoneNum,
        gender: gender,
        image: image,
        driversLicenseImage: driversLicenseImage,
        email: email,
        password: password,
        user: userId,
      };

      navigation.navigate("OtpRider", { riderRegister });
      setLoadings(false);
    }
  };

  const handleChangeText = (text) => {
    if (text.startsWith("09")) {
      setPhoneNum(text);
    } else {
      setPhoneNum("09");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Picture */}
        <View style={styles.profileContainer}>
          <View>
            {mainImage ? (
              <Image source={{ uri: mainImage }} style={styles.profileImage} />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={100}
                color="#878787"
              />
            )}
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.uploadText}>Upload Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />

          <TextInput
            placeholder="Enter age"
            style={styles.input}
            keyboardType="numeric"
            maxLength={3}
            value={age}
            onChangeText={setAge}
          />

          <View style={styles.genderContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.pickerStyle}
            >
              <Picker.Item label="Select Gender" value="" enabled={false} />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item
                label="Prefer Not To Say"
                value="prefer not to say"
              />
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="numeric"
            value={phoneNum}
            onChangeText={handleChangeText}
            maxLength={11}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Your Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>

        <Text style={styles.imageText}>Drivers License</Text>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.imageButton}
        >
          <TouchableOpacity onPress={() => setModalVisible2(true)}>
            {mainLisence ? (
              <Image source={{ uri: mainLisence }} style={styles.image} />
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
        <View style={styles.containerTermAndPolicy}>
          <TouchableOpacity
            style={[styles.checkbox, checked && styles.checked]}
            onPress={() => setChecked(!checked)}
          />
          {/* <Text style={styles.text}>{checked ? 'Checked' : 'Unchecked'}</Text> */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={termsModalVisible}
            onRequestClose={() => setTermsModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Terms and Conditions</Text>

                {/* Scrollable Content */}
                <ScrollView style={{ padding: 20 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    JuanKooP Rider Terms and Conditions
                  </Text>

                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginTop: 10 }}
                  >
                    Effective Date:
                  </Text>
                  <Text>March 3, 2025</Text>
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginTop: 10 }}
                  >
                    Last Updated:
                  </Text>
                  <Text>March 3, 2025</Text>

                  <Text style={{ marginTop: 15 }}>
                    By registering as a cooperative-affiliated rider on the
                    JuanKooP platform, the cooperative and rider agree to the
                    following terms and conditions.
                  </Text>

                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}
                  >
                    1. RIDER REGISTRATION AND ELIGIBILITY
                  </Text>
                  <Text>
                    • Must be at least 18 years old.{"\n"}• Must possess a valid
                    driver’s license (for motorized vehicles).{"\n"}• Must have
                    a clean driving record with no pending
                    transportation-related legal cases.{"\n"}• Must be
                    physically fit to perform delivery tasks.{"\n"}•
                    Cooperatives must provide accurate rider details and proof
                    of eligibility.{"\n"}
                  </Text>

                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}
                  >
                    2. RESPONSIBILITIES OF THE COOPERATIVE
                  </Text>
                  <Text>
                    • Ensure riders comply with JuanKooP’s delivery and safety
                    policies.{"\n"}• Manage disputes related to rider
                    performance.{"\n"}• Provide safety equipment such as helmets
                    and protective gear.{"\n"}• Update rider details in case of
                    resignation, suspension, or replacement.{"\n"}
                  </Text>

                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}
                  >
                    3. RIDER CONDUCT AND COMPLIANCE
                  </Text>
                  <Text>
                    Riders must:{"\n"}• Deliver orders promptly and
                    professionally.{"\n"}• Follow all traffic laws and safety
                    guidelines.{"\n"}• Treat customers with courtesy and
                    respect.{"\n"}• Maintain the confidentiality of customer
                    data.{"\n"}• Violations may result in suspension or removal
                    from the platform.{"\n"}
                  </Text>

                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}
                  >
                    4. LIABILITY AND INSURANCE
                  </Text>
                  <Text>
                    • Cooperatives are responsible for ensuring riders have
                    valid insurance.{"\n"}• JuanKooP is not liable for
                    accidents, theft, or damages during deliveries.{"\n"}
                  </Text>

                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}
                  >
                    5. TERMINATION AND SUSPENSION
                  </Text>
                  <Text>
                    JuanKooP may suspend or terminate a rider for:{"\n"}•
                    Providing false information during registration.{"\n"}•
                    Repeated customer complaints or safety violations.{"\n"}•
                    Engaging in fraudulent or unsafe delivery practices.{"\n"}
                  </Text>

                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}
                  >
                    6. DATA PRIVACY AND CONFIDENTIALITY
                  </Text>
                  <Text>
                    • Cooperatives must protect rider and customer data as per
                    legal regulations.{"\n"}• Rider details will only be used
                    for delivery operations and not shared with unauthorized
                    parties.{"\n"}
                  </Text>

                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}
                  >
                    7. AMENDMENTS AND UPDATES
                  </Text>
                  <Text>
                    • JuanKooP reserves the right to modify these terms at any
                    time.{"\n"}• Continued participation means acceptance of any
                    updates.{"\n"}
                  </Text>

                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}
                  >
                    8. CONTACT INFORMATION
                  </Text>
                  <Text>
                    For inquiries or concerns, contact us at:{"\n"}
                    <Text style={{ fontWeight: "bold" }}>Email:</Text>{" "}
                    agrikaani@gmail.com{"\n"}
                    <Text style={{ fontWeight: "bold" }}>Phone:</Text>{" "}
                    09932211743{"\n"}
                    <Text style={{ fontWeight: "bold" }}>Phone:</Text>{" "}
                    09932211743{"\n"}
                  </Text>
                </ScrollView>

                {/* Close Button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setTermsModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Text style={styles.text}>
            I accept the{" "}
            <Text
              style={[styles.linkText, { textDecorationLine: "underline" }]}
              onPress={handleTermCondition} // Open modal on click
            >
              Terms and Conditions
            </Text>
          </Text>
        </View>
        {errors && <Text style={styles.errorText}>{errors}</Text>}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleSave()}
          disabled={loadings}
        >
          {loadings ? (
            <ActivityIndicator size={"small"} color="#fff" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* image */}
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
                  takeImage();
                }}
                title="Take Picture"
                variant={"ghost"}
              >
                <Ionicons name="camera-outline" style={{ fontSize: 30 }} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  addImage();
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

      {/* License */}
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
                  takeLicense();
                }}
                title="Take Picture"
                variant={"ghost"}
              >
                <Ionicons name="camera-outline" style={{ fontSize: 30 }} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible2(false);
                  addLicense();
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
    </KeyboardAvoidingView>
  );
};

export default Register;
