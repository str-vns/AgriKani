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
import styles from "@screens/stylesheets/Admin/Coop/Inventorylist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { inventoryProducts, deleteInventory } from "@redux/Actions/inventoryActions";
import AuthGlobal from "@redux/Store/AuthGlobal";

const InventoryDetail = (props) => {
  const context = useContext(AuthGlobal);
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
    dispatch(deleteInventory(id, token));
    setTimeout(() => {
      onRefresh();
    }, 2000);
  };

  const handleCreateProduct = (item) => {
    console.log("Create Product");
    navigation.navigate("inventoryCreate", { item });
  };

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
        <Text style={styles.headerTitle}>Inventory List</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            handleCreateProduct(InvItem);
          }}
        >
          <Text style={styles.buttonText}>Add inventory</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {Invloading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : (
        <FlatList
          data={Invsuccess}
          keyExtractor={(item) => item?._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  Inventory Unit: {item?.unitName} {item?.metricUnit}
                </Text>
                <Text style={styles.userEmail}>Quantity: {item?.quantity}</Text>
                <Text style={styles.userEmail}>Price: {item?.price}</Text>
                <Text style={styles.userEmail}>
                  Status:
                  <Text
                    style={[
                      styles.userEmail,
                      {
                        color:
                          item?.status?.toLowerCase() === "active"
                            ? "green"
                            : "gray",
                      },
                    ]}
                  >
                    {item?.status?.charAt(0).toUpperCase() +
                      item?.status?.slice(1)}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEditInventory(item)}
                style={{ marginRight: 15 }}
              >
                <Ionicons name="pencil" size={25} color="green" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteInventory(item._id)}
                style={{ marginRight: 15 }}
              >
                <Ionicons name="trash" size={25} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default InventoryDetail;
