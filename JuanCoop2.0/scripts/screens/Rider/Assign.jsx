import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { thisMonthDelivery } from '@redux/Actions/deliveryActions';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { removeDelivery } from '@redux/Actions/deliveryActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Assign = (props) => {
  const driverId = props.route.params.driver;
  const userId = driverId._id;
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const { Deliveryloading, deliveries, Deliveryerror } = useSelector((state) => state.deliveryList);
  const [token , setToken] = useState(null)
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await AsyncStorage.getItem("jwt");
          if (res) {
            setToken(res);
            if (userId) {
              dispatch(thisMonthDelivery(userId, res));
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

  const handleAssign = (id) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: 'Assigned' } : order
      )
    );
  };

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
        return "red";
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
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(thisMonthDelivery(userId, token));
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setRefreshing(false);
    }
  }, [ userId, token]);

  const removeDeliverys = (id) => {
 console.log("id", id)
    dispatch(removeDelivery(id, token));
    onRefresh()
  };
  const renderOrder = ({ item }) => {
    return (
      <View style={styles.orderRow}>

        <Text style={styles.deliveryText}>
          Delivery Id: {""}
          <Text style={styles.orderText}>{item._id}</Text>
        </Text>
  
        <Text style={styles.deliveryText}>Order Id:</Text>
        <Text style={styles.orderText}>{item.orderId}</Text>
  
        <View style={styles.buttonRow}>
        <Text>Status: {" "}
  <TouchableOpacity
    style={[
      styles.orderButton,
      { backgroundColor: getStatusColor(item.status) }, 
      item.status === 'Assigned' && styles.assignedButton,
      item.status === 'Already Assigned' && styles.alreadyAssignedButton,
    ]}
    onPress={() => item.status === 'Assign' && handleAssign(item.id)}
    disabled={item.status !== 'Assign'}
  >
    <Text style={[styles.status, { color: "white" }]}>
      {capitalizeFirstLetter(item.status)}
    </Text>
  </TouchableOpacity>
</Text>
          {/* Trash Button */}
          <TouchableOpacity
            style={styles.trashButton}
            onPress={() => removeDeliverys(item._id)} 
          >
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.containerNo}>
         <View style={styles.header}>
          <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={34} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Assigned</Text>
        </View>
    <View style={styles.container}>
    
    {deliveries?.length ? (
  <View style={styles.riderInfo}>
     <View style={styles.riderInfo}>
     <Image
  source={{
    uri: deliveries[0]?.assignedTo?.image?.url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEL1_AFmfB9y1WAQ_lEcF7z8DFGDPQpycmw&s',
  }}
  style={styles.profileImage}
/>
        <View>
          <Text style={styles.riderNameTitle}>Rider Name:</Text>
          <Text style={styles.riderName}>{deliveries[0]?.assignedTo?.firstName}{deliveries[0]?.assignedTo?.lastName}</Text>
        </View>
      </View>
     
  </View>
) : (
  <Text style={styles.instructions}>No deliveries assigned yet.</Text>
)}
      <Text style={styles.instructions}>Assign order for this rider.</Text>
      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
      />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  containerNo: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  riderNameTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  riderName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  instructions: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
  },
  orderRow: {
    flexDirection: 'column', // Stack Delivery Id and Order Id vertically
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  deliveryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  orderText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row', // Align buttons horizontally
    justifyContent: 'space-between', // Place buttons on opposite ends
    alignItems: 'center',
    width: '100%', // Ensure the row takes the full width
  },
  trashButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto', // This will push the trash button to the right
  },
  orderButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#D3D3D3',
    minWidth: 120,
    alignItems: 'center',
  },
  assignedButton: {
    backgroundColor: '#007BFF',
  },
  alreadyAssignedButton: {
    backgroundColor: '#D55AC5',
  },
  orderButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  disabledButtonText: {
    color: '#fff',
  },
  });
  

export default Assign;
