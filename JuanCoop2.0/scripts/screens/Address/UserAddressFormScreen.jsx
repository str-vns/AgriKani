import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addAddress, updateAddress } from '@src/redux/Actions/addressActions';
import AuthGlobal from "@redux/Store/AuthGlobal";

const UserAddressFormScreen = ({ route, navigation }) => {
  const { addressData = {}, isEdit = false } = route.params || {};
  const context = useContext(AuthGlobal);
  const userId = context?.stateUser?.userProfile?._id;

  const dispatch = useDispatch();
  const [form, setForm] = useState({
    fullName: addressData.fullName || '',
    phoneNum: addressData.phoneNum || '',
    region: addressData.region || '',
    province: addressData.province || '',
    city: addressData.city || '',
    barangay: addressData.barangay || '',
    address: addressData.address || '',
    postalCode: addressData.postalCode || '',
  });

  useEffect(() => {
    if (isEdit && addressData) {
      setForm({ ...form, ...addressData });
    }
  }, [addressData, isEdit]);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    const payload = { ...form, userId };
    if (isEdit) {
      dispatch(updateAddress(payload, addressData._id));
    } else {
      dispatch(addAddress(payload));
    }
    navigation.goBack(); // Go back to the previous screen after submission
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>{isEdit ? 'Edit Address' : 'Add Address'}</Text>
      {['fullName', 'phoneNum', 'region', 'province', 'city', 'barangay', 'address', 'postalCode'].map((field, index) => (
        <TextInput
          key={index}
          placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          value={form[field]}
          onChangeText={(value) => handleChange(field, value)}
          style={styles.input}
          placeholderTextColor="#999"
        />
      ))}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isEdit ? 'Update Address' : 'Add Address'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    marginBottom: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default UserAddressFormScreen;