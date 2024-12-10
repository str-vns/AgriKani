import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import styles from '../css/styles';
import { useSocket } from '../../../SocketIo';
const OrderUpdate = ({ route, navigation }) => {
  const { order } = route.params || {};
  const socket = useSocket();
  const [id, setId] = useState(order ? order.id : '');
  const [noOfItems, setNoOfItems] = useState(order ? order.no_of_items : '');
  const [totalPrice, setTotalPrice] = useState(order ? order.total_price : '');
  const [customerName, setCustomerName] = useState(order ? order.customer_name : '');
  const [orderDate, setOrderDate] = useState(order ? order.order_date : '');
  const [deliveryAddress, setDeliveryAddress] = useState(order ? order.delivery_address : '');
  const [paymentStatus, setPaymentStatus] = useState(order ? order.payment_status : 'Unpaid');
  const [status, setStatus] = useState(order ? order.status : 'Pending');
  const [openStatus, setOpenStatus] = useState(false);
  const [statusItems, setStatusItems] = useState([
    { label: 'Pending', value: 'Pending' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
  ]);

  const handleSave = () => {
    if (!id || !noOfItems || !totalPrice || !status || !customerName || !orderDate || !deliveryAddress) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
  
  // socket.emit("sendNotification", {
  //   senderName: 
  // })
    
    Alert.alert('Success', 'Order saved successfully.');
    navigation.goBack();
  };

  useEffect(() => {
    if (!order) {
      // Auto-generate a new ID for new orders (for design purposes)
      setId(Math.floor(Math.random() * 10000).toString());
    }
  }, [order]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{order ? 'Edit Order' : 'Add New Order'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <TextInput
          style={styles.input}
          placeholder="Order ID"
          value={id}
          onChangeText={setId}
          editable={false} 
        />
        <TextInput
          style={styles.input}
          placeholder="Customer Name"
          value={customerName}
          onChangeText={setCustomerName}
        />
        <TextInput
          style={styles.input}
          placeholder="Order Date"
          value={orderDate}
          onChangeText={setOrderDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Number of Items"
          value={noOfItems}
          onChangeText={setNoOfItems}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Total Price"
          value={totalPrice}
          onChangeText={setTotalPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Delivery Address"
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
        />

        <DropDownPicker
          open={openStatus}
          value={status}
          items={statusItems}
          setOpen={setOpenStatus}
          setValue={setStatus}
          setItems={setStatusItems}
          placeholder="Select Status"
          style={styles.dropdownStyle}
          dropDownContainerStyle={styles.dropdownContainerStyle}
        />

        <DropDownPicker
          open={openStatus}
          value={paymentStatus}
          items={[
            { label: 'Paid', value: 'Paid' },
            { label: 'Unpaid', value: 'Unpaid' },
          ]}
          setOpen={setOpenStatus}
          setValue={setPaymentStatus}
          placeholder="Select Payment Status"
          style={styles.dropdownStyle}
          dropDownContainerStyle={styles.dropdownContainerStyle}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{order ? 'Save Changes' : 'Add Order'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default OrderUpdate;