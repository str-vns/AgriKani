import React, { useCallback, useContext, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed
import styles from '../css/styles.js';
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { archiveProducts, restoreProducts, deleteProducts } from '@redux/Actions/productActions'
import { useFocusEffect } from '@react-navigation/native';

const ProductArchive = ({ navigation }) => {
  const context = useContext(AuthGlobal)
  const dispatch = useDispatch()
  const [refresh, setRefresh] = React.useState(false);
  const {loading, coopProducts, error } = useSelector((state) => state.CoopProduct)
  const Coopid = context?.stateUser?.userProfile?._id

  const onRefresh = useCallback(async () => {
    setRefresh(true);

      setTimeout(() => {
       dispatch(archiveProducts(Coopid));
        setRefresh(false);
      }, 500);
  
  }, [Coopid]);

  useFocusEffect(
    useCallback(() => {
      dispatch(archiveProducts(Coopid));
     }
    , [Coopid])
  )

  const handleRestoreProduct = (id) => {
    setRefresh(true);
    try {

       dispatch(restoreProducts(id));
       onRefresh()
    } catch (error) {
      console.error("Error deleting or refreshing products:", error);
    } finally {

      setRefresh(false);
    }
  };

  const handleDeleteProduct = (id) => {
    Alert.alert(
        "Delete Product",
        "Are you sure you want to delete this product?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => {
            setRefresh(true);
            try {
              dispatch(deleteProducts(id));
              onRefresh()
            } catch (error) {
              console.error("Error deleting or refreshing products:", error);
            } finally {
              setRefresh(false);
            }
          }}
        ]
    )

  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Archive List</Text>
      </View>

      {/* List of products */}
      {coopProducts.length === 0 ? (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Archive product</Text>
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
          <TouchableOpacity onPress={() => handleRestoreProduct(item._id)} style={styles.iconButton}>
            <Ionicons name="reload-outline" size={24} color="green" />
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

export default ProductArchive;