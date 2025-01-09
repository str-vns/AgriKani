import React, { useContext, useEffect, useState } from "react";
import { View, Text,  TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Platform, Modal, ActivityIndicator} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "@screens/stylesheets/Rider/Register";
import Ionicons  from "react-native-vector-icons/Ionicons";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from '@react-native-firebase/messaging';
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { OTPregister, checkEmail } from "@redux/Actions/userActions";

const Register = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const context = useContext(AuthGlobal);
    const userId = context.stateUser?.userProfile?._id;
    const { isEmailAvailable } = useSelector((state) => state.checkDuplication)
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
  }

  const handleSave = async () => {
    setLoadings(true);
    dispatch(checkEmail({ email }));
    if (!firstName || !lastName || !age || !phoneNum || !email || !password || !image || !driversLicenseImage || !gender ) {
      setErrors("All fields are required.");
      setLoadings(false);
      return;
    }  else if (isEmailAvailable === true) {
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
    }  else if ( phoneNum.length < 11 ) {
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
      }
  
   
      navigation.navigate("OtpRider", { riderRegister });
      setLoadings(false);
    }
  }

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
          <View >
          { mainImage ? (
            <Image source={{ uri: mainImage }} style={styles.profileImage}/>
          ) : (
             <Ionicons name="person-circle-outline" size={100} color="#878787" />
          )}
           
           
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.uploadText} >Upload Photo</Text>
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
                      <Picker.Item label="Select Gender" value="" enabled={false}  />
                      <Picker.Item label="Male" value="male"  />
                      <Picker.Item label="Female" value="female"  />
                      <Picker.Item label="Prefer Not To Say" value="prefer not to say" />
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
                {errors && <Text style={styles.errorText}>{errors}</Text>}
      </ScrollView>
  
    
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} 
        onPress={() => handleSave()}
        disabled={loadings}>
          {loadings ? ( <ActivityIndicator size={"small"} color="#fff" /> ) : ( <Text style={styles.saveText}>Save</Text> )}
  
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
