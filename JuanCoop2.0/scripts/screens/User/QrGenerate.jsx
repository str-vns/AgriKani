import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

const QrGenerate = (props) => {
  const Qrdata = props.route.params.deliveryId;
  const qrRef = useRef();

  const qrData = JSON.stringify({
    orderId: Qrdata?.orderId?._id,
    deliveryId: Qrdata?._id,
    status: "delivered",
    userId: Qrdata?.userId?._id,
  });

  const downloadQRCode = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need storage permissions to save the QR Code.");
        return;
      }

      qrRef.current.toDataURL(async (data) => {
        const base64Code = `data:image/png;base64,${data}`;
        const fileUri = `${FileSystem.cacheDirectory}delivery_qr_code.png`;

        await FileSystem.writeAsStringAsync(fileUri, data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync("Download", asset, false);

        Alert.alert("Success", "QR Code saved to your device!");
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save the QR Code.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery QR Code</Text>
      <QRCode
        value={qrData}
        size={200}
        backgroundColor="white"
        color="black"
        getRef={(c) => (qrRef.current = c)} // Capture the QRCode ref
      />
      <Text style={styles.note}>
        Scan this QR code to update the delivery status.
      </Text>
      <TouchableOpacity style={styles.downloadButton} onPress={downloadQRCode}>
        <Text style={styles.buttonText}>Download QR Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  note: {
    marginTop: 20,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  downloadButton: {
    marginTop: 30,
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default QrGenerate;
