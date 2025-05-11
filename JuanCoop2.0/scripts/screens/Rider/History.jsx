import React, { useCallback, useContext, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getHistoryDelivery } from "@redux/Actions/deliveryActions";
import AuthGlobal from '@redux/Store/AuthGlobal';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from 'react-redux';

const statusColors = {
  delivered: '#28a745', 
  delivering: '#f39c12', 
  pending: '#007bff', 
  failed: '#dc3545',
  "re-deliver": '#17a2b8',
};


const OrderItem = ({ order }) => (
  <View style={styles.orderItem}>
    <Text style={styles.orderId}>order#{order._id}</Text>
    <View style={[styles.statusBadge, { backgroundColor: statusColors[order.status] }]}>
      <Text style={styles.statusText}>{order.status}</Text>
    </View>
  </View>
);

const Section = ({ title, data }) => {

  const [expanded, setExpanded] = useState(false);
  const [showAssignedOnly, setShowAssignedOnly] = useState(false);

  const displayedData = showAssignedOnly
    ? data.filter((order) => order.status === 'pending')
    : data;

  return (
    <View>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.toggleSymbol}>{expanded ? '▾' : '▸'}</Text>
      </TouchableOpacity>
      {expanded && (
        <View>
          <TouchableOpacity
            onPress={() => setShowAssignedOnly(!showAssignedOnly)}
            style={styles.filterButton}>
            <Text style={styles.filterButtonText}>
              {showAssignedOnly ? 'Show All' : 'Show Pending Only'}
            </Text>
          </TouchableOpacity>
          <FlatList
            data={displayedData}
            keyExtractor={(item, index) => `${title}-${index}`}
            renderItem={({ item }) => <OrderItem order={item} />}
          />
        </View>
      )}
    </View>
  );
};

const AssignFile = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const { Deliveryloading, history, Deliveryerror } = useSelector( state => state.deliveryHistory);
  const userId = context?.stateUser?.userProfile?._id;
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
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
              dispatch(getHistoryDelivery(userId, res));
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
  
  const groupOrdersByMonth = (orders) => {
    const grouped = orders.reduce((acc, order) => {
      const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
      const month = createdAt.toLocaleString('default', { month: 'long' });
      const year = createdAt.getFullYear();
      const monthYear = `${month} ${year}`;

      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(order);
      return acc;
    }, {});
    return grouped;
  };

  const groupedDeliveries = history?.length > 0 ? groupOrdersByMonth(history) : {};

  return (
      <View style={styles.containerNo}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={34} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>History</Text>
          </View>
        <View style={styles.container}>
          
          {Deliveryloading ? (
            <Text>Loading...</Text>
          ) : history?.length > 0 ? (
            Object.keys(groupedDeliveries).map((month) => (
              <Section key={month} title={month} data={groupedDeliveries[month]} />
            ))
          ) : (
            <View style={styles.noHistoryContainer}>
              <Text style={styles.noHistoryText}>No history available.</Text>
            </View>
          )}
          {Deliveryerror && (
            <Text style={{ color: 'red', textAlign: 'center' }}>
              Error fetching history: {historyerror}
            </Text>
          )}
        </View>
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleSymbol: {
    fontSize: 16,
  },
  filterButton: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AssignFile;
