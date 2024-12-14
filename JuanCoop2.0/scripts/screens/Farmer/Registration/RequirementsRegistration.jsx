import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { registerCoop } from "@redux/Actions/coopActions";
import { useNavigation } from "@react-navigation/native";
import styles from "@screens/stylesheets/requirementsRegister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";

const RequirementsRegistration = (props) => {
  const { registration } = props.route.params;
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const [businessPermit, setBusinessPermit] = useState(null);
  const [corCDA, setCorCDA] = useState("");
  const [tinNumber, setTinNumber] = useState("");
  const [orgStructures, setOrgStructures] = useState("");
  const [errors, setErrors] = useState(null);
  const [token, setToken] = useState("");
  const [file, setFile] = useState("");
  const [file2, setFile2] = useState("");
  const [file3, setFile3] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //token
  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        setToken(res);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };

    fetchJwt();
  }, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      console.log("Document Picker Result:", result);

      if (result !== null) {
        const file = result.assets[0];
        setBusinessPermit(file.uri);
        setFile(file.name);
      } else {
        console.log("No document selected");
      }
    } catch (error) {
      console.error("Error selecting document:", error);
    }
  };

  const pickDocument2 = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      console.log("Document Picker Result:", result);

      if (result !== null) {
        const file = result.assets[0];
        setCorCDA(file.uri);
        setFile2(file.name);
      } else {
        Alert.alert("Error", "No document selected");
      }
    } catch (error) {
      console.error("Error selecting document:", error);
      Alert.alert("Error", "An error occurred while selecting the document.");
    }
  };

  const pickDocument3 = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      console.log("Document Picker Result:", result);

      if (result !== null) {
        const file = result.assets[0];
        setOrgStructures(file.uri);
        setFile3(file.name);
      } else {
        Alert.alert("Error", "No document selected");
      }
    } catch (error) {
      console.error("Error selecting document:", error);
      Alert.alert("Error", "An error occurred while selecting the document.");
    }
  };

  const handleTinInput = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    const formattedValue = numericValue
      .replace(/(\d{3})(\d{3})(\d{3})(\d{0,3})/, "$1-$2-$3-$4")
      .replace(/-$/, ""); // Remove trailing hyphen if incomplete

    setTinNumber(formattedValue);
  };

  const handleRegisterFarm = () => {
    setIsLoading(true);
    try {
      if (!businessPermit || !corCDA || !orgStructures || !tinNumber) {
        setErrors("Please fill all fields");
        setIsLoading(false);
        return;
      }
      const coopRegistration = {
        tinNumber,
        businessPermit,
        corCDA,
        orgStructures,
        ...registration,
      };
      setIsLoading(false);
      dispatch(registerCoop(coopRegistration, token));

        setTinNumber("");
        setBusinessPermit("");
      setCorCDA("");
      setOrgStructures("");

        setIsLoading(false);
        Alert.alert("Success", "Coop registered successfully Please Wait For Approval We will notify you in Email once approved");
        navigate.navigate("Home");
    } catch (error) {
      console.error("Error registering farm: ", error);
      setErrors("Error registering farm. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigate.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Farm Registration</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <Text style={styles.label}>Tin Number</Text>
          <TextInput
            style={styles.input}
            placeholder="000-000-000-000"
            value={tinNumber}
            onChangeText={handleTinInput}
            keyboardType="numeric"
            maxLength={15} // 12 digits + 3 hyphens
          />
        </View>

        <Text style={styles.label}>Business Permit</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputFile}
            placeholder="Business Permit File"
            value={file}
            editable={false}
          />
          <TouchableOpacity style={styles.buttonFile} onPress={pickDocument}>
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Certificate of Registration</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputFile}
            placeholder="COR File"
            value={file2}
            editable={false}
          />
          <TouchableOpacity style={styles.buttonFile} onPress={pickDocument2}>
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Organization Structure</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputFile}
            placeholder="Organization Structure File"
            value={file3}
            editable={false}
          />

          <TouchableOpacity style={styles.buttonFile} onPress={pickDocument3}>
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
        </View>

        {errors ? <Text style={styles.error}>{errors}</Text> : null}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => handleRegisterFarm()}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Register Cooperative</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default RequirementsRegistration;
