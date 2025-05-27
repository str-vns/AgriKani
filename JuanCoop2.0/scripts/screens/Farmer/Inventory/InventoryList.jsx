import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  FlatList,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCoopProducts } from "@redux/Actions/productActions";
import { InventoryData } from "@shared/List";
import styles from "@stylesheets/Inventory/inventory";
import Loader from "@shared/Loader";
import NoItem from "@shared/NoItem";
import AuthGlobal from "@redux/Store/AuthGlobal";

const InventoryList = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const Coopid = context?.stateUser?.userProfile?._id;
  const [refreshing, setRefreshing] = useState(false);
  const { loading, coopProducts, error } = useSelector(
    (state) => state.CoopProduct
  );
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
      {loading ? (
        <Loader />
      ) : (
        <FlatList
        contentContainerStyle={styles.listContainer} 
        data={coopProducts}
        keyExtractor={(item) => item?._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
         ListEmptyComponent={
                   error ? (
                     <NoItem title="Inventory" />
                   ) : (
                     <NoItem title="Inventory" />
                   )
                 }
        renderItem={({ item }) => (
          <InventoryData
            item={item}
          />
        )}
      />
    )}
  </View>
  );
}

export default InventoryList;
