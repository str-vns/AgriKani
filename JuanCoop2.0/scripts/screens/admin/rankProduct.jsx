import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRankedProducts } from "@redux/Actions/rankActions";
import { View, Text, ActivityIndicator, StyleSheet,TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import {useNavigation } from '@react-navigation/native';

import BarGraph from "../../../components/BarGraph";

const RankedProductsPage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation(); 
  // Get the ranked products, loading, and error from the state
  const { rankedProducts, loading, error } = useSelector((state) => state.rank);

  useEffect(() => {
    // Dispatch the action to fetch ranked products
    dispatch(getRankedProducts());
  }, [dispatch]);

  // Check if rankedProducts is an array before calling .map()
  const transformedProducts = Array.isArray(rankedProducts)
    ? rankedProducts.map((product, index) => ({
        name: product.productId || `Product ${index + 1}`, // Use productId or fallback
        rank: product.totalQuantitySold || 0, // Use totalQuantitySold
      }))
    : [];

  return (
    <View style={styles.container}>
         <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("AdminDashboards")} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ranked Products</Text>
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {!loading && !error && transformedProducts.length > 0 && (
        <BarGraph rankedProducts={transformedProducts} />
      )}
    </View>
  );
};

export default RankedProductsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 10,
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    
  },
});
