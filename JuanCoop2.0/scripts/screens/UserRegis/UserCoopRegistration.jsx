import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';

const StartScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        {/* Farmer Icon */}
        <Image source={require('@assets/img/Loogo.png')} style={styles.image} />

        {/* Title */}
        <Text style={styles.title}>AgriKaAni</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Empowering Farmers, Uniting Communities for Agricultural Success
        </Text>

        {/* Next Button */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('CoopRegistration')}
          activeOpacity={0.7} 
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center', // Center content on the screen
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Light background to be easy on the eyes
    padding: 30, // Slightly larger padding for more space
    flex: 1,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30, // Increased space between image and title
  },
  title: {
    fontSize: 32, // Larger title for emphasis
    fontWeight: '700', // Bolder font weight
    color: '#000000', // Dark Slate color for a modern look
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 50, // More space below subtitle
    color: '#696969', // A softer grey color for readability
    paddingHorizontal: 20, // Padding to prevent text touching edges
  },
  button: {
    backgroundColor: '#FFA500', // Brighter yellow for attention
    paddingVertical: 15,
    paddingHorizontal: 40, // More horizontal padding for a bigger button
    borderRadius: 30, // More rounded corners for a modern feel
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // For Android shadow effect
  },
  buttonText: {
    color: '#000', // Black text for contrast
    fontSize: 20, // Slightly larger text for readability
    fontWeight: 'bold',
  },
});

export default StartScreen;
