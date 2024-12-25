import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const Assign = () => {
  const [orders, setOrders] = useState([
    { id: '1', orderId: 'order#12345678', status: 'Assigned' },
    { id: '2', orderId: 'order#12345678', status: 'Already Assigned' },
    { id: '3', orderId: 'order#12345678', status: 'Assign' },
    { id: '4', orderId: 'order#12345678', status: 'Assign' },
  ]);

  const handleAssign = (id) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: 'Assigned' } : order
      )
    );
  };

  const renderOrder = ({ item }) => {
    return (
      <View style={styles.orderRow}>
        <Text style={styles.orderText}>{item.orderId}</Text>
        <TouchableOpacity
          style={[
            styles.orderButton,
            item.status === 'Assigned' && styles.assignedButton,
            item.status === 'Already Assigned' && styles.alreadyAssignedButton,
          ]}
          onPress={() => item.status === 'Assign' && handleAssign(item.id)}
          disabled={item.status !== 'Assign'}
        >
          <Text
            style={[
              styles.orderButtonText,
              item.status === 'Already Assigned' && styles.disabledButtonText,
            ]}
          >
            {item.status}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.riderInfo}>
        <Image
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEL1_AFmfB9y1WAQ_lEcF7z8DFGDPQpycmw&s',
          }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.riderNameTitle}>Rider Name:</Text>
          <Text style={styles.riderName}>Alexandra C. Aquino</Text>
        </View>
      </View>
      <Text style={styles.instructions}>Assign order for this rider.</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f9f9f9',
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
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    orderText: {
      flex: 1,
      fontSize: 14,
      color: '#333',
    },
    orderButton: {
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 8,
      backgroundColor: '#D3D3D3',
      minWidth: 120, // Ensures all buttons have the same width
      alignItems: 'center', // Centers the text inside the button
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
