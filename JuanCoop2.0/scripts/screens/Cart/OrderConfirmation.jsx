import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { printToFileAsync } from 'expo-print';

const handleDownloadReceipt = async (cartItems, addressData, paymentMethod, setLoading) => {
  try {
    setLoading(true);

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => total + item.pricing * item.quantity, 0).toFixed(2);

    // Create HTML content for receipt
    const htmlContent = `
      <html>
        <body>
          <h1>Order Receipt</h1>
          <p><b>Date:</b> ${new Date().toLocaleDateString('en-US')}</p>
          <p><b>Total Price:</b> ₱${totalPrice}</p>
          <h3>Items:</h3>
          <ul>
            ${cartItems
              .map(
                (item) =>
                  `<li>${item.productName || "N/A"} - Quantity: ${item.quantity || 0} - Price: ₱${item.pricing || "0.00"}</li>`
              )
              .join("")}
          </ul>
          <p><b>Shipping Address:</b></p>
          <p>${addressData?.fullName || "N/A"}<br>
             ${addressData?.address || "N/A"}, ${addressData?.city || "N/A"}<br>
             ${addressData?.postalCode || "N/A"}</p>
          <p><b>Payment Method:</b> ${paymentMethod || "N/A"}</p>
        </body>
      </html>
    `;

    const { uri } = await printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    // Use Expo FileSystem to make sure the file is accessible
    const fileUri = uri;

    // Option 1: Open the file with Sharing
    await Sharing.shareAsync(fileUri).catch((err) => alert('Failed to open receipt: ' + err.message));

    // Option 2: Open the file directly (if it's a supported format like PDF)
    // Linking.openURL(fileUri).catch((err) => alert('Failed to open receipt: ' + err.message));

    alert(`Receipt generated successfully! File saved at: ${fileUri}`);
  } catch (error) {
    alert(`Failed to generate receipt: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

const OrderConfirmation = ({ route }) => {
  const { cartItems, addressData, paymentMethod } = route.params;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={require("@assets/img/yey.png")} style={styles.icon} />
      </View>
      <Text style={styles.confirmText}>Your Order is Confirmed</Text>
      <Text style={styles.subText}>Thank you for your Order</Text>
      <TouchableOpacity
        style={styles.receiptButton}
        onPress={() => handleDownloadReceipt(cartItems, addressData, paymentMethod, setLoading)} // pass setLoading here
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.receiptButtonText}>Generate Receipt</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Home", { screen: "Home" })}>
        <Text style={styles.backToHome}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    width: 150,
    height: 150,
  },
  confirmText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
    textAlign: 'center',
  },
  receiptButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
  },
  receiptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToHome: {
    fontSize: 14,
    color: '#FFC107',
    marginTop: 10,
  },
});

export default OrderConfirmation;