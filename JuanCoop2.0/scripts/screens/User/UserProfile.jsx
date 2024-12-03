import React, { useContext, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { Profileuser } from '@redux/Actions/userActions';
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = () => {


  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, user, error } = useSelector((state) => state.userOnly)
  const userId = context?.stateUser?.userProfile?._id;
  const [token, setToken] = useState();
  const [loadings, setLoadings] = useState(true);
  const [errors, setErrors] = useState(null);
  const userInfo = context.stateUser.user.CustomerInfo
  // console.log("token: ", token)
 
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     setLoadings(true); 
  //     try {
  //       const res = await AsyncStorage.getItem('jwt');
  //       if (res) {
  //         setToken(res); 

    
  //        new Promise((resolve) => setTimeout(resolve, 1000)); 

   
  //        dispatch(Profileuser(userId, res));
  //       } else {
  //         setErrors('No JWT token found.');
  //       }
  //     } catch (error) {
  //       console.error('Error retrieving JWT:', error);
  //       setErrors('Failed to retrieve JWT token.');
  //     } finally {
  //       setLoadings(false); 
  //     }
  //   };

  //   fetchUserData();
  // }, [userId, dispatch]);
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
        {context?.stateUser?.isAuthenticated &&
  userInfo?.roles &&
  userInfo.roles.includes("Customer") &&
  userInfo.roles.includes("Cooperative") ? ( <TouchableOpacity
    onPress={() =>  navigation.navigate("CoopDashboard") } // Go back to previous screen
    style={styles.backButtonContainer}
  >
    <Text style={styles.backButtonText}>{"< Back"}</Text>
  </TouchableOpacity>) : (
     <TouchableOpacity
     onPress={() =>  navigation.navigate("Home")} // Go back to previous screen
     style={styles.backButtonContainer}
   >
     <Text style={styles.backButtonText}>{"< Back"}</Text>
   </TouchableOpacity>
  ) }
       
          {/* Profile Image Section */}
          <View style={styles.profileSection}>
            { user?.image && user?.image?.url ? ( 
              <Image source={{uri: user?.image?.url}} style={styles.profileImage} />
            ) : ( 
            <Image source={require('@assets/img/farmer1.jpg')} style={styles.profileImage} />)}
            <Text style={styles.emailText}>{user?.email}</Text>
          </View>

          <TextInput
            placeholder="First name"
            style={styles.input}
            value={user?.firstName ? String(user.firstName) : ''}
            editable={false}
          />
          <TextInput
            placeholder="Last name"
            style={styles.input}
            value={user?.lastName ? String(user.lastName) : ''}
            editable={false}
          />
          <TextInput
            placeholder="Age"
            style={styles.input}
            value={user?.age ? String(user.age) : ''}
            editable={false}
          />
          <TextInput
            placeholder="Phone number"
            style={styles.input}
            value={user?.phoneNum ? String(user?.phoneNum) : ''}
            editable={false}
          />
          <TextInput
            placeholder="Gender"
            style={styles.input}
            value={user?.gender ? String(user?.gender) : ''}
            editable={false}
          />
          {/* Update Button */}
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>

          {context?.stateUser?.isAuthenticated &&
  userInfo?.roles &&
  userInfo.roles.includes("Customer") &&
  userInfo.roles.includes("Cooperative") ? (
    <TouchableOpacity onPress={() => navigation.navigate('EditFarm')}>
    <Text>Edit Your Farm</Text>
  </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={() => navigation.navigate('ProfileCoop')}>
      <Text>ARE you Part of Coop? Register here!</Text>
    </TouchableOpacity>
)}

          {/* Modal */}
          {/* <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Save changes?</Text>
              <View style={styles.modalButtons}>
                <Button title="Save" onPress={handleSaveChanges} color="#f7b900" />
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  emailText: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  updateButton: {
    backgroundColor: '#f7b900',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default UserProfile;