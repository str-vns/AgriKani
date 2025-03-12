import React, { useEffect, useContext, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses, deleteAddress } from "@src/redux/Actions/addressActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";

const AddressList = ({ route, navigation }) => {
  const context = useContext(AuthGlobal);
  const userId = context?.stateUser?.userProfile?._id;
  const { cartItems } = route.params;
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.addresses.data);
  const loading = useSelector((state) => state.addresses.loading);
  const error = useSelector((state) => state.addresses.error);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
useFocusEffect(
  useCallback(() => {
    if (userId) {
      dispatch(fetchAddresses(userId));
    }
  },[dispatch, userId])
)


  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            dispatch(deleteAddress(id));
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleEdit = (address) => {
    navigation.navigate('AddressEdit', { addressData: address });
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    navigation.navigate('Payment', {cartItems, addressData: address });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your Addresses</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddressForm')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}

      {Array.isArray(addresses) && addresses.length > 0 ? (
        addresses.map((address) => (
          <TouchableOpacity
            key={address._id}
            onPress={() => handleSelectAddress(address)}
            style={styles.addressContainer}
          >
            <View style={styles.titleRow}>
              <Text style={styles.addressTitle}>{address.address},  {address.barangay}, {address.city}</Text>
              <Ionicons name="location-outline" size={20} color="#f7b900" />
            </View>
            <Text style={styles.addressText}>Phone: {address.userId?.phoneNum}</Text>
            <Text style={styles.addressText}>Postal Code: {address.postalCode}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleEdit(address)}
              >
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleDelete(address._id)}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

        ))
      ) : (
        <Text style={styles.noAddressText}>No addresses found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9fafc",
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7b900",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
  },
  loadingText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  noAddressText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  addressContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  addressText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f7b900",
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 4,
  },
});

export default AddressList;