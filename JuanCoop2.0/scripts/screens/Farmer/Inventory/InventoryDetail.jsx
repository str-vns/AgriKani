import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, RefreshControl, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from "@stylesheets/Shared/List/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { inventoryProducts, deleteInventory, } from "@redux/Actions/inventoryActions";
import { InventoryItems } from "@shared/List";
import Loader from "@shared/Loader";
import NoItem from "@shared/NoItem"; 

const InventoryDetail = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const InvItem = props?.route?.params?.Inv;

  const [refreshing, setRefreshing] = useState(false);
  const { Invloading, Invsuccess, Inverror } = useSelector(
    (state) => state.sinvent
  );
  const [token, setToken] = useState(null);
  console.log(Invsuccess);
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
      dispatch(inventoryProducts(InvItem._id, token));
      return () => {
        console.log("Cleaning up on screen unfocus...");
      };
    }, [dispatch])
  );

  // Refresh users
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(inventoryProducts(InvItem._id, token));
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const handleEditInventory = (item) => {
    navigation.navigate("inventoryUpdate", { item: item, InvItem: InvItem });
  };

  const handleDeleteInventory = (id) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this inventory item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            dispatch(deleteInventory(id, token));

            setTimeout(() => {
              Alert.alert("Success", "Inventory item deleted successfully.");
              onRefresh();
            }, 2000);
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {Invloading ? (
        <Loader />
      ) : (
        <FlatList
          data={Invsuccess}
          keyExtractor={(item) => item?._id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            Inverror ? (
              <NoItem title="Inventory" />
            ) : (
              <NoItem title="Inventory" />
            )
          }
          renderItem={({ item }) => (
            <InventoryItems
              item={item}
              onEdit={handleEditInventory}
              onDelete={handleDeleteInventory}
              isArchive={false}
            />
          )}
        />
      )}
    </View>
  );
};

export default InventoryDetail;
