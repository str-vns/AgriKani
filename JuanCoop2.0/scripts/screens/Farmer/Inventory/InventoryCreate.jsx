import React, { useCallback, useEffect, useState } from "react";
import styles from "@screens/stylesheets/Inventory/inventory";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "native-base";
import { createInventory } from "@redux/Actions/inventoryActions";


const InventoryCreate = (props) => {
    const { item } = props.route.params;

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { Invloading, Invsuccess, Inverror } = useSelector((state) => state.invent)
    const [unitName , setUnitName] = useState('')
    const [metricUnit , setMetricUnit] = useState('kg')
    const [unitPrice , setUnitPrice] = useState('')
    const [quantity , setQuantity] = useState('')
    const [errorsmess, setErrorMess] = useState('')
    const [token, setToken] = useState(null)

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


        useEffect(() => {
          if (Inverror) {
            // setErrorMess(Inverror);
            const timer = setTimeout(() => {
              setErrorMess('');
            }, 3000);
        
            // Cleanup the timeout
            return () => clearTimeout(timer);
          }
        }, [Inverror]);

    const handleCreateInventory = (item) => {

        if(unitName === '' || unitPrice === '' || quantity === ''){
            setErrorMess("Please fill all fields")
            setTimeout(() => {
                setErrorMess('')
            }, 3000)
        } else if(quantity <= 0 ){
            setErrorMess("Quantity must be greater than 0")
            setTimeout(() => {
                setErrorMess('')
            }, 3000)
        } else if(quantity > 100 ){
            setErrorMess("Quantity must be not over 100")
            setTimeout(() => {
                setErrorMess('')
            }, 3000)
        } else if(unitPrice > 20000 ){
            setErrorMess("Price must be not over ₱ 20000")
            setTimeout(() => {
                setErrorMess('')
            }, 3000)
        } else if(unitPrice <= 0 ){
            setErrorMess("Price must be not less than ₱ 0")
            setTimeout(() => {
                setErrorMess('')
            }, 3000)
        } else {
           const inventory = {
                unitName,
                metricUnit,
                price: unitPrice,
                quantity,
                productId: item._id
           }
            //   console.log(inventory)
           dispatch(createInventory(inventory, token))
           navigation.navigate("InventoryDetail", { Inv: item });
        }
      
    }

    const backButton = () => {
        navigation.goBack()
      };

    return (
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            
        <Text style={styles.label}>Unit</Text>
      <View style={styles.splitContainer}>
      
        <TextInput
          placeholder="Enter Unit"
          style={styles.inputLeft}
          value={unitName}
          onChangeText={(text) => setUnitName(text)}
        />
      
        <View style={styles.inputRight}>
          <Picker
            selectedValue={metricUnit}
            onValueChange={(itemValue) => setMetricUnit(itemValue)}
            style={styles.pickerStyle}
          >
            <Picker.Item label="KG" value="kg" />
            <Picker.Item label="LB" value="lb" />
            <Picker.Item label="G" value="g" />
            <Picker.Item label="L" value="l" />
            <Picker.Item label="ML" value="ml" />
            <Picker.Item label="PCS" value="pcs" />
            <Picker.Item label="OZ" value="oz" />
          </Picker>
        </View>
      </View>

          <Text style={styles.label}>Price</Text>
          <TextInput
            placeholder="Enter Product of Price"
            value={unitPrice}
            onChangeText={(text) => setUnitPrice(text)}
            style={styles.input}
            keyboardType="numeric"
          />

  <Text style={styles.label}>Quantity</Text>
          <TextInput
            placeholder="Enter Quantity of Product"
            value={quantity}
            onChangeText={(text) => setQuantity(text)}
            style={styles.input}
            keyboardType="numeric"
          />

          {errorsmess ? <Text style={styles.error}>{errorsmess}</Text> : null}
          <TouchableOpacity
  style={[styles.saveButton, Invloading && styles.disabledButton]}
  onPress={() => handleCreateInventory(item)}
  disabled={Invloading}
>
  {Invloading ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={styles.saveButtonText}>Add Inventory</Text>
  )}
</TouchableOpacity>
        </ScrollView>
      </View>
    )

  
}

export default InventoryCreate;