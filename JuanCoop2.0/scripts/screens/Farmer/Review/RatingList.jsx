import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCoopProducts } from "@redux/Actions/productActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import styles from "@screens/stylesheets/Reviews/list";
import Loader from "@shared/Loader";
import NoItem from "@shared/NoItem";

const RatingList = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const Coopid = context?.stateUser?.userProfile?._id;
  const [refreshing, setRefreshing] = useState(false);
  const { loading, coopProducts } = useSelector((state) => state.CoopProduct);
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

  const nullData = []
  return (
    <View style={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={coopProducts}
          keyExtractor={(item) => item?._id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <NoItem title="Reviews" />
          }
           contentContainerStyle={
                      !coopProducts || coopProducts.length === 0
                        ? styles.centering
                        : null
                    }
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Image source={{ uri: item?.image[0]?.url || "https://via.placeholder.com/150" }} style={styles.profileImage} />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{item?.productName}</Text>
                <Text style={styles.userEmail}
                ellipsizeMode="tail"
                numberOfLines={2}
                >{item?.description}</Text>
               
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("Reviews", { reviews: item })}>
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
