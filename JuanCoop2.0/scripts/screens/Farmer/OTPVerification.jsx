import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed

const OTPVerification = ({ navigation }) => {
  const [otp, setOtp] = useState('');

  const handleVerifyOtp = () => {
    // Handle OTP verification logic here
    navigation.navigate('FarmRegistration');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>OTP Verification</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.instructions}>Please enter the OTP sent to your phone</Text>

        <Text style={styles.label}>OTP Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp}>
          <Text style={styles.verifyButtonText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 3,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },

  content: {
    flex: 1,
    padding: 30, // Increased padding for a more spacious layout
    justifyContent: 'center',
  },
  instructions: {
    fontSize: 18,
    color: '#666', // Lighter color for instructions
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
    color: '#000',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 20,
    textAlign: 'center', // Center the OTP input
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // Add shadow and elevation for a modern look
  },
  verifyButton: {
    backgroundColor: '#FEC120',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5, // Create a 3D effect with shadow
  },
  verifyButtonText: {
    fontSize: 22, // Bigger text for the button
    color: '#000',
    fontWeight: 'bold',
  },
});

export default OTPVerification;