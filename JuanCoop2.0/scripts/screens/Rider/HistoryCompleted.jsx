import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { Profileuser } from "@redux/Actions/userActions";
import { getCompletedDelivery } from "@redux/Actions/deliveryActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Deliveries = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userId = context?.stateUser?.userProfile?._id;
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
});

export default Deliveries;
