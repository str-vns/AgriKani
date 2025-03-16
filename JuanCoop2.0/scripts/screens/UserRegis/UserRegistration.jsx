import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { OTPregister, checkEmail } from "@redux/Actions/userActions";
import styles from "@screens/stylesheets/UserRegis/UserRegistration";
import axios from "axios";
import baseURL from "@assets/commons/baseurl";

const UserRegistration = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("09");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isPasswordVisible2, setPasswordVisible2] = useState(false);
  const [gender, setGender] = useState(null);
  const [image, setImage] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [launchCamera, setLaunchCamera] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState("");
  const [checked, setChecked] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  const handleTermCondition = () => {
    setTermsModalVisible(true);
  };
    
     useEffect(() => {
          (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === "granted");
  
            const cameraRollStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasCameraPermission(cameraRollStatus.status === "granted");
  
          })();
        }, []);

  const register = async () => {
    const { data } = await axios.post(`${baseURL}check-email`, { email });
    const response = await axios.post(`${baseURL}check-driver-email`, { email });
    // dispatch(checkEmail({ email }));
    const registration = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      age: age,
      password: password,
      gender: gender,
      image: image,
    };
   
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !age ||
      !password ||
      !gender ||
      !image
    ) {
      setErrors("Please fill in the required fields");
      return;
    }else if ( !checked ) {
      setErrors("Please accept the terms and conditions");
      setTimeout(() =>{
        setErrors("");
      }, 5000)
    } 
    else if (data.details === true || response.data.details === true) {
      setErrors("Email already exists");
      setTimeout(() =>{
        setErrors("");
      }, 5000)
    }  else if ( age < 18 ) {
      setErrors("You must be 18 years or older to register");
      setTimeout(() =>{
        setErrors("");
      }, 5000)
    } else if ( age > 164 ) {
      setErrors("Invalid age");
      setTimeout(() =>{
        setErrors("");
      }, 5000)
    }  else if ( phoneNumber.length < 11 ) {
      setErrors("Invalid phone number");
      setTimeout(() =>{
        setErrors("");
      }, 5000)
    } else if ( password !== confirmPassword){
      setErrors("Passwords do not match");
      setTimeout(() =>{
        setErrors("");
      }, 5000)
    }  else if ( password.length < 8){
      setErrors("Password must be at least 8 characters");
      setTimeout(() =>{
        setErrors("");
      }, 5000)
    } else if ((!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password) )){
      setErrors("Password must contain at least one number, one letter ");
      setTimeout(() =>{
        setErrors("");
      }, 5000)
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)){
      setErrors("Password must contain at least one special character");
      setTimeout(() =>{
        setErrors("");
      }, 5000)
    } else {
    dispatch(OTPregister({ email }));

    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("09");
    setAge("");
    setPassword("");
    setConfirmPassword("");
    setGender(null);
    setImage(null);
    setMainImage("");
    setPasswordVisible(false);
    setPasswordVisible2(false);
    navigation.navigate("OTP", { registration });
    }
      
  };

  const addimage = async () => {
    setLaunchCamera(false);
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri; 
      setImage(selectedImageUri);
      setMainImage(selectedImageUri);
      setModalVisible(false);
    }
  };
  
  const takePicture = async () => {
    setLaunchCamera(false);

    const cameraPermission = await Camera.requestCameraPermissionsAsync();
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
      console.log(imageUri);
    } else {
      console.log("No image captured or selection canceled.");
    }
  };
  
  const handleChangeText = (text) => {
    if (text.startsWith("09")) {
      setPhoneNumber(text);
    } else {
      setPhoneNumber("09");
    }
  };




  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Agriconnect</Text>
        <Image source={require("@assets/img/logo.png")} style={styles.logo} />
        <Text style={styles.subtitle}>User Registration</Text>
        <Text style={styles.instructions}>
          Enter your email to sign up for this app
        </Text>

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
                    takePicture();
                  }}
                  title="Take Picture"
                  variant={"ghost"}
                >
                  <Ionicons name="camera-outline" style={{ fontSize: 30 }} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    addimage();
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
        

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.uploadContent}>
            {mainImage ? (
              <Image style={styles.image} source={{ uri: mainImage }} />
            ) : (
              <FontAwesome
                name="photo"
                size={34}
                color="black"
                style={styles.uploadIcon}
              />
            )}
            <Text style={styles.uploadText}>Upload Profile Picture</Text>
          </View>
        </TouchableOpacity>

        <TextInput
          placeholder="First Name"
          style={styles.input}
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
        />
        <TextInput
          placeholder="Last Name"
          style={styles.input}
          onChangeText={(text) => setLastName(text)}
          value={lastName}
        />

        <TextInput
          placeholder="Enter your age"
          style={styles.input}
          keyboardType="numeric"
          maxLength={3}
          value={age}
          onChangeText={setAge}
        />

        <TextInput
          placeholder="Enter Email"
          style={styles.input}
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />

        <TextInput
          placeholder="Phone Number"
          style={styles.input}
          keyboardType="phone-pad"
          onChangeText={handleChangeText}
          value={phoneNumber}
          maxLength={11}
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
            <Picker.Item label="Prefer Not To Say" value="prefer not to say" />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your password"
            style={styles.passwordInput}
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Confirm Password"
            style={styles.passwordInput}
            secureTextEntry={!isPasswordVisible2}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setPasswordVisible2(!isPasswordVisible2)}
          >
            <Ionicons
              name={isPasswordVisible2 ? "eye-off" : "eye"}
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>
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
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>JuanKooP Rider Terms and Conditions</Text>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 10 }}>Effective Date:</Text>
      <Text>March 3, 2025</Text>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 10 }}>Last Updated:</Text>
      <Text>March 3, 2025</Text>

      <Text style={{ marginTop: 15 }}>
        By registering as a cooperative-affiliated rider in the JuanKooP platform, the cooperative and rider agree to comply with the following terms and conditions.
      </Text>

      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>1. Rider Registration and Eligibility</Text>
      <Text>
        • Must be at least 18 years old.{"\n"}
        • Must possess a valid driver’s license (for motorized vehicles).{"\n"}
        • Must have a clean driving record with no pending transportation-related legal cases.{"\n"}
        • Must be physically fit to perform delivery tasks.{"\n"}
        • Cooperatives must provide accurate rider details and proof of eligibility.{"\n"}
      </Text>

      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>2. Responsibilities of the Cooperative</Text>
      <Text>
        • Ensure riders comply with JuanKooP’s delivery and safety policies.{"\n"}
        • Manage disputes related to rider performance.{"\n"}
        • Provide safety equipment such as helmets and protective gear.{"\n"}
        • Update rider details in case of resignation, suspension, or replacement.{"\n"}
      </Text>

      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>3. Rider Conduct and Compliance</Text>
      <Text>
        Riders must:{"\n"}
        • Deliver orders promptly and professionally.{"\n"}
        • Follow all traffic laws and safety guidelines.{"\n"}
        • Treat customers with courtesy and respect.{"\n"}
        • Maintain the confidentiality of customer data.{"\n"}
        • Violations may result in suspension or removal from the platform.{"\n"}
      </Text>

      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>4. Liability and Insurance</Text>
      <Text>
        • Cooperatives are responsible for ensuring riders have valid insurance.{"\n"}
        • JuanKooP is not liable for accidents, theft, or damages during deliveries.{"\n"}
      </Text>

      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>5. Termination and Suspension</Text>
      <Text>
        JuanKooP may suspend or terminate a rider for:{"\n"}
        • Providing false information during registration.{"\n"}
        • Repeated customer complaints or safety violations.{"\n"}
        • Engaging in fraudulent or unsafe delivery practices.{"\n"}
      </Text>

      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>6. Data Privacy and Confidentiality</Text>
      <Text>
        • Cooperatives must protect rider and customer data as per legal regulations.{"\n"}
        • Rider details will only be used for delivery operations and not shared with unauthorized parties.{"\n"}
      </Text>

      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>7. Amendments and Updates</Text>
      <Text>
        • JuanKooP reserves the right to modify these terms at any time.{"\n"}
        • Continued participation means acceptance of any updates.{"\n"}
      </Text>

      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20 }}>8. Contact Information</Text>
      <Text>
        For inquiries or concerns, contact us at:{"\n"}
        <Text style={{ fontWeight: "bold" }}>Email:</Text> agrikaani@gmail.com{"\n"}
        <Text style={{ fontWeight: "bold" }}>Phone:</Text> 09932211743{"\n"}
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
        {errors && typeof errors === "string" ? (
          <Text style={styles.errorText}>{errors}</Text>
        ) : null}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => register()}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        {/* <Text style={styles.agreement}>
          Already have an account?{" "}
          <Text style={styles.linkText} onPress={() => handleSignInPress()}>
            Sign In
          </Text>
        </Text> */}
      </View>
    </ScrollView>
  );
};



export default UserRegistration;
