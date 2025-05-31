import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getPendingTransactions } from "@redux/Actions/transactionActions";
import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { allCoops } from "@redux/Actions/coopActions";
import { SelectedTab } from "@shared/SelectedTab";

const WithdrawsList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { withdrawloading, withdraw, withdrawerror } = useSelector(
    (state) => state.transaction
  );
  const [selectedTab, setSelectedTab] = useState("WPending");
  const [token, setToken] = useState(null);
  const { loading, coops, error } = useSelector((state) => state.allofCoops);

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
      dispatch(getPendingTransactions(token));
      dispatch(allCoops(token));
      return () => {
        console.log("Cleaning up on screen unfocus...");
      };
    }, [token])
  );

  // Refresh users
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(getPendingTransactions(token));
      dispatch(allCoops(token));
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
                <Text style={styles.userName}>
                  {coops?.find((coop) => coop.user?._id === item.user?._id)
                    ?.farmName || "Farm Name Not Found"}
                </Text>
                <Text style={styles.userEmail}>
                  Request By: {item?.accountName}
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

export default WithdrawsList;
