import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import FooterNav from "../../../components/footer";
import Feather from "@expo/vector-icons/Feather";
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native"; // For drawer navigation
import styles from "../../../components/styles";
import { WishlistUser } from "@redux/Actions/userActions";
import { addToCart } from "@src/redux/Actions/cartActions";
import { getProduct } from "@redux/Actions/productActions";
import { Profileuser } from "@redux/Actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSocket } from "../../../SocketIo";

const ProductCard = (props) => {
  const context = useContext(AuthGlobal);
  const userId = context?.stateUser?.userProfile?._id;
  const { productName, description, image, pricing, _id, stock } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const socket = useSocket();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, error } = useSelector((state) => state.userOnly);

  const productId = _id;
  const defaultImageUrl = "@assets/img/eggplant.png";

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
    if (!socket) {
      console.warn("Socket is not initialized.");
      return;
    }
  

      if (userId) {
        socket.emit("addUser", userId);
      } else {
        console.warn("User ID is missing.");
      }
  
      socket.on("getUsers", (users) => {
        const onlineUsers = users.filter(
          (user) => user.online && user.userId !== null
        );
        setOnlineUsers(onlineUsers);
      });
  
      return () => {
        socket.off("getUsers");
      };
    }, [socket, userId]);

  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        const jwt = await AsyncStorage.getItem("jwt");
        setToken(jwt);
        setIsLogin(jwt !== null);

        if (jwt && user) {
          if (user && Array.isArray(user.wishlist)) {
            const matchingProducts = user.wishlist.filter(
              (item) => item.product === productId
            );
            setWishlist(matchingProducts);
          }
        }
      };

      checkLoginStatus();
    }, [user, productId])
  );

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

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: _id,
        productName,
        pricing,
        quantity: 1, 
        user: user,
        image: image[0]?.url,
      })
    );
  };

  return (
    <View style={styles.productBox}>
      <TouchableOpacity style={styles.wishlistIcon} onPress={wishlistHaart}>
        <Icon
          name="favorite"
          size={20}
          color={wishlist.length > 0 ? "#ff6961" : "#ccc"}
        />
      </TouchableOpacity>

      {image && image.length > 0 ? (
        <Image
          key={0}
          source={{ uri: image[0].url || defaultImageUrl }}
          style={styles.productImage}
          resizeMode="cover"
        />
      ) : (
        <Text style={styles.productImage}>No images available</Text>
      )}

      <Text style={styles.productName}>{productName}</Text>
      <Text style={styles.productPrice}>₱ {stock[0]?.price}</Text>
      {/* <Text style={styles.productDiscount}>{product.discount}</Text> */}
      {/* <TouchableOpacity style={styles.plusIcon}>
        <Icon name="add" size={14} color="#fff" onPress={handleAddToCart} />
      </TouchableOpacity> */}
    </View>
  );
};

export default ProductCard;
