import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { typeCreate } from "@redux/Actions/typeActions";
import AuthGlobal from "@redux/Store/AuthGlobal";

const TypeCreate = ({ navigation }) => {
  const [typeName, setTypeName] = useState("");
  const [token, setToken] = useState("");

  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);

  // Accessing state from Redux store
  const { loading, error, success } = useSelector((state) => state.typesCreate || {});

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const jwt = await AsyncStorage.getItem("jwt");
        if (jwt) setToken(jwt);
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    // Handle success or error after the dispatch
    if (success) {
      Alert.alert("Success", "Type created successfully!");
      setTypeName("");
      navigation.goBack();
    }
    if (error) {
      Alert.alert("Error", error || "Failed to create type. Please try again.");
    }
  }, [success, error]);

  const handleCreateType = () => {
    if (!typeName.trim()) {
      Alert.alert("Validation Error", "Type name is required!");
      return;
    }

    const typeData = {
      typeName, // Fixed key to match backend requirements
      user: context?.stateUser?.userProfile?._id,
    };

    if (!token) {
      Alert.alert("Error", "User is not authenticated. Please log in.");
      return;
    }

    dispatch(typeCreate(typeData, token));
  };

  return (
    <View style={styles.container}>
  
      <Text style={styles.title}>Create New Type</Text>

      <TextInput
        style={styles.input}
        placeholder="Type Name"
        value={typeName}
        onChangeText={setTypeName}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateType} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Create Type</Text>}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  backButton: { position: "absolute", top: 16, left: 16, zIndex: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center", marginTop: 32 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 16, elevation: 2 },
  button: { backgroundColor: "#FEC120", padding: 12, borderRadius: 8, alignItems: "center", justifyContent: "center", marginTop: 16 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  errorText: { color: "red", marginTop: 16, textAlign: "center" },
});

export default TypeCreate;
