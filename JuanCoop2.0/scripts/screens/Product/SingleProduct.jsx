import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Rating } from "react-native-elements";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions } from "react-native"; // For screen width calculations
import { useDispatch, useSelector } from "react-redux";
import { getCoop } from "@redux/Actions/productActions";
import { addToCart } from "@src/redux/Actions/cartActions";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import styles from "@screens/stylesheets/singleProduct";

const SingleProduct = ({ route }) => {
  const product = route.params.item;
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { coop } = useSelector((state) => state.singleCoop);
  const SLIDER_WIDTH = Dimensions.get("window").width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8); // Adjust the width of each
  const navigation = useNavigation();

  // Increment quantity with stock check
  const increment = () => {
    if (quantity < product?.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Decrement quantity
  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product._id,
        productName: product.productName,
        pricing: product.pricing,
        quantity,
        user: product.user,
        image: product.image[0]?.url,
      })
    );
  };

  useEffect(() => {
    if (product && product.user) {
      dispatch(getCoop(product.user));
    }
  }, [dispatch, product]);

  const renderImageItem = ({ item }) => {
    if (!item?.url) {
      console.warn("Image URL is missing: ", item);
      return null; 
    }
    return <Image source={{ uri: item.url }} style={styles.carouselImage} />;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Carousel for Product Images */}
        <View style={styles.imageContainer}>
          <Carousel
            data={product.image || []}
            width={SLIDER_WIDTH}
            height={250}
            renderItem={({ item }) => renderImageItem({ item })}
          />
        </View>

        <Text style={styles.productName}>{product?.productName}</Text>

        <View style={styles.priceAndQuantity}>
          <Text style={styles.price}>₱ {product?.pricing}</Text>
          <View style={styles.quantityControl}>
            <Text style={styles.stock}>Stock: {product?.stock} kg</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={decrement}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity
                onPress={increment}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* <Text style={styles.productHeading}>Description</Text> */}

        {/* Product Description */}
        <Text style={styles.productDescription}>{product.description}</Text>

        {/* Farmer Info */}

        <View style={styles.farmerInfo}>
          <TouchableOpacity
            style={styles.farmerInfo2}
            onPress={() =>
              navigation.navigate("CooperativeProfile", { coop: coop })
            }
          >
            {coop?.user?.image?.url ? (
              <Image
                source={{ uri: coop.user.image.url }}
                style={styles.farmerImage}
              />
            ) : (
              <View style={{ padding: 10 }}>
                <FontAwesome5 name="store" size={24} color="black" />
              </View>
            )}

            <View>
              <Text style={styles.farmerName}>
                {coop?.farmName || "Farm Name"}
              </Text>
              <Text style={styles.location}>
                {coop?.barangay === "undefined" ? "" : coop?.barangay}{" "}
                {coop?.city}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.ratingContainer}>
            <TouchableOpacity
              style={styles.box}
              onPress={() =>
                navigation.navigate("CooperativeProfile", { coop: coop })
              }
            >
              <Text style={styles.boxText}>View Shop</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reviews */}
        <Text style={styles.reviewsHeader}>Product Reviews</Text>
        {product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <ScrollView>
              <View key={index} style={styles.review}>
                <Image
                  source={
                    review.user?.image.url
                      ? { uri: review.user?.image.url }
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
          <Text>No Reviews</Text>
        )}
      </ScrollView>

      {/* Add to Cart and View Cart Buttons */}
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewCartButton}>
          <Text style={styles.buttonText}>View Cart</Text>
        </TouchableOpacity>
      </View> */}

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
