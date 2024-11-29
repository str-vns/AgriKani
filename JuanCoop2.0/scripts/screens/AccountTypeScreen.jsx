import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Import Feather icons or any other icon library
// import styles from './Farmer/css/styles';

const AccountTypeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        
        {/* Back Arrow */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Choose Account Type</Text>

        {/* Farmer Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('FarmerLogin')} // Make sure this corresponds to your Farmer Stack
        >
          <Image
            source={require('@assets/img/farmer.png')}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Farmer</Text>
        </TouchableOpacity>

        {/* Buyer Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UserSignIn')} // Ensure 'start' is correctly defined in UserStackNavigator
        >
          <Image
            source={require('@assets/img/buyer.png')}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Buyer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    flex: 1,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    marginTop: 30,
    top: 20,
    left: 20,
    zIndex: 1, // Ensure the back button is on top of other components
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#fff', // Light yellow background for buttons
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 200, // Button width matches the image width
    elevation: 3, // Add a bit of shadow for depth
  },
  icon: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Black color for text
  },
});

export default AccountTypeScreen;