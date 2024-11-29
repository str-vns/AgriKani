import React, { useEffect, useContext, useState } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses, deleteAddress } from "@src/redux/Actions/addressActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const UserAddress = ({ route, navigation }) => {
  const context = useContext(AuthGlobal);
  const userId = context?.stateUser?.userProfile?._id;
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.addresses.data);
  const loading = useSelector((state) => state.addresses.loading);
  const error = useSelector((state) => state.addresses.error);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAddresses(userId));
    }
  }, [dispatch, userId]);

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
    navigation.navigate('UserAddressFormScreen', { addressData: address, isEdit: true });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your Addresses</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('UserAddressFormScreen')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add New Address</Text>
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
              <Text style={styles.addressTitle}>{address.fullName}</Text>
              <Ionicons name="location-outline" size={20} color="#f7b900" />
            </View>
            <Text style={styles.addressText}>Phone: {address.phoneNum}</Text>
            <Text style={styles.addressText}>
              {address.address}, {address.barangay}, {address.city}, {address.province}, {address.region}
            </Text>
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
    padding: 20,
    backgroundColor: "#f9fafc",
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7b900",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
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
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  addressTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  addressText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#f7b900",
    borderRadius: 6,
    width: '45%',
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default UserAddress;