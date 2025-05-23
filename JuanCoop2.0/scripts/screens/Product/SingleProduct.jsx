import React, { useCallback, useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Rating } from "react-native-elements";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions } from "react-native"; // For screen width calculations
import { useDispatch, useSelector } from "react-redux";
import { getCoop } from "@redux/Actions/productActions";
import { addToCart } from "@src/redux/Actions/cartActions";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import styles from "@screens/stylesheets/singleProduct";
import { WishlistUser } from "@redux/Actions/userActions";
import { Icon } from "react-native-elements";
import { Profileuser } from "@redux/Actions/userActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { useSocket } from "../../../SocketIo";

const SingleProduct = ({ route }) => {
  const context = useContext(AuthGlobal);
  const userId = context?.stateUser?.userProfile?._id;

  // Use product from route.params.item
  const product = route?.params?.item;

  if (!product) {
    console.error("Product data is missing from route.params.item");
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Product data is unavailable.</Text>
      </View>
    );
  }

  // Destructure product properties safely
  const { productName, description, image, pricing, _id, stock } = product || {};

  console.log("Product: ", product);

  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { coop } = useSelector((state) => state.singleCoop);
  const SLIDER_WIDTH = Dimensions.get("window").width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);
  const navigation = useNavigation();
  const [selectedSize, setSelectedSize] = useState(stock?.[0]);
  const [wishlist, setWishlist] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const { user, error } = useSelector((state) => state.userOnly);
  const productId = _id;

  useFocusEffect(
    useCallback(() => {
      const checkLoginStatus = async () => {
        try {
          const jwt = await AsyncStorage.getItem("jwt");
          console.log("Retrieved JWT:", jwt); // Debugging log
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
        } catch (error) {
          console.error("Error retrieving JWT:", error);
        }
      };

      checkLoginStatus();
    }, [user, productId])
  );

  const wishlistHaart = async () => {
    console.log("isLogin state:", isLogin); // Debugging log
    if (!isLogin) {
      console.log("Navigating to login");
      navigation.navigate("Login");
      return;
    }

    setLoading(true);
    try {
      const jwt = await AsyncStorage.getItem("jwt");
      if (jwt) {
        setToken(jwt);
        await dispatch(WishlistUser(productId, userId, jwt));
        await dispatch(Profileuser(userId, jwt));
        console.log("Product added to wishlist successfully.");
      } else {
        console.log("No JWT token found.");
      }
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const increment = () => {
    if (product?.stock?.length === 1) {
      if (quantity < product?.stock[0]?.quantity) {
        setQuantity(quantity + 1);
      } else {
        console.log("Maximum quantity reached");
      }
    } else {
      if (quantity < selectedSize?.quantity) {
        setQuantity(quantity + 1);
      } else {
        console.log("Maximum quantity reached for this size");
      }
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (product?.stock?.length === 1) {
        const cartItem = {
          inventoryId: product?.stock[0]?._id,
          id: product?._id,
          productName: product?.productName,
          pricing: product?.stock[0]?.price,
          quantity: quantity,
          metricUnit: product?.stock[0]?.metricUnit,
          unitName: product?.stock[0]?.unitName,
          coop: product?.coop,
          image: product?.image[0]?.url,
          maxQuantity: product?.stock[0]?.quantity,
        };

        AsyncStorage.setItem("cartItem", JSON.stringify(cartItem));

        Alert.alert("Item added to cart");

        dispatch(addToCart(cartItem));
      } else if (selectedSize) {
        const cartItem = {
          inventoryId: selectedSize?._id,
          id: product?._id,
          productName: product?.productName,
          pricing: selectedSize?.price,
          quantity: quantity,
          metricUnit: selectedSize?.metricUnit,
          unitName: selectedSize?.unitName,
          coop: product?.coop,
          user: product?.user,
          image: product?.image[0]?.url,
          maxQuantity: selectedSize?.quantity,
        };

        Alert.alert("Item added to cart");
        dispatch(addToCart(cartItem));
      } else {
        Alert.alert("Please select a size or ensure stock is available.");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      Alert.alert("An error occurred while adding the item to the cart.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (product && product?.coop?._id) {
        dispatch(getCoop(product?.coop?._id));
      }
    }, [dispatch, product])
  );

  const handleSelectSize = (item) => {
    setSelectedSize(item);
    setQuantity(1);
  };

  const renderImageItem = ({ item }) => {
    if (!item?.url) {
      console.warn("Image URL is missing: ", item);
      return null;
    }
    return <Image source={{ uri: item?.url }} style={styles.carouselImage} />;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Carousel
            data={product?.image || []}
            width={SLIDER_WIDTH}
            height={250}
            renderItem={({ item }) => renderImageItem({ item })}
          />
        </View>

        <View style={styles.productNameAndWishlistContainer}>
          <Text style={styles.productName}>{product?.productName}</Text>
          <TouchableOpacity style={styles.wishlistIcon} onPress={wishlistHaart}>
            <Icon
              name="favorite"
              size={20}
              color={wishlist.length > 0 ? "#ff6961" : "#ccc"}
            />
          </TouchableOpacity>
        </View>

        {product?.stock?.length === 1 ? (
          <>
            <View style={styles.priceAndQuantity}>
              <Text style={styles.price}>₱ {product?.stock[0]?.price}</Text>
              
              <View style={styles.quantityContainer2}>
                <Text style={styles.stock}>
                  Stock: {product?.stock[0]?.quantity} {product?.stock[0]?.unitName}{" "}
                  {product?.stock[0]?.metricUnit}
                </Text>
                <View style={styles.quantityContainer2}>
                  <TouchableOpacity onPress={decrement} style={styles.quantityButton2}>
                    <Text style={styles.quantityButtonText2}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity2}>{quantity}</Text>
                  <TouchableOpacity onPress={increment} style={styles.quantityButton2}>
                    <Text style={styles.quantityButtonText2}>+</Text>
                  </TouchableOpacity>
                  
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.priceAndQuantity}>
              <Text style={styles.price}>₱ {selectedSize?.price}</Text>
            </View>
            <View style={styles.stockContainer}>
              <Text>Product Size</Text>
              <ScrollView horizontal={true}>
                {product?.stock.map((item, index) => {
                  const isSelected = item === selectedSize;
                  const stockCardStyle = isSelected
                    ? styles?.stockCardSelected
                    : styles?.stockCard;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={stockCardStyle}
                      onPress={() => handleSelectSize(item)}
                    >
                      <Text style={styles.stock}>
                        {item?.unitName} {item?.metricUnit}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <View style={styles.StockAndQContainer}>
                <Text style={styles.stock2}>Stock: {selectedSize?.quantity}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={decrement} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{quantity}</Text>
                  <TouchableOpacity onPress={increment} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}

        <Text style={styles.productDescription}>{product?.description}</Text>

        <View style={styles.farmerInfo}>
          <TouchableOpacity
            style={styles.farmerInfo2}
            onPress={() =>
              navigation.navigate("Home", {
                screen: "CoopFarmProfile",
                params: { coop: coop },
              })
            }
          >
            {coop?.user?.image?.url ? (
              <Image
                source={{ uri: coop?.user?.image?.url }}
                style={styles.farmerImage}
              />
            ) : (
              <View style={{ padding: 10 }}>
                <FontAwesome5 name="store" size={24} color="black" />
              </View>
            )}

            <View>
              <Text style={styles.farmerName}>
                {coop?.farmName?.length > 50
                  ? `${coop?.farmName.slice(0, 20)}\n${coop?.farmName.slice(20)}`
                  : coop?.farmName || "Farm Name"}
              </Text>
              <Text style={styles.location}>
                {coop?.barangay === "undefined" ? "" : coop?.barangay} {coop?.city}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.reviewsHeader}>Product Reviews</Text>
        {product?.reviews?.length > 0 ? (
          product?.reviews?.map((review, index) => (
            <ScrollView key={index}>
              <View style={styles.review}>
                <Image
                  source={
                    review.user?.image?.url
                      ? { uri: review?.user?.image?.url }
                      : require("@assets/img/sample.png")
                  }
                  style={styles.reviewProfile}
                />
                <View style={styles.reviewContent}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewName}>
                      {review.user?.firstName || "Anonymous"}{" "}
                      {review.user?.lastName || "Anonymous"}
                    </Text>
                    <Rating
                      imageSize={20}
                      readonly
                      startingValue={review.rating || 0}
                      style={styles.rating}
                    />
                  </View>
                  <View style={styles.reviewMessage}>
                    <Text>
                      {review.comment || "No review message available."}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          ))
        ) : (
          <Text style={{ paddingLeft: 15 }}>No Reviews</Text>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SingleProduct;
