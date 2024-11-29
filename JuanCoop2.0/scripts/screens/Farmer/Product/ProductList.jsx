import React, { useCallback, useContext, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, Image, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed
import styles from '../css/styles.js';
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { getCoopProducts, soflDelProducts } from '@redux/Actions/productActions'
import { useFocusEffect } from '@react-navigation/native';

const ProductList = ({ navigation }) => {
  const context = useContext(AuthGlobal)
  const dispatch = useDispatch()
  const {loading, coopProducts, error } = useSelector((state) => state.CoopProduct)
  const [refresh, setRefresh] = React.useState(false);
  const Coopid = context?.stateUser?.userProfile?._id
  // console.log(context.stateUser.userProfile._id)

  
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
    
    setRefresh(true);
    try {

       dispatch(soflDelProducts(id));
       onRefresh()
    } catch (error) {
      console.error("Error deleting or refreshing products:", error);
    } finally {

      setRefresh(false);
    }
  };

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

      {/* List of products */}
      {coopProducts.length === 0 ? (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Add some product</Text>
    </View>
  ) : (
    <FlatList
      contentContainerStyle={styles.scrollViewContainer}
      data={coopProducts}
      keyExtractor={(item) => item._id}
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
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.productDescription}>{item.description}</Text>
            <Text style={styles.productStock}>Stock: {item.stock}</Text>
            <Text style={styles.productPrice}>Price: ${item.pricing}</Text>
          </View>

          {/* Edit button */}
          <TouchableOpacity onPress={() => handleEditProduct(item)} style={styles.iconButton}>
            <Ionicons name="pencil" size={24} color="green" />
          </TouchableOpacity>

          {/* Delete button */}
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