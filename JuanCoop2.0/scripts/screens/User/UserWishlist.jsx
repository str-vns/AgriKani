import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FooterNav from "../../../components/footer";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { getWishlist, WishlistUser } from "@redux/Actions/userActions";

const UserWishlist = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  const defaultImageUrl = "@assets/img/eggplant.png";
  const { user } = useSelector((state) => state.register);
  const Users = useSelector((state) => state.userOnly);
  const userId = context?.stateUser?.userProfile?._id;
  const productIds = user?.wishlist?.map((item) => item.product?._id);
  const wishlist = user?.wishlist?.map((item) => item.product);
  // const productId =
  const [token, setToken] = useState("");
  const [refresh, setRefresh] = React.useState(false);
  const [wishlists, setWishlists] = useState([]);
  console.log("userId: ", wishlist);
 
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

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    setTimeout(() => {
      dispatch(getWishlist(userId, token));
      setRefresh(false);
    }, 500);
  }, [userId, token]);

  useFocusEffect(
    useCallback(() => {
      dispatch(getWishlist(userId, token));
    }, [userId, token])
  );

  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        const jwt = await AsyncStorage.getItem("jwt");
        setToken(jwt);
        setIsLogin(jwt !== null);

        if (jwt && Users) {
          if (Users && Array.isArray(Users.wishlist)) {
            const matchingProducts = Users?.wishlist?.filter(
              (item) => item.product === productIds
            );
            setWishlists(matchingProducts);
          }
        }
      };

      checkLoginStatus();
    }, [user, productIds])
  );

  const wishlistHaart = async (productId) => {
    setRefresh(true);
    try {
      const res = await AsyncStorage.getItem("jwt");
      if (res) {
        setToken(res);
        dispatch(WishlistUser(productId, userId, res));
        dispatch(getWishlist(userId, res));
        onRefresh();
      } else {
        console.log("No JWT token found.");
      }
    } catch (error) {
      console.error("Error retrieving JWT:", error);
    } finally {
      setRefresh(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard} 
      onPress={() => navigation.navigate("SingleProduct", { item })}
    >
      {/* Not working */}
      {/* Product Image */}
      {item?.image?.[0]?.url ? (
        <Image source={{ uri: item?.image[0]?.url }} style={styles.productImage} />
      ) : (
        <Image source={{ uri: defaultImageUrl }} style={styles.productImage} />
      )}
  
      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item?.productName}</Text>
        <Text
          style={styles.productDescription}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item?.description?.length > 50
            ? `${item.description.substring(0, 50)}...`
            : item.description}
        </Text>
      </View>
  
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => wishlistHaart(item?._id)}>
          <Ionicons name="heart" size={28} color="#ff6961" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      {wishlist?.length > 0 ? (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item?._id || item?.id}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContent} // Ensure items are scrollable
          showsVerticalScrollIndicator={false} // Hide scroll bar
        />
      ) : (
        <Text>No items in wishlist</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  flatListContent: {
    paddingBottom: 80, // Space for footer navigation or extra spacing
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    padding: 10,
    marginBottom: 15,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  productPrice: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "bold",
    marginTop: 5,
  },
  productDescription: {
    fontSize: 12,
    color: "#6B7280", // Muted gray color
    marginTop: 3,
  },
  actionButtons: {
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
  },
  iconButton: {
    padding: 5,
    borderRadius: 5,
  },
});

export default UserWishlist;
