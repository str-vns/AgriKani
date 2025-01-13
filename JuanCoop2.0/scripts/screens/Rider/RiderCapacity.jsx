import React, { useEffect, useState } from "react";
import { View, Text,  TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Modal, ActivityIndicator} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "@screens/stylesheets/Rider/Register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { maxCapacity } from "@redux/Actions/driverActions";

const RiderCapacity = (props) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const driverId = props.route.params.driverId;
    const { Deliveryloading , errors } = useSelector((state) => state.driverApi);
    const [capacity, setCapacity] = useState(0);
    const [token, setToken] = useState(null);
    const [error, setError] = useState("");

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

    const handleCancel = async () => {
        setCapacity("");
    navigation.goBack();
    }
 
    const handleSave = async () => {

    if (!setCapacity) {
        setError("Please Add Number of Capacity");
        return;
    } else if (isNaN(capacity)) {
        setError("Capacity must be a number");
        return;
    } else if (capacity < 5) {
        setError("Capacity must be greater than 4");
        return;
    }

    const data = {
        capacity: capacity,
    };

    dispatch(maxCapacity(driverId.driverId, data, token));
    setCapacity("");
    navigation.navigate("Riderlist");
    }

  

  return (
    
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent2}>


        <View style={styles.form}>
            <Text>Capacity</Text>
               <TextInput
                          style={styles.input}
                          placeholder="Enter capacity"
                          value={capacity}
                          onChangeText={(text) => setCapacity(text)}
                          keyboardType="numeric"
                        />
      </View>

       
                {errors || error && <Text style={styles.errorText}>{errors || error}</Text>}
      </ScrollView>
  
    
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} 
        onPress={() => handleSave()}
        disabled={Deliveryloading}>
          {Deliveryloading ? ( <ActivityIndicator size={"small"} color="#fff" /> ) : ( <Text style={styles.saveText}>Save</Text> )}
  
        </TouchableOpacity>
      </View>


    </KeyboardAvoidingView>
  );
};


export default RiderCapacity;
