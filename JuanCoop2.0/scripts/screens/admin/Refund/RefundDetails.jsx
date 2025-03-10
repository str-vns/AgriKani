import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Linking,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateWithdraw } from "@redux/Actions/transactionActions";
import messaging from "@react-native-firebase/messaging";
import { sendNotifications } from "@redux/Actions/notificationActions";
import { useSocket } from "../../../../SocketIo";

const RefundDetails = (props) => {
  const trans = props.route.params.refundData;
  console.log(trans?.user?._id)
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const socket = useSocket();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        setToken(res);
        messaging()
          .getToken()
          .then((token) => {
            setFcmToken(token);
          });
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };

    fetchJwt();
  }, []);

  const handleApprove = async (transId) => {
    Alert.alert(
      "Withdrawal Success",
      "Did You Send the Money to the User?",
      [
        {
          text: "Yes",
          onPress: async () => {
            try {
              setIsLoading(true);
              const transData = {
                transactionStatus: "SUCCESS",
                fcmToken: fcmToken,
              }
              dispatch(updateWithdraw(transId, transData,  token));

              const notification = {
                title: `Refund Success`,
                content: `Hi! ${trans?.user?.firstName} your refund request ₱ ${trans?.amount ? trans.amount.toFixed(2) : "0.00"} 
                has been sent to your ${trans?.paymentMethod}. Please check your account.`,
                user: trans?.user?._id,
                fcmToken: fcmToken,
                type: "order",
              };

              socket.emit("sendNotification", {
                senderName: "Admin",
                receiverName: trans?.user?._id,
                type: "order",
              });
            
              dispatch(sendNotifications(notification, token));
              navigation.navigate("RefundProcess");
            } finally {
              setIsLoading(false);
            }
          },
        },
        {
          text: "No",
          style: "cancel",
        },
      ]
    );
  };

//   const handleDelete = async (transId) => {
//     Alert.alert(
//       "Withdrawal Failed",
//       "Are you sure you want to decline this Refund?",
//       [
//         {
//           text: "Yes",
//           onPress: async () => {
//             try {
//               setIsLoading(true);
//               const transData = {
//                 transactionStatus: "FAILED",
//                 fcmToken: fcmToken,
//               }
//               const notification = {
//                 title: `Refund Success`,
//                 content: `Hi! ${trans?.user?.firstName} your refund request ₱ ${trans?.amount ? trans.amount.toFixed(2) : "0.00"} 
//                 has been sent to your ${trans?.paymentMethod}. Please check your account.`,
//                 user: trans?.user?._id,
//                 fcmToken: fcmToken,
//                 type: "order",
//               };

//               socket.emit("sendNotification", {
//                 senderName: "Admin",
//                 receiverName: trans?.user?._id,
//                 type: "order",
//               });
            
//               dispatch(sendNotifications(notification, token));
//               dispatch(updateWithdraw(transId, transData, token));
//               navigation.navigate("WithdrawsList");
//             } finally {
//               setIsLoading(false);
//             }
//           },
//         },
//         {
//           text: "No",
//           style: "cancel",
//         },
//       ]
//     );
//   };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Details</Text>
      </View> */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Refund Details</Text>
        </View>

        <View style={styles.coopContainer}>
       

          <View style={styles.coopDetails}>
            <Text style={styles.coopName}>
              {trans?.firstName} {trans?.lastName}
            </Text>
            <Text style={styles.coopEmail}>Id: {trans?._id}</Text>
            <Text style={styles.address}>PaymentMethod: {trans?.paymentMethod}</Text>
            <Text style={styles.address}>Full Name: {trans?.user?.firstName} {trans?.user?.lastName}</Text>
            <Text style={styles.address}>Name: {trans?.accountName}</Text>
            <Text style={styles.address}>Phone Number: {trans?.accountNumber}</Text>
            <Text style={styles.address}>Date: {new Date(trans?.date).toLocaleDateString()}</Text>
            <Text style={styles.address}>Amount: ₱ {trans?.amount ? trans.amount.toFixed(2) : "0.00"}</Text>
            <Text style={styles.address}>Transaction Status: 
            <Text  style={[
                styles.address, 
                { color: trans?.transactionStatus === "SUCCESS" ? "green" : 
                    trans?.transactionStatus === "PENDING" ? "orange" : 
                    trans?.transactionStatus === "FAILED" ? "red" : "black" } 
              ]}> {trans?.transactionStatus}
              </Text>
               </Text>
               <Text style={styles.address}>Reason of Refund: ₱ {trans?.cancelledId?.content}</Text>
          </View>
         
        </View>
        
        {trans?.transactionStatus === "PENDING" ? (
          <View style={styles.buttonContainer}>
            {/* Approve Button */}
            <TouchableOpacity
              style={styles.approvedButton}
              onPress={() => handleApprove(trans?._id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <Text style={styles.buttonApproveText}>Refunded</Text>
              )}
            </TouchableOpacity>

            {/* Decline Button */}
            {/* <TouchableOpacity
              style={styles.approvedButton}
              onPress={() => handleDelete(driver?._id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <Text style={styles.buttonApproveText}>Decline</Text>
              )}
            </TouchableOpacity> */}
          </View>
        ) : null}

      </View>
    </ScrollView>
  );
};

export default RefundDetails;
