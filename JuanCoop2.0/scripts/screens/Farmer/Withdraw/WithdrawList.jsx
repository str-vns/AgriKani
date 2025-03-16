import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getWallet } from "@redux/Actions/walletActions";
import { useDispatch, useSelector } from "react-redux";
import { singleTransaction } from "@redux/Actions/transactionActions"
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";

const WithdrawList = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const context = useContext(AuthGlobal)
  const userId = context.stateUser?.userProfile?._id
  const { loading, wallet, error } = useSelector((state) => state.getWallet);
  const {withdrawloading, withdraw, withdrawerror} = useSelector((state) => state.transaction)
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
    }
    fetchJwt();
}, []);

  useFocusEffect(
    useCallback(() =>{
        dispatch(getWallet(userId, token))
        dispatch(singleTransaction(userId, token))
    },[])
  )

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getWallet(userId, token)).finally(() => setRefreshing(false));
    dispatch(singleTransaction(userId, token)).finally(() => setRefreshing(false));
  };

  const withdrawHandler = () => {
    console.log("Withdraw")
    navigation.navigate("PaymentMethod")
    }
  return (
    <View style={styles.container2}>
           {/* <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
       
      </View> */}
    <View style={styles.container}>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Balance: ₱ {wallet?.balance ? wallet?.balance : 0}</Text>
      </View>

      <TouchableOpacity style={styles.withdrawButton} onPress={withdrawHandler}>
        <Text style={styles.withdrawText}>Withdraw</Text>
      </TouchableOpacity>

      {withdraw && withdraw.length > 0 ? (
          <FlatList
            data={withdraw}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.transactionItem}>
                <Text style={styles.transactionText}>Amount: ₱{item.amount}</Text>
                <Text style={[styles.transactionText, styles.transactionStatus(item.transactionStatus)]}>{item.transactionStatus}</Text>
                <Text style={styles.transactionText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
              </View>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        ) : (
          <Text style={styles.noTransactionText}>No transactions available</Text>
        )}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  balanceContainer: {
    backgroundColor: "#6200EE",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  balanceText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  withdrawButton: {
    backgroundColor: "#FF9800",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  withdrawText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionText: {
    fontSize: 16,
    color: "#333",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 3,
},
headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    color: '#333',
},
container2: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Background color
},

  transactionStatus: (status) => ({
    color: status === "SUCCESS" ? "green" : status === "PENDING" ? "orange" : "red",
    fontWeight: "bold",
  }),
});

export default WithdrawList;