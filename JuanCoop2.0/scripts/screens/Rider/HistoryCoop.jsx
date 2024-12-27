import React, { useCallback, useContext, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { historyDeliveryCoop } from "@redux/Actions/orderActions";
import AuthGlobal from '@redux/Store/AuthGlobal';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    <Text style={styles.orderId}>Order#{order._id}</Text>
    <View style={[styles.statusBadge, { backgroundColor: statusColors[order.status] }]}>
      <Text style={styles.statusText}>{order.status}</Text>
    </View>
  </View>
);

const Section = ({ title, data }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.sectionHeader}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.toggleSymbol}>{expanded ? '▾' : '▸'}</Text>
      </TouchableOpacity>
      {expanded && (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <OrderItem order={item} />}
        />
      )}
    </View>
  );
};

const HistoryCoop = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { historyloading, history, historyerror } = useSelector((state) => state.deliveredhistory);
  const userId = context?.stateUser?.userProfile?._id;
  const [token, setToken] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const res = await AsyncStorage.getItem("jwt");
          if (res) {
            setToken(res);
            if (userId) {
              dispatch(historyDeliveryCoop(userId, res));
            }
          }
        } catch (error) {
          console.error('Error retrieving JWT:', error);
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
      
      {historyloading ? (
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
      {historyerror && (
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
  noHistoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noHistoryText: {
    fontSize: 18,
    color: '#888',
  },
});

export default HistoryCoop;
