import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';  // Import the dropdown picker
import Icon from 'react-native-vector-icons/Feather';  // Feather icons

const FarmerRegistration = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openAge, setOpenAge] = useState(false);  // State for opening the age dropdown
  const [age, setAge] = useState('18');  // Default age value
  const [ageItems, setAgeItems] = useState(Array.from({ length: 83 }, (_, i) => ({ label: (i + 18).toString(), value: (i + 18).toString() })));
  const [openGender, setOpenGender] = useState(false);  // State for opening the gender dropdown
  const [gender, setGender] = useState('Male');  // Default gender value
  const [genderItems, setGenderItems] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {/* Back Arrow */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={40} color="#000" />
        </TouchableOpacity>

        {/* Logo and Title */}
        <Image source={require('@assets/img/Loogo.png')} style={styles.logo} />
        <Text style={styles.mainTitle}>Farmer Registration</Text>
        <Text style={styles.subtitle}>Fill out the form below to sign up</Text>

        {/* Profile Picture Upload */}
        <TouchableOpacity style={styles.uploadButton}>
          <Image source={require('@assets/img/profile.png')} style={styles.uploadIcon} />
          <Text style={styles.uploadText}>Upload Profile Picture</Text>
        </TouchableOpacity>

        {/* First Name and Last Name (Two fields side by side) */}
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

        {/* Age and Gender Dropdown (Two fields side by side) */}
        <View style={styles.row}>
          {/* Age Dropdown */}
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

          {/* Gender Dropdown */}
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

        {/* Email Input (Full width) */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password and Confirm Password (Two fields side by side) */}
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Certificate Upload (Full width) */}
        <TouchableOpacity style={styles.uploadButton}>
          <Image source={require('@assets/img/certificate.png')} style={styles.uploadIcon} />
          <Text style={styles.uploadText}>Upload Certificate</Text>
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('OTPVerification')}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        {/* Already have an account */}
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.loginLink} onPress={() => navigation.navigate('FarmerLogin')}>
            Login
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
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
    backgroundColor: '#F5F5F5',  // Light background color for the closed dropdown
    borderColor: '#ccc',         // Optional: Customize the border
  },
  dropdownContainerStyle: {
    backgroundColor: '#F5F5F5',  // Background color for the dropdown container (when opened)
    borderColor: '#ccc',         // Optional: Customize the border of the opened dropdown
  },
  halfInput: {
    width: '48%',
  },
  dropdown: {
    zIndex: 2000,  // Keep this for positioning issues
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  uploadIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  uploadText: {
    fontSize: 16,
    color: '#666',
  },
  registerButton: {
    backgroundColor: '#FEC120',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  registerButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    color: '#000',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
});

export default FarmerRegistration;