import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { typeUpdate } from "@redux/Actions/typeActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { useNavigation } from "@react-navigation/native";

const TypeUpdate = ({ route }) => {
  const singleType = route.params.type; // Receive the type to update
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();

  const [typeName, setTypeName] = useState(singleType?.typeName || "");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState("");
  const typeId = singleType?._id;

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

  const handleUpdateType = async () => {
    if (!typeName) {
      setErrors("Type name is required.");
      return;
    }

    const typeItem = {
      typeName,
    };

    try {
      dispatch(typeUpdate(typeId, typeItem, token));
      setTimeout(() => {
        setErrors("");
        Alert.alert("Success", "Type updated successfully!");
        navigation.navigate("TypeList");
      }, 5000);
    } catch (error) {
      console.error("Error updating type:", error);
      setErrors("Failed to update type. Please try again.");
    }
  };

  const backButton = () => {
    navigation.navigate("TypeList");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Update Type</Text>

      <ScrollView>
        {/* Type Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Type Name"
          value={typeName}
          onChangeText={setTypeName}
        />

        {/* Error Message */}
        {errors && <Text style={styles.errorText}>{errors}</Text>}

        {/* Update Button */}
        <TouchableOpacity style={styles.button} onPress={handleUpdateType}>
          <Text style={styles.buttonText}>Update Type</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    marginTop: 32, // Adjust to account for back button
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    elevation: 2,
  },
  button: {
    backgroundColor: "#FEC120",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 16,
    textAlign: "center",
  },
});

export default TypeUpdate;
