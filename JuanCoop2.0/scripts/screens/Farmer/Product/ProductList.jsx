import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert,RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed
import styles from '../css/styles.js';
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { getCoopProducts, soflDelProducts } from '@redux/Actions/productActions'
import { useFocusEffect } from '@react-navigation/native';
import { activeProduct } from "@redux/Actions/productActions";

const ProductList = ({ navigation }) => {
  const context = useContext(AuthGlobal)
  const dispatch = useDispatch()
  const {loading, coopProducts, error } = useSelector((state) => state.CoopProduct)
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = React.useState(null);
  const Coopid = context?.stateUser?.userProfile?._id
  // console.log(context.stateUser.userProfile._id)

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
     }
    , [Coopid])
  )


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
              Alert.alert("Error", "Failed to delete product. Please try again.");
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
      dispatch(activeProduct(id,token));
      onRefresh()
    } catch (error) {
      console.error("Error deleting or refreshing products:", error);
    } finally {
      setRefresh(false);
    }
  }

  const handleEditProduct = (item) => {
    navigation.navigate('productEdit', { item });
  };

  const handleAddProduct = () => {
    navigation.navigate('ProductsCreate');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product List</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Ionicons name="add" size={28} color="black" />
        </TouchableOpacity>
      </View>

    
      {loading ? (
      <ActivityIndicator size="large" color="blue" style={styles.activityIndicator} />
    ) : coopProducts.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Add some product</Text>
      </View>
    ) : (
      <FlatList
        contentContainerStyle={styles.scrollViewContainer}
        data={coopProducts}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            {/* Product images */}
            <View style={styles.imageContainer}>
              {Array.isArray(item.image) && item.image.length > 0 ? (
                <Image
                  source={{ uri: item.image[0].url }}
                  style={styles.productImage}
                />
              ) : (
                <Image
                  source={require('@assets/img/eggplant.png')}
                  style={styles.productImage}
                />
              )}
            </View>

            {/* Product details */}
            <View style={styles.productDetails}>
              <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
                {item.productName}
              </Text>
              <Text>
              Public:
                 <Text
                  style={[
                    styles.productName,
                    { color: item.activeAt === "active" ? 'green' : 'gray' }
                  ]}
                > {item.activeAt === "active" ? "Active" : "Inactive"}
                </Text>
              </Text>
              <Text style={styles.productDescription} numberOfLines={1} ellipsizeMode="tail">
                {item.description}
              </Text>
            </View>
       
            {
  // Check conditions for showing the "checkmark-outline" icon
  item.activeAt === "inactive" &&
  item.stock.length > 0 &&
  // Check if at least one stock item is "active"
  item.stock.some(stockItem => stockItem.status === "active") ? (
    <TouchableOpacity onPress={() => handleActiveProduct(item._id)} style={styles.iconButton}>
      <Ionicons name="checkmark-outline" size={24} color="green" />
    </TouchableOpacity>
  ) : null
}

            <TouchableOpacity onPress={() => handleEditProduct(item)} style={styles.iconButton}>
              <Ionicons name="pencil" size={24} color="green" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleDeleteProduct(item._id)} 
              style={styles.iconButton}
            >
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    )}
  
    </View>
  );
};

export default ProductList;