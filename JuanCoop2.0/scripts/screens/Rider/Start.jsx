import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const start = () => {
  const navigation = useNavigation();

  const handleUseMyLocation = () => {
    Alert.alert("Location Enabled", "You have enabled location services.");
    navigation.navigate('Home'); 
  };

  return (
    
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://via.placeholder.com/600x800' }} 
        style={styles.background}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Enable your location</Text>
          <Text style={styles.subtitle}>
            Choose your location to start finding the requests around you
          </Text>
          <TouchableOpacity style={styles.button} 
           onPress={() => navigation.navigate("Register")}>
            <Text style={styles.buttonText}>Use my location</Text>
          </TouchableOpacity>
        
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFC107',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipText: {
    color: '#007BFF',
    fontSize: 14,
    marginTop: 10,
  },
});

export default start;
