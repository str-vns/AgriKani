import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { printToFileAsync } from 'expo-print';
import { Platform } from "react-native";

const handleDownloadReceipt = async (cartItems, addressData, paymentMethod, setLoading) => {
  try {
    setLoading(true);

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => total + item.pricing * item.quantity, 0).toFixed(2);

    // Create HTML content for receipt
    const htmlContent = `
      <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        padding: 20px;
        border: 2px solid #000;
        max-width: 600px;
      }
      h1 {
        text-align: center;
        font-size: 24px;
        text-transform: uppercase;
      }
      .info {
        margin-bottom: 15px;
      }
      .info p {
        margin: 5px 0;
      }
      .items {
        width: 100%;
        border-collapse: collapse;
      }
      .items th, .items td {
        border: 1px solid #000;
        padding: 8px;
        text-align: left;
      }
      .items th {
        background-color: #f2f2f2;
      }
      .total {
        font-size: 18px;
        font-weight: bold;
        text-align: right;
        margin-top: 15px;
      }
    </style>
  </head>
  <body>
    <h1>Order Receipt</h1>
    <div class="info">
      <p><b>Date:</b> ${new Date().toLocaleDateString('en-US')}</p>
      <p><b>Payment Method:</b> ${paymentMethod || "N/A"}</p>
    </div>
    
    <h2>Order Details</h2>
    <table class="items">
      <tr>
        <th>Item Name</th>
        <th>Quantity</th>
        <th>Price</th>
      </tr>
      ${cartItems
        .map(
          (item) =>
            `<tr>
              <td>${item.productName || "N/A"}</td>
              <td>${item.quantity || 0}</td>
              <td>₱${item.pricing || "0.00"}</td>
            </tr>`
        )
        .join("")}
    </table>

    <p class="total">Total Price: ₱${totalPrice}</p>

    <h2>Shipping Address</h2>
    <p>$
       ${addressData?.address || "N/A"}, ${addressData?.city || "N/A"}<br>
       ${addressData?.postalCode || "N/A"}</p>
  </body>
</html>

    `;

    const { uri } = await printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    if (Platform.OS === "android") {
      // Use StorageAccessFramework for saving to Downloads on Android
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        alert("Permission to access storage is required to download the receipt.");
        return;
      }

      const fileName = "order_receipt.pdf";
      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        fileName,
        "application/pdf"
      );

      const fileContent = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      await FileSystem.writeAsStringAsync(fileUri, fileContent, { encoding: FileSystem.EncodingType.Base64 });

      alert("Receipt saved successfully in your Downloads folder!");
    } else {
      // For iOS, move the file to a readable location
      const fileUri = `${FileSystem.documentDirectory}order_receipt.pdf`;
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      await Sharing.shareAsync(fileUri);
      alert("Receipt saved successfully!");
    }
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
          <Text style={styles.receiptButtonText}>Generate Order Summary</Text>
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