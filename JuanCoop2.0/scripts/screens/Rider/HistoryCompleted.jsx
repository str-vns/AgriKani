import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { Profileuser } from "@redux/Actions/userActions";
import { getCompletedDelivery } from "@redux/Actions/deliveryActions";
import { Picker } from '@react-native-picker/picker';
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { driverProfile, updateAvailability } from "@redux/Actions/driverActions";

const Deliveries = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userId = context?.stateUser?.userProfile?._id;
   const { Profileloading, Profiledriver, ProfileError } = useSelector((state) => state.driverProfile);
  const { Deliveryloading, delivery, Deliveryerror } = useSelector( state => state.deliveryComplete);
  const [activeTab, setActiveTab] = useState("Completed");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await AsyncStorage.getItem("jwt");
          if (res) {
            setToken(res);
            if (userId) {
              dispatch(Profileuser(userId, res));
              dispatch(getCompletedDelivery(userId, res));
              dispatch(driverProfile(userId, res))
            } else {
              setErrors('User ID is missing.');
            }
          } else {
            setErrors('No JWT token found.');
          }
        } catch (error) {
          console.error('Error retrieving JWT:', error);
          setErrors('Failed to retrieve JWT token.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [userId, dispatch])
  );
  
    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      try {
        dispatch(getCompletedDelivery(userId, token));
        dispatch(driverProfile(userId, token))
      } catch (err) {
        console.error("Error refreshing users:", err);
      } finally {
        setRefreshing(false);
      }
    }, [ userId, token]);

    const getStatusColor = (status) => {
      switch (status) {
        case "pending":
          return "orange";
        case "delivering":
          return "blue";
        case "cancelled":
          return "red";
        case "re-deliver":
          return "purple";
        case "failed":
          return "gray";
        case "delivered":
          return "green";
        default:
          return "black"; 
      }
    };

    const capitalizeFirstLetter = (text) => {
      if (!text) return ""; 
      return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const handleChange = () => {
       Alert.alert(
            "Update Availability",
            "Are you sure you want to update your availability status?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "OK",
                onPress: async () => {
                  try {
                    dispatch(updateAvailability(userId, token));
                    setTimeout(() => {
                      onRefresh()
                    }, 1000)
                   
                    console.log("Availability updated successfully");
                  } catch (error) {
                    console.error("Error updating availability: ", error);
                  }
                },
              },
            ]
          );

    }

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderInfo}>
        <Text style={styles.name}>{item.userId.firstName} {item.userId.lastName}</Text>
        <Text style={styles.orderNumber}>Order # {item.orderId._id}</Text>
      </View>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>{capitalizeFirstLetter(item.status)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header2}>
          <TouchableOpacity
            style={styles.drawerButton}
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="menu" size={34} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle2}>Delivery List</Text>

          <View style={styles.drawerContainer}>
                    <Text style={styles.TextTop}>Availability </Text>
                   {Profileloading ? (  <View style={[styles.circle, { backgroundColor: 'gray' }]} >
                          <Text style={styles.circleText}></Text>
                        </View>) : (<View style={[styles.circle, { backgroundColor: Profiledriver?.isAvailable ? 'green' : 'gray' }]} >
                          <Text style={styles.circleText}></Text>
                        </View>)}
                </View>
                {/* Picker for toggling availability */}
                <View style={styles.pickerContainer}>
                 
                  <Picker
                    selectedValue={Profiledriver?.isAvailable ? 'true' : 'false'}
                    onValueChange={handleChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Update Availability Status" value=""  enabled={false}/>
                    { Profiledriver?.isAvailable ?  <Picker.Item label="Not Available" value="false" />
                    : <Picker.Item label="Available" value="true" />  }
          
                  </Picker>
                </View>
        </View>
        
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Deliveries" && styles.activeTab,
          ]}
          onPress={() => navigation.navigate("Deliveries")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Deliveries" && styles.activeTabText,
            ]}
          >
            Deliveries
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Completed" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("Completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Completed" && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

       {Deliveryloading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : delivery && delivery.length === 0 || Deliveryerror ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Deliveries Complete found.</Text>
        </View>
      ) : (
        <FlatList
          data={delivery}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          renderItem={renderOrderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 3,
},
headerTitle2: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    color: '#333',
},
drawerButton: {
  marginRight: 10,
},
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
  },
  activeTab: {
    borderBottomColor: "#FFC107",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#FFC107",
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  orderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3,
  },
  orderInfo: {
    flex: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  orderNumber: {
    fontSize: 14,
    color: "#666",
  },
  status: {
    color: "#FFC107",
    fontSize: 14,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "column",
    alignItems: "flex-end", 
  },
  deliverButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 10, 
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  detailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  detailsText: {
    color: "#007BFF",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#777",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    left: 36,
   
  },
  circleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginTop: 10,
    width: '10%',
    alignSelf: 'flex-end', 
  },
  picker: {
    height: 20,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  TextTop: {
    fontSize: 12,
    fontWeight: 'bold',
    left: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  drawerContainer: {
    flexDirection: 'column'
  },
});

export default Deliveries;
