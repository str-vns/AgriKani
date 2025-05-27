import React, { useContext, useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { matchCooperative } from "@redux/Actions/coopActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { memberAllList } from "@redux/Actions/memberActions";
import { Profileuser } from "@redux/Actions/userActions";
import styles from "@screens/stylesheets/User/UserProfile"; // Adjust the import path as necessary

const UserProfile = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, user, error } = useSelector((state) => state.userOnly);
  const { coops } = useSelector((state) => state.allofCoops);
  const { members } = useSelector((state) => state.memberList);
  const userId = context?.stateUser?.userProfile?._id;
  const [token, setToken] = useState();
  const userInfo = context.stateUser.user.CustomerInfo;
  const filterUser = Array.isArray(coops)
    ? coops.filter((coop) => coop?.user?._id === userId)
    : [];
  const filterMember2 = Array.isArray(members)
    ? members.filter((member) => member?.userId?._id === userId)
    : [];


  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
         await AsyncStorage.getItem("user");
        setToken(res);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };

    fetchJwt();
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(matchCooperative(token));
      dispatch(memberAllList(token));
      dispatch(Profileuser(userId, token));
      context.reloadUser()
    }, [dispatch, userId, token])
  );

  return (
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        keyboardShouldPersistTaps="handled" 
      >


  
        <View style={styles.container}>
          {/* Profile Image Section */}
          <View style={styles.profileSection}>
            {user?.image && user?.image?.url ? (
              <Image
                source={{ uri: user?.image?.url }}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={require("@assets/img/farmer1.jpg")}
                style={styles.profileImage}
              />
            )}
            <Text style={styles.emailText}>{user?.email}</Text>
          </View>
  
          {/* Input Fields */}
          <TextInput
            placeholder="First name"
            style={styles.input}
            value={user?.firstName ? String(user.firstName) : ""}
            editable={false}
          />
          <TextInput
            placeholder="Last name"
            style={styles.input}
            value={user?.lastName ? String(user.lastName) : ""}
            editable={false}
          />
          <TextInput
            placeholder="Age"
            style={styles.input}
            value={user?.age ? String(user.age) : ""}
            editable={false}
          />
          <TextInput
            placeholder="Phone number"
            style={styles.input}
            value={user?.phoneNum ? String(user?.phoneNum) : ""}
            editable={false}
          />
          <TextInput
            placeholder="Gender"
            style={styles.input}
            value={user?.gender ? String(user?.gender) : ""}
            editable={false}
          />
  
          {/* Update Profile Button */}
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
  
          {/* Registration Options */}
          <View style={styles.registrationContainer}>
            {context?.stateUser?.isAuthenticated && userInfo?.roles ? (
              userInfo.roles.includes("Cooperative") ? (
                <TouchableOpacity 
                  style={styles.editFarmButton} 
                  onPress={() => navigation.navigate("EditFarm")}
                >
                  <Text style={styles.editFarmButtonText}>Edit Your Farm</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.registrationOptionsContainer}>
                  {filterUser?.length === 0 && (
                    <TouchableOpacity 
                      style={styles.registerCoopButton} 
                      onPress={() => navigation.navigate("ProfileCoop")}
                    >
                      <Text style={styles.registerCoopButtonText}>Register your Cooperative</Text>
                    </TouchableOpacity>
                  )}
  
                  <View style={styles.joinMemberContainer}>
                    <Text style={styles.joinMemberText}>Join Member</Text>
                    <TouchableOpacity 
                      style={styles.joinMemberLinkButton} 
                      onPress={() => navigation.navigate("MemberList")}
                    >
                      <Text style={styles.joinMemberLinkText}>Register here!</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            ) : null}
          </View>
        </View>
      </ScrollView>
  
  );
};


export default UserProfile;
