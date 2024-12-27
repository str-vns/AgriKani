import React, { useCallback, useContext, useState } from "react";
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
import { shippedOrder } from "@redux/Actions/orderActions";
import { deliveryList } from "@redux/Actions/deliveryActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AssignList = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userId = context?.stateUser?.userProfile?._id;
  const { shiploading, orders, shiperror } = useSelector(state => state.orderShipped);
  const { deliveries } = useSelector(state => state.deliveryList);
  const [activeTab, setActiveTab] = useState("Assign");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);
  const checkIfDelivered = (orderItems) => {
    return deliveries.some((delivery) =>
      orderItems.some((orderItem) =>
        delivery._id === orderItem.deliveryId && ["delivering", "re-delivery", "pending", "delivered"].includes(delivery.status)
      )
    );
  };


  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await AsyncStorage.getItem("jwt");
          if (res) {
            setToken(res);
            if (userId) {
              dispatch(shippedOrder(userId, res));
              dispatch(deliveryList(userId, res));
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
      dispatch(shippedOrder(userId, token));
      dispatch(deliveryList(userId, token));
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setRefreshing(false);
    }
  }, [userId, token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Shipping":
        return "blue";
      default:
        return "black"; 
    }
  };

  const capitalizeFirstLetter = (text) => {
    if (!text) return ""; 
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const renderOrderItem = ({ item }) => {
    const isDelivered = checkIfDelivered(item?.orderItems);
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderInfo}>
          <Text style={styles.name}>{item.user.firstName} {item.user.lastName}</Text>
          <Text style={styles.orderNumber}>Order # {item._id}</Text>
          <Text>Status:  
            <Text style={[styles.status, { color: getStatusColor(item?.orderItems[0]?.orderStatus) }]}>
              {capitalizeFirstLetter(item?.orderItems[0]?.orderStatus)}
            </Text>
          </Text>
        </View>

        {!isDelivered && (  // If no matching delivery found, show the "Assign now" button
          <TouchableOpacity
            style={styles.deliverButton}
            onPress={() => navigation.navigate("AssingDetails", { order: item })}
          >
            <Text style={styles.buttonText}>Assign now</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header2}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle2}>Assign List</Text>

          <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                navigation.navigate("HistoryCoop");
              }}
            >
              <Text style={styles.buttonText}><Ionicons name="time-outline" size="30"/></Text>
            </TouchableOpacity>

      </View>

      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Assign" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("Assign")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Assign" && styles.activeTabText,
            ]}
          >
            Assign
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "Rider" && styles.activeTab,
          ]}
          onPress={() => navigation.navigate("Riderlist")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Rider" && styles.activeTabText,
            ]}
          >
            Rider
          </Text>
        </TouchableOpacity>
      </View>

      {shiploading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : orders && orders.length === 0 || shiperror ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Shipped Product found.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
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
    flexDirection: "column", // Stack buttons vertically
    alignItems: "flex-end", // Align buttons to the right
  },
  deliverButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 10, // Add space between buttons
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
  headerButton: {
    paddingHorizontal: 12,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default AssignList;
