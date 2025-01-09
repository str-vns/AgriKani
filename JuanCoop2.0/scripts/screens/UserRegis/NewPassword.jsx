import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    if (newPassword === confirmPassword) {
      // Logic for saving the new password
      alert('Password changed successfully!');
    } else {
      alert('Passwords do not match. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Password</Text>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3064/3064197.png' }} // Replace with your desired lock icon URL
        style={styles.icon}
      />
      <Text style={styles.instructions}>
        Your New Password Must Be Different {"\n"} from Previously Used Password.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#A0A0A0"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#A0A0A0"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6C6C6C',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    color: '#000',
  },
  changePassword: {
    fontSize: 14,
    color: '#FF4500',
    textDecorationLine: 'underline',
    marginBottom: 30,
  },
  saveButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFB100',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default NewPassword;
