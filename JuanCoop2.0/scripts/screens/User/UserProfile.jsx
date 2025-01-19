import React, { useContext, useCallback, useState, useEffect } from "react";
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
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { matchCooperative } from "@redux/Actions/coopActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { memberAllList } from "@redux/Actions/memberActions";

const UserProfile = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, user, error } = useSelector((state) => state.userOnly);
  const { coops } = useSelector((state) => state.allofCoops);
  const { members } = useSelector((state) => state.memberList);
  const userId = context?.stateUser?.userProfile?._id;
  const [token, setToken] = useState();
  const [loadings, setLoadings] = useState(true);
  const [errors, setErrors] = useState(null);
  const userInfo = context.stateUser.user.CustomerInfo;
  const filterUser = Array.isArray(coops)
    ? coops.filter((coop) => coop?.user?._id === userId)
    : [];
  const filterMember2 = Array.isArray(members)
    ? members.filter((member) => member?.userId?._id === userId)
    : [];
  console.log("members: ", filterMember2);
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

  useFocusEffect(
    useCallback(() => {
      dispatch(matchCooperative(token));
      dispatch(memberAllList(token));
    }, [dispatch])
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.drawerButton}
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="menu" size={34} color="black" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          {context?.stateUser?.isAuthenticated &&
          userInfo?.roles &&
          userInfo.roles.includes("Customer") &&
          userInfo.roles.includes("Cooperative") ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("CoopDashboard")} // Go back to previous screen
              style={styles.backButtonContainer}
            >
              {/* <Text style={styles.backButtonText}>{"< Back"}</Text> */}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")} // Go back to previous screen
              style={styles.backButtonContainer}
            >
              {/* <Text style={styles.backButtonText}>{"< Back"}</Text> */}
            </TouchableOpacity>
          )}

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
          {/* Update Button */}
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>

          {context?.stateUser?.isAuthenticated &&
          userInfo?.roles &&
          userInfo.roles.includes("Customer") &&
          userInfo.roles.includes("Cooperative") ? (
            <TouchableOpacity onPress={() => navigation.navigate("EditFarm")}>
              <Text>Edit Your Farm</Text>
            </TouchableOpacity>
          ) : filterUser?.length !== 0 ? null : (
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate("ProfileCoop")}
              >
                <Text>Register your Cooperative</Text>
              </TouchableOpacity>
              {filterMember2?.length !== 0 ? null : (
                <Text>
                  {" "}
                  Join Member
                  <TouchableOpacity
                    onPress={() => navigation.navigate("MembersRegistration")}
                  >
                    <Text>Register here!</Text>
                  </TouchableOpacity>
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileSection: {
    alignItems: "center",
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
    color: "#777",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  updateButton: {
    backgroundColor: "#f7b900",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
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
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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

export default UserProfile;
