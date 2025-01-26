import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Button, StyleSheet, Modal} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { Profileuser, ProfileEdit } from '@redux/Actions/userActions';
import { Ionicons } from '@expo/vector-icons';
import { useSocket } from '../../../SocketIo';


const UserEditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [hascameraPermission, setHasCameraPermission] = useState(null);
  const [errors, setErrors] = useState('');
  const [imagePreviews, setImagePreview] = useState("");
  const [launchCamera, setLaunchCamera] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadings, setLoadings] = useState(true);
  const [token, setToken] = useState();
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch()
  const socket = useSocket();
  const { loading, user, error } = useSelector((state) => state.userOnly)
  // console.log(useSelector((state) => state.EditProfile)) 
  const userId = context?.stateUser?.userProfile?._id;
  // console.log("image: ", image)
//Cam Permission
  useEffect(() => {
    (async () => {
        const cameraStatus =  await Camera.requestCameraPermissionsAsync()
        setHasCameraPermission(cameraStatus.status === 'granted')
    })();
})

// token
useEffect(() => {
  const fetchJwt = async () => {
      try {
          const res = await AsyncStorage.getItem("jwt");
          setToken(res);
      } catch (error) {
          console.error("Error retrieving JWT: ", error);
      }
  };

  fetchJwt(); 
}, []);

const fetchUserData = async () => {
  setLoadings(true); // Start loading
    try {
      const res = await AsyncStorage.getItem('jwt');
      if (res) {
        setToken(res); 

        // Optional delay for loading
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second

        // Dispatch the profile fetch action
     dispatch(Profileuser(userId, res));
      } else {
        setErrors('No JWT token found.');
      }
    } catch (error) {
      console.error('Error retrieving JWT:', error);
      setErrors('Failed to retrieve JWT token.');
    } finally {
      setLoadings(false); // Stop loading
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        setFirstName(user?.firstName || "");  
        setLastName(user?.lastName || "");
        setPhoneNumber(user?.phoneNum ? user?.phoneNum : '');
        setGender(user?.gender || null);
        setImagePreview(user?.image?.url || "");  
      }
    }, [user])  
  );

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
      setImagePreview(selectedImageUri); 
      setModalVisible(false);
    }
  };

  const takePicture = async () => {
  setLaunchCamera(true);

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
    setImagePreview(imageUri);
    console.log(imageUri);
  } else {
    console.log("No image captured or selection canceled.");
  }
  };

  useEffect(() => {
    if (socket) {
      socket.on("profileUpdated", (updatedUserProfile) => {
        console.log("Profile updated:", updatedUserProfile);
        dispatch(Profileuser(userId, updatedUserProfile));
      });

      return () => {
        socket.off("profileUpdated");
      };
    }
  }, [socket, dispatch, userId]);

  const handleSave = () => {
    if (!firstName || !lastName || !phoneNumber) {
      setErrors('Please fill all fields');
      return;
    }

    if (phoneNumber.length !== 11) {
      setErrors('Phone number must be 11 digits');
      return; 
    }

    if (!token) {
      setErrors('Token is not available');
      return; 
    }

    const editProfile = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      gender: gender,
      image: image
    };

    dispatch(ProfileEdit(userId, token, editProfile));

    setTimeout(() => {
      navigation.navigate('Profile'); 
      fetchUserData();
    }, 2000); 
  };


  return (
    <View style={styles.container}>
         <View style={styles.header}>
          <TouchableOpacity
            style={styles.drawerButton}
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="menu" size={34} color="black" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Update Profile</Text>
        </View>

      <TouchableOpacity style={styles.profilePicContainer}>
      { user?.image && user?.image?.url ? ( 
              <Image source={{uri: imagePreviews}} style={styles.profilePic} />
            ) : ( 
            <Image source={require('@assets/img/farmer1.jpg')} style={styles.profilePic} />)}
        <TouchableOpacity  onPress={() => setModalVisible(true)}>
        <Text style={styles.updateText}>Update Profile Picture</Text>
        </TouchableOpacity>    
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Edit First Name</Text>
        <TextInput
          style={styles.input}
          name = {"firstName"}
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
         <Text style={styles.label}>Edit Last Name</Text>
        <TextInput
          style={styles.input}
          name = {"lastName"}
          value={lastName }
          onChangeText={(text) => setLastName(text)}
        />

        <Text style={styles.label}>Edit Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          keyboardType='phone-pad'
        />

        <Text style={styles.label}>Edit Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            style={styles.picker}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Prefer Not To Say" value="prefer not to say" />
          </Picker>
        </View>
        {errors ? <Error message={typeof errors === 'string' ? errors : errors.message || 'An error occurred'} /> : null}
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save & Update</Text>
        </TouchableOpacity>
      </View>
       
      <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Choose an option to get a image:</Text>
                        <View style={styles.buttonRow}>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                                takePicture();
                            }}
                            title="Take Picture"
                            variant={"ghost"}
                        ><Ionicons name="camera-outline" style={{fontSize: 30}}/> 
                     </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                                addimage();
                            }}
                            title="Add Image"
                            variant={"ghost"}
                        ><Ionicons name="image-outline" style={{fontSize: 30}}/> 
                         </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            title="Cancel"
                            variant={"ghost"}
                            style={{marginTop:5.5}}
                        ><Text>CANCEL</Text>
                         </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  updateText: {
    color: '#FF6347', // Orange color
    marginTop: 10,
    fontSize: 16,
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginBottom: 20,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
},
fixedRatio: {
    flex: 1,
    aspectRatio: 1
},
modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
},
buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
},
header: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 20,
  paddingTop: 15,
  paddingBottom: 15,
  backgroundColor: "#fff",

},
headerTitle: {
  fontSize: 22,
  fontWeight: "700",
  flex: 1,
  textAlign: "center",
  color: "#333",
},
});

export default UserEditProfile;