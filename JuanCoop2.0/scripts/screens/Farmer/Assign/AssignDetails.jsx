import React, { useCallback, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { approveDriverOnly } from "@redux/Actions/driverActions";
import { createDelivery } from "@redux/Actions/deliveryActions";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";

const { width, height } = Dimensions.get("window");

const AssignDetails = (props) => {
  const context = useContext(AuthGlobal);
  const AssingInfo = props.route.params.order;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { driloading, drivers, drierror } = useSelector((state) => state.onlyApprovedDriver);
  const { Deliveryloading,success, Deliveryerror } = useSelector((state) => state.deliveryApi);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState(null);
  
  const userId = context.stateUser?.userProfile?._id;
  const orderItems = AssingInfo?.orderItems.map((item) => ({
    product: item?.product,
    inventoryProduct: item?.inventoryProduct,
    quantity: item?.quantity,
  }));
  
  if (drierror) {
    setErrors("Please try again later.");
  }

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await AsyncStorage.getItem("jwt");
          if (res) {
            setToken(res);
            if (userId) {
              dispatch(approveDriverOnly(userId, res))
            } else {
              setErrors('User ID is missing.');
            }
          } else {
            setErrors('No JWT token found.');
          }
        } catch (error) {
          console.error('Error retrieving JWT:', error);
          setErrors('Failed to retrieve JWT token.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [userId, dispatch])
  );
 
  const getPaymentMethodDisplay = (method) => {
    return method === "COD" ? "Cash on Delivery" : method;
  };

  const assignDriver = async() => {  
   
   

    const data = {
      orderId: AssingInfo._id,
      coopId: userId,

    };

  
   const response = await dispatch(createDelivery(data, token));

  console.log("response",response);
    if(response?.success === true)
   { 
    navigation.navigate("AssignList");
  } else if (response === false ) {
    Alert.alert(
      "Assign Driver",
      "There is no courier available at the moment",
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ]
    )
    return;
  }
 
  }
  return (
    <View style = {styles.detailsContainer}>
    <View style={styles.header2}>
    <TouchableOpacity
      style={styles.drawerButton}
      onPress={() => navigation.openDrawer()}
    >
      <Ionicons name="menu" size={34} color="black" />
    </TouchableOpacity>
    <Text style={styles.headerTitle2}>Delivery Details</Text>
  </View>

    <ScrollView style={styles.container}>
    
      <View style={styles.customerInfo}>
        <Text style={styles.text}>
          <Text style={styles.label}>Name:</Text> {AssingInfo?.user?.firstName} {AssingInfo?.user?.lastName}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Address:</Text> {AssingInfo?.shippingAddress?.address}, {AssingInfo?.shippingAddress?.barangay}, {AssingInfo?.shippingAddress?.city}

        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Phone Number:</Text> {AssingInfo?.user?.phoneNum}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Order:</Text> Order # {AssingInfo?._id}
        </Text>
      </View>

      <View style={styles.productDetails}>
        <Text style={styles.sectionTitle}>Product Detail</Text>
    
  {orderItems?.map((item, index) => (
    <View style={styles.productItem} key={index}>
      <Image
        source={{
          uri: item?.product?.image[0]?.url || 
               "https://i.pinimg.com/originals/2e/cc/88/2ecc88184aa4234a9625c5197b4ef15b.jpg",
        }}
        style={styles.productImage}
      />
      <Text style={styles.productText}>
        {item?.product?.productName || "Unknown Product"}  {item?.inventoryProduct?.unitName} {item?.inventoryProduct?.metricUnit} - {item?.quantity || "0"} Qty
      </Text>
    </View>
  ))}
      </View>

      <View style={styles.paymentDetails}>
        <Text style={styles.text}>
          <Text style={styles.label}>Mode of Payment:</Text> {getPaymentMethodDisplay(AssingInfo?.paymentMethod)}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>To Pay:</Text> ₱ {AssingInfo?.totalPrice}
        </Text>
      </View>

  {errors && <Text style={{ color: "red", textAlign: "center" }}>{errors}</Text>}

  {driloading ? ( <ActivityIndicator size="large" color="#FFC107" /> ) : (
    <TouchableOpacity
    style={styles.deliverButton}
    onPress={() => assignDriver()}
    disabled={Deliveryloading}
  >
    <Text style={styles.buttonText}>Assign now</Text>
  </TouchableOpacity>
    )}
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  customerInfo: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  productDetails: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  productText: {
    fontSize: 16,
  },
  paymentDetails: {
    marginBottom: 20,
  },
  deliverButton: {
    backgroundColor: "#FFC107",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  header2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 3,
},
headerTitle2: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    color: '#333',
},
CoopContainer: {
  width: "100%",
  borderColor: "#ddd",
  borderWidth: 1,
  borderRadius: width * 0.025,
  marginBottom: height * 0.02,
  overflow: "hidden",
},
pickerStyle: {
  width: "100%",
  height: height * 0.07,
  color: "#333",
  backgroundColor: "#fff",
},
textHeaderInput: {
  fontSize: width * 0.04,
  fontWeight: "bold",
  alignSelf: "center", 
  textAlign: "left",
  marginBottom: height * 0.01, 
},
});

export default AssignDetails;
