import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { updateDeliveryStatus } from "@redux/Actions/deliveryActions";
import { useDispatch } from "react-redux";

const HistoryDetails = (props) => {
  const deliveryDetails = props.route.params.History;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const orderItems = deliveryDetails?.orderItems.map((item) => ({
    product: item?.product,
    inventoryProduct: item?.inventoryProduct,
    quantity: item?.quantity,
  }));
  const [token, setToken] = useState("");

  console.log("Delivery Details:", deliveryDetails?.status);
  useEffect(() => {
    const fetchData = async () => {
      const res = await AsyncStorage.getItem("jwt");
      if (res) {
        setToken(res);
      }
    };
    fetchData();
  }, []);

  const deliveryNow = (item) => {
    Alert.alert("Delivery", "Are you sure you want to deliver this item?", [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          console.log("Deliver Pressed");
          if (deliveryDetails.status === "pending") {
            dispatch(updateDeliveryStatus(item._id, "delivering", token));
            navigation.navigate("Dropoff", { deliveryItem: item });
          } else {
            navigation.navigate("Dropoff", { deliveryItem: item });
          }
        },
      },
    ]);
  };

  const getPaymentMethodDisplay = (method) => {
    return method === "COD" ? "Cash on Delivery" : method || "N/A";
  };

  return (
    <View style={styles.detailsContainer}>

      <ScrollView style={styles.container}>
        <View style={styles.customerInfo}>
          <Text style={styles.text}>
            <Text style={styles.label}>Name:</Text>{" "}
            {deliveryDetails?.userId?.firstName || "N/A"}{" "}
            {deliveryDetails?.userId?.lastName || "N/A"}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Address:</Text>{" "}
            {deliveryDetails?.shippingAddress?.address || "N/A"},{" "}
          {deliveryDetails?.shippingAddress?.barangay || "N/A"},{" "}
          {deliveryDetails?.shippingAddress?.city || "N/A"}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Phone Number:</Text>{" "}
            {deliveryDetails?.userId?.phoneNum || "N/A"}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Order:</Text> Order #{" "}
            {deliveryDetails?.orderId?._id || "N/A"}
          </Text>
        </View>

        {/* Product Details */}
        <View style={styles.productDetails}>
          <Text style={styles.sectionTitle}>Product Detail</Text>

       
        {orderItems?.length > 0 ? (
          orderItems.map((item, index) => (
            <View style={styles.productItem} key={index}>
              <Image
                source={{
                  uri:
                    item?.product?.image?.[0]?.url ||
                    "https://i.pinimg.com/originals/2e/cc/88/2ecc88184aa4234a9625c5197b4ef15b.jpg",
                }}
                style={styles.productImage}
              />
              <Text style={styles.productText}>
                {item?.product?.productName || "Unknown Product"}{" "}
                {item?.inventoryProduct?.unitName || ""}{" "}
                {item?.inventoryProduct?.metricUnit || ""} -{" "}
                {item?.quantity || "0"} Qty
              </Text>
            </View>
          ))
        ) : (
          <Text>No products available</Text>
        )}
      </View>

        {/* Payment Details */}
        <View style={styles.paymentDetails}>
          <Text style={styles.text}>
            <Text style={styles.label}>Mode of Payment:</Text>{" "}
            {getPaymentMethodDisplay(deliveryDetails?.orderId?.paymentMethod)}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Payment Status:</Text>{" "}
            {getPaymentMethodDisplay(
              deliveryDetails?.payStatus === "Paid" ? "Paid" : "Unpaid"
            )}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>To Pay:</Text> ₱{" "}
            {deliveryDetails?.totalAmount
            ? String(deliveryDetails?.totalAmount.toFixed(2))
            : "N/A"}
          </Text>

            <Text style={styles.text}>
            <Text style={styles.labelDelivery}>Delivery Status:</Text> {" "}
            <View style={[
  styles.statusBadge,
  deliveryDetails?.status === 'pending'
    ? styles.statusPending
    : deliveryDetails?.status === 'failed'
    ? styles.statusFailed
    : deliveryDetails?.status === 'delivered'
    ? styles.statusComplete
    : styles.statusDefault
]}>
  <Text style={[
    styles.statusText,
    deliveryDetails?.status === 'pending'
      ? { color: '#1976d2' }
      : deliveryDetails?.status === 'failed'
      ? { color: '#d32f2f' }
      : deliveryDetails?.status === 'delivered'
      ? { color: '#388e3c' }
      : { color: '#333' }
  ]}>
    {deliveryDetails?.status
      ? deliveryDetails.status.charAt(0).toUpperCase() + deliveryDetails.status.slice(1)
      : "N/A"}
  </Text>
</View>
          </Text>

        </View>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 3,
  },
  headerTitle2: {
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
  statusBadge: {
  borderWidth: 2,
  borderRadius: 16,
  paddingHorizontal: 16,
  paddingVertical: 6,
  alignSelf: 'flex-start',
  
},
statusPending: {
  borderColor: '#1976d2',
  backgroundColor: '#e3f2fd',
},
statusFailed: {
  borderColor: '#d32f2f',
  backgroundColor: '#ffebee',
},
statusComplete: {
  borderColor: '#388e3c',
  backgroundColor: '#e8f5e9',
},
statusDefault: {
  borderColor: '#aaa',
  backgroundColor: '#f5f5f5',
},
statusText: {
  fontWeight: 'bold',
  fontSize: 16,
  textTransform: 'capitalize',
},
labelDelivery: {
  fontWeight: "bold",
  fontSize: 16,
  marginBottom: 5,
}
});

export default HistoryDetails;
