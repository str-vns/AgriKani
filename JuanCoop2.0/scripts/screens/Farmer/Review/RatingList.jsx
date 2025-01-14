import React, { useCallback, useContext, useEffect, useState } from "react";
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
import styles from "@screens/stylesheets/Admin/Coop/Cooplist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCoopProducts } from "@redux/Actions/productActions";
import AuthGlobal from "@redux/Store/AuthGlobal";

const RatingList = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const Coopid = context?.stateUser?.userProfile?._id
  const [refreshing, setRefreshing] = useState(false);
   const {loading, coopProducts, error } = useSelector((state) => state.CoopProduct)
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
      dispatch(getCoopProducts(Coopid));
      return () => {
        console.log("Cleaning up on screen unfocus...");
      };
    }, [dispatch])
  );

  // Refresh users
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
        dispatch(getCoopProducts(Coopid));
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Review List</Text>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : (
        <FlatList
  data={coopProducts}
  keyExtractor={(item) => item?._id}
    refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  renderItem={({ item }) => (
    <View style={styles.userItem}>
      <Image
        source={{
          uri: item?.image[0]?.url || "https://via.placeholder.com/150",
        }}
        style={styles.profileImage}
      />
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{item?.productName}</Text>
        <Text style={styles.userEmail}>{item?.description}</Text>
        <Text style={styles.userRole}>
          Sentiment: {item?.sentiment || "neutral"}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("Reviews", { reviews: item })}
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

export default RatingList;
