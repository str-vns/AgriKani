import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Details = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Customer Information */}
      <View style={styles.customerInfo}>
        <Text style={styles.text}>
          <Text style={styles.label}>Name:</Text> Alexandra C. Aquino
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Address:</Text> Kakawati Taguig Western
          Bicutan
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Phone Number:</Text> 09082367111
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Order:</Text> Order # 190678934958
        </Text>
      </View>

      {/* Product Details */}
      <View style={styles.productDetails}>
        <Text style={styles.sectionTitle}>Product Detail</Text>
        <View style={styles.productItem}>
          <Image
            source={{
              uri: "https://i.pinimg.com/originals/2e/cc/88/2ecc88184aa4234a9625c5197b4ef15b.jpg",
            }} // Replace with actual image URL
            style={styles.productImage}
          />
          <Text style={styles.productText}>Garlic - 2 kgs</Text>
        </View>
        <View style={styles.productItem}>
          <Image
            source={{
              uri: "https://images.squarespace-cdn.com/content/v1/5d39a82243494b0001b83080/1569442869330-USNOM1FL9ATLFAQLUR8D/resting_cat_ts_481099188.jpg",
            }} // Replace with actual image URL
            style={styles.productImage}
          />
          <Text style={styles.productText}>Onions - 2 kgs</Text>
        </View>
      </View>

      {/* Payment Details */}
      <View style={styles.paymentDetails}>
        <Text style={styles.text}>
          <Text style={styles.label}>Mode of Payment:</Text> Cash on Delivery
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>To Pay:</Text> 300
        </Text>
      </View>

      {/* Deliver Now Button */}
      <TouchableOpacity
        style={styles.deliverButton}
        onPress={() => navigation.navigate("Location")}
      >
        <Text style={styles.buttonText}>Deliver now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
});

export default Details;
