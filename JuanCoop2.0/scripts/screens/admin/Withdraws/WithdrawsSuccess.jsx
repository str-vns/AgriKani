import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getSuccessTransactions } from "@redux/Actions/transactionActions";
import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectedTab } from "@shared/SelectedTab";

const WithdrawsSuccess = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { withdrawloading, withdraw, withdrawerror } = useSelector(
    (state) => state.transaction
  );
  const [selectedTab, setSelectedTab] = useState("WApproved");
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
      dispatch(getSuccessTransactions(token));
      return () => {
        console.log("Cleaning up on screen unfocus...");
      };
    }, [token])
  );

  // Refresh users
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(getSuccessTransactions(token));
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, token]);

  const choicesTab = [
    { label: "Pending", value: "WPending" },
    { label: "Success", value: "WApproved" },
  ];

  return (
    <View style={styles.container}>
      <SelectedTab
        selectedTab={selectedTab}
        tabs={choicesTab}
        onTabChange={setSelectedTab}
      />

      {/* Content */}
      {withdrawloading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : withdraw?.length === 0 || withdrawerror ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Request Withdraw found.</Text>
        </View>
      ) : (
        <FlatList
          data={withdraw}
          keyExtractor={(item) => item?._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{item?.accountName}</Text>
                <Text style={styles.userEmail}>
                  Manager: {item?.user?.firstName}
                  {item?.user?.lastName}
                </Text>
                <Text style={styles.userEmail}>
                  Status:{" "}
                  <Text
                    style={[
                      styles.userEmail,
                      {
                        color:
                          item?.transactionStatus === "SUCCESS"
                            ? "green"
                            : item?.transactionStatus === "PENDING"
                            ? "orange"
                            : item?.transactionStatus === "FAILED"
                            ? "red"
                            : "black",
                      }, // Default to black
                    ]}
                  >
                    {item?.transactionStatus}
                  </Text>
                </Text>
                <Text style={styles.userEmail}>Amount: ₱ {item?.amount}</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("WithdrawsSingle", { withdrawData: item })
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

export default WithdrawsSuccess;
