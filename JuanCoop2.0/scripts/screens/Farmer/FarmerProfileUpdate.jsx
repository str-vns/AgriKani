import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';  // Import the dropdown picker
import Icon from 'react-native-vector-icons/Feather';  // Feather icons
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const FarmerProfileUpdate = ({ navigation }) => {
  // Farmer Information States
  const [firstName, setFirstName] = useState('Juan');
  const [lastName, setLastName] = useState('Dela Cruz');
  const [email, setEmail] = useState('JuanDelaCruz@gmail.com');
  const [openAge, setOpenAge] = useState(false);  // State for opening the age dropdown
  const [age, setAge] = useState('30');  // Default age value
  const [ageItems, setAgeItems] = useState(Array.from({ length: 83 }, (_, i) => ({ label: (i + 18).toString(), value: (i + 18).toString() })));
  const [openGender, setOpenGender] = useState(false);  // State for opening the gender dropdown
  const [gender, setGender] = useState('Male');  // Default gender value
  const [genderItems, setGenderItems] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ]);

  // Farm Information States
  const [farmName, setFarmName] = useState('Sample Farm');
  const [address, setAddress] = useState('123 Farm St');
  const [city, setCity] = useState('Manila');
  const [postalCode, setPostalCode] = useState('1000');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const handleSaveChanges = () => {
    alert('Profile Updated Successfully');
    // Add your logic to handle profile update here
  };

  return (
    <View style={styles.container}>
    <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Farmer Profile</Text>
      </View>

    <ScrollView contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps="handled">

        {/* Profile Image */}
        <TouchableOpacity style={styles.uploadButton}>
          <Image source={image ? { uri: image } : require('@assets/img/farmer.png')} style={styles.uploadIcon} />
          <Text style={styles.uploadText}>Edit Profile Picture</Text>
        </TouchableOpacity>

        {/* Farmer Information */}
        <Text style={styles.sectionTitle}>Farmer Information</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]} // Half-width input
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={[styles.input, styles.halfInput]} // Half-width input
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.halfInput, openAge ? { zIndex: 3000 } : { zIndex: 1 }]}>
            <DropDownPicker
              open={openAge}
              value={age}
              items={ageItems}
              setOpen={setOpenAge}
              setValue={setAge}
              setItems={setAgeItems}
              placeholder="Select Age"
              zIndex={3000}
              zIndexInverse={1000}
              style={styles.dropdownStyle}
              dropDownContainerStyle={styles.dropdownContainerStyle}
            />
          </View>

          <View style={[styles.halfInput, openGender ? { zIndex: 2000 } : { zIndex: 1 }]}>
            <DropDownPicker
              open={openGender}
              value={gender}
              items={genderItems}
              setOpen={setOpenGender}
              setValue={setGender}
              setItems={setGenderItems}
              placeholder="Select Gender"
              zIndex={2000}
              zIndexInverse={1000}
              style={styles.dropdownStyle}
              dropDownContainerStyle={styles.dropdownContainerStyle}
            />
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Farm Information */}
        <Text style={styles.sectionTitle}>Farm Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Farm Name"
          value={farmName}
          onChangeText={setFarmName}
        />

        <TextInput
          style={styles.input}
          placeholder="Farm Address"
          value={address}
          onChangeText={setAddress}
        />

        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />

        <TextInput
          style={styles.input}
          placeholder="Postal Code"
          value={postalCode}
          onChangeText={setPostalCode}
          keyboardType="numeric"
        />

        {/* Map for farm location */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={location}
            onRegionChangeComplete={(region) => setLocation(region)}
          >
            <Marker
              coordinate={location}
              draggable
              onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)}
            />
          </MapView>
        </View>

        {/* Save Changes Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
        </ScrollView>
    </View>  
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        elevation: 2,
      },
      headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
        color: '#333',
      },
      scrollViewContainer: {
        paddingHorizontal: 20,
      },
  uploadButton: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  uploadText: {
    fontSize: 16,
    color: '#FFA500',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  dropdownStyle: {
    backgroundColor: '#F5F5F5',
    borderColor: '#ccc',
  },
  dropdownContainerStyle: {
    backgroundColor: '#F5F5F5',
    borderColor: '#ccc',
  },
  halfInput: {
    width: '48%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  mapContainer: {
    height: 200,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  saveButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FarmerProfileUpdate;