import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { inactiveCooperative } from "@redux/Actions/coopActions";
import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectedTab } from "@shared/SelectedTab";

const Cooplist = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { loading, coops, error } = useSelector((state) => state.allofCoops);
  const [selectedTab, setSelectedTab] = useState("CPending");
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
      dispatch(inactiveCooperative(token));
      return () => {
        console.log("Cleaning up on screen unfocus...");
      };
    }, [dispatch, token])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(inactiveCooperative(token));
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, token]);

  const choicesTab = [
    { label: "Pending", value: "CPending" },
    { label: "Approved", value: "CApproved" },
  ]

  
  return (
  <View style={styles.container}>
    <SelectedTab selectedTab={selectedTab} tabs={choicesTab} onTabChange={setSelectedTab} />

    {loading ? (
      <ActivityIndicator size="large" color="blue" style={styles.loader} />
    ) : (
      <FlatList
        data={coops}
        keyExtractor={(item) => item?._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={[
          styles.listContainer,
          (!coops || coops.length === 0) && { flex: 1, justifyContent: "center", alignItems: "center" }
        ]}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Image
              source={{
                uri: item?.image[0]?.url || "https://via.placeholder.com/150",
              }}
              style={styles.profileImage}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{item?.farmName}</Text>
              <Text style={styles.userEmail}>{item?.user?.email}</Text>
              <Text style={styles.userRole}>Address: {item?.address}</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CoopDetails", { coop: item })
              }
            >
              <Text style={styles.viewButton}>View</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No cooperative found</Text>
          </View>
        }
      />
    )}
  </View>
);

};

export default Cooplist;
