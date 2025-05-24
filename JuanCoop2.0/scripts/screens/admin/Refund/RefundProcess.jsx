import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getPendingRefund } from "@redux/Actions/transactionActions";
import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RefundProcess = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const {refundloading, refund, refunderror} = useSelector((state) => state.refund)
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [token, setToken] = useState(null);
 
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

  useFocusEffect(
    useCallback(() => {
      dispatch(getPendingRefund(token));
      return () => {
        console.log("Cleaning up on screen unfocus...");
      };
    }, [token])
  );

  // Refresh users
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(getPendingRefund(token));
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, token]);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Refund Request List</Text>
          </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Pending" && styles.activeTab,
          ]}
          onPress={() => {
            setSelectedTab("Pending");
          }}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Pending" && styles.activeTabText,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Success" && styles.activeTab,
          ]}
          onPress={() => {
            navigation.navigate("RefundSuccess");
          }}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Success" && styles.activeTabText,
            ]}
          >
            Success 
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {refundloading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : refund?.length === 0 || refunderror ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Request Refund found.</Text>
        </View>
      ) : (
        <FlatList
          data={refund}
          keyExtractor={(item) => item?._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.userItem}>

              <View style={styles.userDetails}>
                <Text style={styles.userName}>{item?.accountName}</Text>
                <Text style={styles.userEmail} >Status: {" "}
                <Text 
  style={[
    styles.userEmail, 
    { color: item?.transactionStatus === "SUCCESS" ? "green" : 
            item?.transactionStatus === "PENDING" ? "orange" : 
            item?.transactionStatus === "FAILED" ? "red" : "black" } // Default to black
  ]}
>
  {item?.transactionStatus}
</Text>
</Text>
<Text style={styles.userEmail}>Amount: ₱ {item?.amount ? item.amount.toFixed(2) : "0.00"}</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("RefundDetails", { refundData: item })
                }
              >
                <Text style={styles.viewButton}>View</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default RefundProcess;
