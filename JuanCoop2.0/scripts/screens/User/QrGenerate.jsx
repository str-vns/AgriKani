import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";

const QrGenerate = ( props ) => {
    const Qrdata = props.route.params.deliveryId;
     console.log("Qrdata: ", Qrdata);
    const qrData = JSON.stringify({
        orderId: Qrdata?.orderId?._id,
        deliveryId: Qrdata?._id,
        status: "delivered", 
        userId: Qrdata?.userId?._id,
      });

    return (
        <View style={styles.container}>
          <Text style={styles.title}>Delivery QR Code</Text>
          <QRCode
            value={qrData} 
            size={200} 
            backgroundColor="white" 
            color="black" 
          />
          <Text style={styles.note}>
            Scan this QR code to update the delivery status.
          </Text>
        </View>
      );
    };


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: 20,
      marginBottom: 20,
    },
    note: {
      marginTop: 20,
      fontSize: 14,
      color: '#555',
    },
  });

export default QrGenerate;