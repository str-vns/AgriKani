import React, { useCallback, useContext } from "react";
import { View, Text, FlatList, RefreshControl, Alert } from "react-native"; // Ensure you have @expo/vector-icons installed
import styles from "../css/styles.js";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { useDispatch, useSelector } from "react-redux";
import {
  archiveProducts,
  restoreProducts,
  deleteProducts,
} from "@redux/Actions/productActions";
import { useFocusEffect } from "@react-navigation/native";
import { ListItems } from "@shared/List";
import Loader from "@shared/Loader.jsx"; // Adjust the import path as necessary

const ProductArchive = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const [refresh, setRefresh] = React.useState(false);
  const { loading, coopProducts, error } = useSelector(
    (state) => state.CoopProduct
  );
  const Coopid = context?.stateUser?.userProfile?._id;

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
    }, [Coopid])
  );

  const handleRestoreProduct = (id) => {
    Alert.alert(
      "Restore Confirmation",
      "Are you sure you want to restore this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Restore",
          onPress: async () => {
            setRefresh(true);
            try {
              dispatch(restoreProducts(id));
              onRefresh();

              setTimeout(() => {
                Alert.alert("Success", "Product restored successfully.");
              }, 1000);
            } catch (error) {
              console.error("Error restoring the product:", error);
              Alert.alert(
                "Error",
                "Failed to restore product. Please try again."
              );
            } finally {
              setRefresh(false);
            }
          },
          style: "default",
        },
      ]
    );
  };

  const handleDeleteProduct = (id) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            setRefresh(true);
            try {
              dispatch(deleteProducts(id));
              onRefresh();
            } catch (error) {
              console.error("Error deleting or refreshing products:", error);
            } finally {
              setRefresh(false);
            }
          },
        },
      ]
    );
  };


  return (
    <View style={styles.container}>
      
      { loading ? (
        <Loader />
      ) :
      
      coopProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Archive product</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.scrollViewContainer}
          data={coopProducts}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <ListItems
              item={item}
              onRestore={handleRestoreProduct}
              onDelete={handleDeleteProduct}
              isArchive={true}
            />
          )}
        />
      )}
    </View>
  );
};

export default ProductArchive;
