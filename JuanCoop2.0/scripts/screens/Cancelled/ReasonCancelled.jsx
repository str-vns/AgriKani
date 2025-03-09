import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, FlatList, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SingleCancelled } from "@redux/Actions/cancelledActions";
import styles from '@screens/stylesheets/Cancelled/infoDesign'

const ClientCancelled = (props) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const orderItemId = props?.route?.params?.order?._id;
  console.log("orderItemId", orderItemId)
  const orderItems = props?.route?.params?.order;
  const { loading, response, error } = useSelector((state) => state.cancelled);
  const [token, setToken] = useState(null);
  console.log(  "orderItems", orderItems)
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
  
  },[])

   useFocusEffect(
     useCallback(() => {
        if(token) {
          dispatch(SingleCancelled(orderItemId, token))
        }
     }, [orderItemId, token])
   )
  

  return (
   <SafeAreaView style={styles.safeContainer}>
         <ScrollView>
          <View style={styles.header}>
                   <TouchableOpacity style={styles.drawerButton} onPress={() => navigation.openDrawer()}>
                     <Ionicons name="menu" size={34} color="black" />
                   </TouchableOpacity>
                   <Text style={styles.headerTitle}>Reason of Cancel</Text>
                 </View>
          <View style={styles.container}>
          <Image 
     source={
       response?.cancelledBy?.image?.url 
         ? { uri: response.cancelledBy.image.url } 
         : require("@assets/img/buyer.png")
     } 
     style={styles.profileImage} 
   />
           <Text style={styles.cancelledByText}>
             Cancelled by: <Text style={styles.boldText}>{ response?.cancelledBy?.firstName} { response?.cancelledBy?.lastName}</Text>
           </Text>
   
   <View style={styles.orderItemsContainer}>
     <Text style={styles.orderTitle}>Order Items:</Text>
   
     
      <View style={styles.orderItem}>
        <Image
          source={{ uri: orderItems.product?.image[0]?.url || orderItems.image }}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{orderItems?.product?.productName}</Text>
          <Text style={styles.itemQuantity}>
            Type: {orderItems?.inventoryProduct?.unitName} {orderItems?.inventoryProduct?.metricUnit}
          </Text>
          <Text style={styles.itemQuantity}>Qty: {orderItems?.quantity}</Text>
        </View>
      </View>
 
 

   </View>
   
             
     
           <View style={styles.reasonContainer}>
             <Text style={styles.reasonTitle}>Reason for Cancellation:</Text>
             <Text style={styles.reasonText}>{response?.content}</Text>
           </View>
         </View>
         </ScrollView>
       </SafeAreaView>
     );
  
}

export default ClientCancelled
