import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getWallet } from "@redux/Actions/walletActions";
import { useDispatch, useSelector } from "react-redux";
import { singleTransaction } from "@redux/Actions/transactionActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";
import styles from "@stylesheets/Withdraw/withdrawList";
import Loader from "@shared/Loader";
import NoItem from "@shared/NoItem";

const WithdrawList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  const userId = context.stateUser?.userProfile?._id;
  const { loading, wallet, error } = useSelector((state) => state.getWallet);
  const { withdrawloading, withdraw, withdrawerror } = useSelector(
    (state) => state.transaction
  );
  const [balance, setBalance] = useState(5000);
  const [token, setToken] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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
      dispatch(getWallet(userId, token));
      dispatch(singleTransaction(userId, token));
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getWallet(userId, token)).finally(() => setRefreshing(false));
    dispatch(singleTransaction(userId, token)).finally(() =>
      setRefreshing(false)
    );
  };

  const withdrawHandler = () => {
    console.log("Withdraw");
    navigation.navigate("PaymentMethod");
  };
  return (
      <View style={styles.container}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>
            Balance: ₱ {wallet?.balance ? wallet?.balance : 0}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={withdrawHandler}
        >
          <Text style={styles.withdrawText}>Withdraw</Text>
        </TouchableOpacity>

        {loading ? (
          <Loader />
        ) : withdraw && withdraw.length > 0 ? (
          <FlatList
            data={withdraw}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.transactionItem}>
                <View style={styles.withdrawConnect}>
                  <Text style={styles.dateText}>
                  Date: {new Date(item.date).toLocaleDateString()}
                </Text>
                <Text style={styles.transactionText}>
                Amount: ₱{item.amount}
                </Text>
                </View>
                  <Text
                  style={[
                    styles.transactionText,
                    styles.transactionStatus(item.transactionStatus),
                  ]}
                >
                  {item.transactionStatus}
                </Text>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <NoItem title="Transactions" />
        )}
      </View>
  );
};

export default WithdrawList;
