import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet
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


const SearchProduct = (props) => {
  // console.log("props: ", props.route.params.coopFilter);
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
  <TouchableOpacity
    onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    style={style.burgerIconContainer}
  >
    <Feather name="menu" size={28} color="black" />
  </TouchableOpacity>

  {coops && coops.length > 0 ? (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.categoryScrollContainer}
  >
    {coops.map((coop, index) => (
      <TouchableOpacity
        key={coop?._id || index} // Ensure unique key, using coop._id or index as fallback
        style={styles.categoryBox}
        onPress={() =>
  navigation.navigate("Home", {
    screen: "CoopFarmProfile",
    params: { coop: coop }, 
  })
}
      >
        <Image
          source={{
            uri: coop?.user?.image?.url || "https://img.icons8.com/color/452/fruit.png", // Fallback image
          }}
          style={styles.categoryIcon}
        />
        <Text style={styles.categoryText} ellipsizeMode="tail" numberOfLines={1}>
          {coop?.farmName}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
) : null}
 
  {product && product.length > 0 ? (
    <ScrollView contentContainerStyle={style.scrollViewContent}>
      {product.map((prod, index) => (
        <TouchableOpacity
          key={index}
          style={style.productCard}
          onPress={() => navigation.navigate("SingleProduct", { item: prod })}
        >

          <TouchableOpacity style={style.wishlistIcon} onPress={() => wishlistHaart(prod)}>
            <Icon
              name="favorite"
              size={20}
              color={wishlist.includes(prod.id) ? "#ff6961" : "#ccc"}
            />
          </TouchableOpacity>

          {prod.image && prod.image.length > 0 ? (
            <Image
              source={{ uri: prod.image[0]?.url || defaultImageUrl }}
              style={style.productImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={style.noImageText}>No images available</Text>
          )}

          <View style={style.productInfo}>
            <Text style={style.productName}>{prod.productName}</Text>
            <Text style={style.productPrice}>₱ {prod.pricing}</Text>
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
      padding: 16,
      backgroundColor: '#f8f8f8',
    },
    burgerIconContainer: {
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 10,
    },
    scrollViewContent: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    wishlistIcon: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 10,
    },
    productCard: {
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 8,
      overflow: 'hidden',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      padding: 16,
    },
    productImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
    },
    noImageText: {
      textAlign: 'center',
      color: '#888',
      marginVertical: 20,
    },
    productInfo: {
      paddingTop: 10,
    },
    productName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    productPrice: {
      fontSize: 16,
      color: '#555',
      marginTop: 4,
    },
    noProductContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noProductText: {
      fontSize: 16,
      color: '#888',
    },
  });
  
export default SearchProduct;
