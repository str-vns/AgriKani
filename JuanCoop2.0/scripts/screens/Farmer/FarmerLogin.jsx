import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Ionicons } from '@expo/vector-icons'; // For Google icon (optional)

const FarmerLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        
        {/* Back Arrow */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>

        {/* Logo Image */}
        <Image
          source={require('@assets/img/Loogo.png')} // Replace with the actual path to your logo
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Farmer Sign In</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Enter your email and password to access your account</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FarmerDashboard')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Separator for Google Sign In */}
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.orText}>or continue with</Text>
          <View style={styles.separator} />
        </View>

        {/* Google Sign-In Button */}
        <TouchableOpacity style={styles.googleButton}>
          <Ionicons name="logo-google" size={24} color="black" />
          <Text style={styles.googleButtonText}>Google</Text>
        </TouchableOpacity>

        {/* Footer Links: Terms and Privacy */}
        <Text style={styles.footerText}>
          By clicking continue, you agree to our{' '}
          <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </Text>

        {/* Sign-Up Prompt */}
        <Text style={styles.footerPrompt}>
          Don't have an account?{' '}
          <Text onPress={() => navigation.navigate('FarmerRegistration')} style={styles.footerLink}>
            Sign Up
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures the ScrollView takes up the whole screen
    backgroundColor: '#f7f7f7', // Light background for contrast
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#fff', // White background for the form area
    borderRadius: 10, // Adds a nice rounded corner effect
    elevation: 5, // For slight shadow on Android (can use shadow props for iOS)
  },
  logo: {
    width: 150, // Adjusted size for a sleeker look
    height: 150,
    alignSelf: 'center',
    marginBottom: 30, // Better spacing between logo and title
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1, // Ensures the back button stays on top
  },
  title: {
    fontSize: 22, // Larger title for emphasis
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333', // Darker text color for better readability
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666', // Medium gray for subtitling
  },
  input: {
    height: 50,
    borderColor: '#ddd', // Subtle border color
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9', // Light background for input fields
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2, // Slight shadow effect for depth
  },
  button: {
    backgroundColor: '#FFA500', // Yellow color for a bright call-to-action button
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4, // More shadow for the button
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
  orText: {
    color: '#888',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  footerText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginBottom: 10,
  },
  footerPrompt: {
    marginTop: 25,
    textAlign: 'center',
    color: '#888', // Light gray for the footer text
    fontSize: 14,
  },
  footerLink: {
    color: '#FFA500', // Same yellow as the button to tie the design together
    fontWeight: '600',
  },
});

export default FarmerLogin;