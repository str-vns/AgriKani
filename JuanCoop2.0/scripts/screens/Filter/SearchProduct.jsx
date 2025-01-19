import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Icon } from "react-native-elements";
import Feather from "@expo/vector-icons/Feather";
import { DrawerActions, useNavigation } from "@react-navigation/native"; // For drawer navigation
import styles from "../../../components/styles";
import { WishlistUser } from "@redux/Actions/userActions";
import { Profileuser } from "@redux/Actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

const SearchProduct = (props) => {
  // console.log("props: ", props.route.params.coopFilter);
  const screenHeight = Dimensions.get("window").height;
  const context = useContext(AuthGlobal);
  const { user, error } = useSelector((state) => state.userOnly);
  const userId = context?.stateUser?.userProfile?._id;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const defaultImageUrl = "@assets/img/eggplant.png";
  const product = props.route.params.productFilter;
  const coops = props.route.params.coopFilter;
  const [wishlist, setWishlist] = useState([]);
  const [token, setToken] = useState();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const checkLoginStatus = async () => {
      const jwt = await AsyncStorage.getItem("jwt");
      setToken(jwt);
      setIsLogin(jwt !== null);

      if (jwt && user) {
        if (user && Array.isArray(user.wishlist)) {
          const matchingProducts = user.wishlist.filter(
            (item) => item.product === product?.id
          );
          setWishlist(matchingProducts);
        } else {
        }
      } else {
      }
    };

    checkLoginStatus();
  }, [user, product?.id]);

  const wishlistHaart = async () => {
    if (!isLogin) {
      console.log("Navigating to login");
      navigation.navigate("Login");
      return;
    }
    setLoading(true);
    try {
      const res = await AsyncStorage.getItem("jwt");
      if (res) {
        setToken(res);
        dispatch(WishlistUser(productId, userId, res));
        dispatch(Profileuser(userId, res));
      } else {
        console.log("No JWT token found.");
      }
    } catch (error) {
      console.error("Error retrieving JWT:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={style.productContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={34} color="black" />
        </TouchableOpacity>
      </View>
      {/* Coops Section */}
      {coops && coops.length > 0 ? (
        <ScrollView
          style={[style.coopScroll, { maxHeight: screenHeight * 0.2 }]} // Adjust max height dynamically
          contentContainerStyle={style.scrollViewContent}
        >
          {coops.map((coop, index) => (
            <TouchableOpacity
              key={coop?._id || index}
              style={style.coopCard}
              onPress={() =>
                navigation.navigate("Home", {
                  screen: "CoopFarmProfile",
                  params: { coop: coop },
                })
              }
            >
              <Image
                source={{
                  uri:
                    coop?.user?.image?.url ||
                    "https://img.icons8.com/color/452/fruit.png",
                }}
                style={style.coopImage}
              />
              <Text style={style.coopName}>{coop?.farmName}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : null}

      {/* Product Section */}
      {product && product.length > 0 ? (
        <ScrollView style={style.productScroll}>
          {product.map((prod, index) => (
            <TouchableOpacity
              key={index}
              style={style.productCard}
              onPress={() =>
                navigation.navigate("SingleProduct", { item: prod })
              }
            >
              <Image
                source={{ uri: prod.image[0]?.url || defaultImageUrl }}
                style={style.productImage}
                resizeMode="cover"
              />
              <View style={style.productInfo}>
                <Text style={style.productName}>{prod.productName}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={style.noProductContainer}>
          <Text style={style.noProductText}>No Products Found</Text>
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  productContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingBottom: 80,
  },
  coopScroll: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingVertical: 10,
  },
  coopCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 3,
  },
  coopImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  coopName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productScroll: {
    flex: 1, // Allows the product list to take up remaining space
    paddingHorizontal: 16,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  productInfo: {
    paddingTop: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  noProductContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noProductText: {
    fontSize: 16,
    color: "#888",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
});

export default SearchProduct;
