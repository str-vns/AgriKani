import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import styles from "../css/styles.js";
import styled from "@stylesheets/Product/ProductList.jsx";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  getCoopProducts,
  soflDelProducts,
} from "@redux/Actions/productActions";
import { useFocusEffect } from "@react-navigation/native";
import { activeProduct } from "@redux/Actions/productActions";
import { ListItems } from "@shared/List";
import Loader from "@shared/Loader.jsx";

const ProductList = ({ navigation }) => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const { loading, coopProducts, error } = useSelector(
    (state) => state.CoopProduct
  );
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = React.useState(null);
  const Coopid = context?.stateUser?.userProfile?._id;

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
    }, [Coopid])
  );

  const onRefresh = useCallback(async () => {
    setRefresh(true);

    setTimeout(() => {
      dispatch(getCoopProducts(Coopid));
      setRefresh(false);
    }, 500);
  }, [Coopid]);

  const handleDeleteProduct = async (id) => {
    Alert.alert(
      "Remove Confirmation",
      "Are you sure you want to remove this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: async () => {
            setRefresh(true);
            try {
              dispatch(soflDelProducts(id));
              onRefresh();

              setTimeout(() => {
                Alert.alert("Success", "Product Remove successfully.");
              }, 1000);
            } catch (error) {
              console.error("Error deleting or refreshing products:", error);
              Alert.alert(
                "Error",
                "Failed to delete product. Please try again."
              );
            } finally {
              setRefresh(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleActiveProduct = async (id) => {
    setRefresh(true);
    try {
      dispatch(activeProduct(id, token));
      onRefresh();
    } catch (error) {
      console.error("Error deleting or refreshing products:", error);
    } finally {
      setRefresh(false);
    }
  };

  const handleEditProduct = (item) => {
    navigation.navigate("productEdit", { item });
  };

  return (
    <View style={styled.container}>
      {loading ? (
        <Loader />
      ) : coopProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Add some product</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.scrollViewContainer}
          data={coopProducts}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <ListItems
              item={item}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onActivate={handleActiveProduct}
            />
          )}
        />
      )}
    </View>
  );
};

export default ProductList;
