import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, Button } from 'react-native';
import MapView from 'react-native-maps';
import FooterNav from '../../../components/footer'; 

const UserHome = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search Farmer near me..."
            style={styles.searchInput}
          />
        </View>

        {/* Map View */}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 40.7128,
            longitude: -74.0060,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        />

        {/* Farmers List */}
        <View style={styles.farmerList}>
          <Text style={styles.sectionTitle}>Farmers</Text>
          <View style={styles.farmerCard}>
            <Image
            source={require('@assets/img/farmer1.jpg')}
              style={styles.farmerImage}
            />
            <View style={styles.farmerInfo}>
              <Text style={styles.farmerName}>Cameron Williamson</Text>
              <Text style={styles.farmerAddress}>
                2972 Westheimer Rd. Santa Ana, Illinois 85486
              </Text>
            
            </View>
          </View>
          
        </View>
        
      </ScrollView>
      <FooterNav /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    backgroundColor: '#fefdf9',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Offset of the shadow
    shadowOpacity: 0.2, // How transparent the shadow is
    shadowRadius: 4, // Blur radius
    elevation: 5, // Sets the shadow depth for Android
  },
  map: {
    height: 200,
    width: '100%',
  },
  farmerList: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  farmerCard: {
    flexDirection: 'row',
    alignItems: 'center', // Aligns items vertically in the center
    padding: 10,
    backgroundColor: '#fefdf9',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Offset of the shadow
    shadowOpacity: 0.2, // How transparent the shadow is
    shadowRadius: 4, // Blur radius
    elevation: 5, // Sets the shadow depth for Android
  },
  farmerImage: {
    width: 60, // Increased size for better alignment
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  farmerInfo: {
    flex: 1, // Makes sure the text takes up the remaining space
  },
  farmerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  farmerRole: {
    fontSize: 16,
    color: '#666',
    marginTop: 2, // Adding space between name and role
  },
  farmerAddress: {
    fontSize: 14,
    color: '#888',
    marginTop: 5, // Spacing between role and address
  },
});



export default UserHome;
