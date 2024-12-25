import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const orders = {
  December: [
    { id: '12345678', status: 'Delivered' },
    { id: '12345679', status: 'In Transit' },
    { id: '12345680', status: 'Assigned' },
    { id: '12345681', status: 'In Transit' },
  ],
  November: [
    { id: '12345682', status: 'Delivered' },
    { id: '12345683', status: 'In Transit' },
    { id: '12345684', status: 'Assigned' },
    { id: '12345685', status: 'In Transit' },
  ],
  October: [
    { id: '12345686', status: 'Assigned' },
    { id: '12345687', status: 'Assigned' },
    { id: '12345688', status: 'In Transit' },
  ],
  September: [
    { id: '12345689', status: 'Delivered' },
    { id: '12345690', status: 'Assigned' },
  ],
};

const statusColors = {
  Delivered: '#28a745', // Green
  'In Transit': '#f39c12', // Orange
  Assigned: '#007bff', // Blue
};

const OrderItem = ({ order }) => (
  <View style={styles.orderItem}>
    <Text style={styles.orderId}>order#{order.id}</Text>
    <View style={[styles.statusBadge, { backgroundColor: statusColors[order.status] }]}>
      <Text style={styles.statusText}>{order.status}</Text>
    </View>
  </View>
);

const Section = ({ title, data }) => {

  const [expanded, setExpanded] = useState(false);
  const [showAssignedOnly, setShowAssignedOnly] = useState(false);

  const displayedData = showAssignedOnly
    ? data.filter((order) => order.status === 'Assigned')
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
              {showAssignedOnly ? 'Show All' : 'Show Assigned Only'}
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
  const navigation = useNavigation()
  return (
    <View style={styles.containerNo}>
    <View style={styles.header}>
    <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.openDrawer()}>
      <Ionicons name="menu" size={34} color="black" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>History</Text>
  </View>
    <View style={styles.container}>
     
      {Object.keys(orders).map((month) => (
        <Section key={month} title={month} data={orders[month]} />
      ))}
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
