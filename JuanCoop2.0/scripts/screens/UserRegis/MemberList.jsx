import React, { useEffect, useContext, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses, deleteAddress } from "@src/redux/Actions/addressActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, RefreshControl } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { memberDetails } from "@redux/Actions/memberActions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MemberList = () => {
  const context = useContext(AuthGlobal);
  const userId = context?.stateUser?.userProfile?._id;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, members, error } = useSelector((state) => state.memberList);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  console.log("members: ", members?.coopId?.image[0]?.url);


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
    if (userId) {
      dispatch(memberDetails(userId, token));
    }
  },[dispatch, userId])
)
const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(memberDetails(userId, token)); 
    setRefreshing(false);
  }, []);

//   const handleDelete = (id) => {
//     Alert.alert(
//       "Confirm Delete",
//       "Are you sure you want to delete this address?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           onPress: () => {
//             dispatch(deleteAddress(id));
//           },
//           style: "destructive",
//         },
//       ]
//     );
//   };

//   const handleEdit = (address) => {
//     navigation.navigate('AddressEdit', { addressData: address });
//   };

//   const handleSelectAddress = (address) => {
//     setSelectedAddress(address);
//     navigation.navigate('Payment', {cartItems, addressData: address });
//   };
console.log("members: ", members);
  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu-outline" size={34} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Member List</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('MembersRegistration')}>
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Join Member</Text>
      </TouchableOpacity>
    </View>

    <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
      <View style={styles.headerContainer}></View>
  
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
  
      {members ? (
        (Array.isArray(members) ? members : [members]).map((member) => (
          <TouchableOpacity
            key={member._id}
            onPress={() =>
                navigation.navigate("CoopFarmProfile", {
                  coop: member?.coopId 
                })
              }
            style={styles.addressContainer}
          >
            <View style={styles.memberRow}>
              {/* Left-side Image */}
              {member?.coopId?.image[0]?.url && (
                <Image
                  source={{ uri: member?.coopId?.image[0]?.url || "" }}
                  style={styles.memberImage}
                />
              )}
  
              {/* Right-side Text Details */}
              <View style={styles.memberInfo}>
                <View style={styles.titleRow}>
                <Text style={styles.addressTitle}>
                    {member?.coopId?.farmName}
                  </Text>
                </View>
                <Text style={styles.addressText}>
                    {member?.coopId?.address}, {member?.coopId?.barangay}, {member?.coopId?.city}
                    <Ionicons name="location-outline" size={20} color="#f7b900" />
                  </Text>
                  <Text style={styles.addressText}>Phone: {member?.coopId?.user?.phoneNum}</Text>
                  <Text style={styles.addressText}> Status: {""}
                  <Text
  style={[
    styles.addressText,
    { color: member?.approvedAt ? "green" : "orange" },
  ]}
>
   {member?.approvedAt ? "Member" : "Pending"}
</Text>
</Text>
                {/* <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={() => handleEdit(member)}>
                    <Ionicons name="create-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => handleDelete(member?._id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View> */}
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noAddressText}>No members found.</Text>
      )}
    </ScrollView>
  </View>
  
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
      },
      header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        elevation: 3,
      },
      headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        flex: 1,
        textAlign: "center",
        color: "#333",
      },
      addButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#007bff",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
      },
      addButtonText: {
        color: "#fff",
        marginLeft: 5,
      },
      addressContainer: {
        backgroundColor: "#fff",
        marginVertical: 10,
        marginHorizontal: 15,
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      memberRow: {
        flexDirection: "row",  // Align image and text side by side
        alignItems: "center",
      },
      memberImage: {
        width: 60,  // Adjust width
        height: 60, // Adjust height
        borderRadius: 30, // Make it circular
        marginRight: 15, // Spacing between image and text
      },
      memberInfo: {
        flex: 1, // Take remaining space
      },
      titleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      addressTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
      },
      addressText: {
        fontSize: 14,
        color: "#666",
      },
      buttonContainer: {
        flexDirection: "row",
        marginTop: 10,
      },
      button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#28a745",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 10,
      },
      buttonText: {
        color: "#fff",
        marginLeft: 5,
      },
      deleteButton: {
        backgroundColor: "#dc3545",
      },
});

export default MemberList;