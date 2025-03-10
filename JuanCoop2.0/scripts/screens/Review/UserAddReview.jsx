import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import Error from "@shared/Error";
import Icon from "react-native-vector-icons/Ionicons"; // For the back arrow
import { AirbnbRating } from "react-native-ratings"; // For star rating
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { createComment } from "@redux/Actions/commentActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProduct } from "@redux/Actions/productActions";

const UserAddReview = (props) => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const userId = context?.stateUser?.userProfile?._id;
  const { products } = useSelector((state) => state.allProducts);
  const { orderId, productId } = props.route.params;
  const transactionId = orderId;
  const navigation = useNavigation();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [dStars,  setDStars] = useState(0);
  const [sStars,  setSStars] = useState(0);
  const [token, setToken] = useState(null);
  const [errormessage, setErrorMessage] = useState("");
  const isReview = products?.reviews?.find(
    (prod) =>
      prod.user?.toString() === userId?.toString() &&
      prod.order?.toString() === transactionId?.toString()
  );
  console.log("Is Review:", isReview);

  useFocusEffect(
    useCallback(() => {
      dispatch(getSingleProduct(productId.product?._id));
    }, [productId.product?._id])
  );

  useEffect(() => {
    if (isReview && isReview.comment && isReview.rating) {
      setReview(isReview.comment);
      setStars(isReview.rating);
    }
  }, [isReview]);

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

  const handleStar = (rating) => {
    setStars(rating);
  };

  const handleDStar = (rating) => {
    setDStars(rating);
  };

  const handleSStar = (rating) => {
    setSStars(rating);
  };
  
  const handlePostReview = () => {
    if (stars === 0) {
      setErrorMessage("Please rate the product");
      return;
    }
    if (dStars === 0) {
      setErrorMessage("Please rate the delivery service");
      return;
    }
    if (sStars === 0) {
      setErrorMessage("Please rate the seller's service");
      return;
    }
  
    const comment = {
      user: userId,
      order: transactionId,
      productId: productId.product._id,
      rating: stars,         // Product Quality Rating
      driverRating: dStars,  // Delivery Speed Rating
      serviceRating: sStars, // Seller Service Rating
      comment: review,
    };
  
    console.log("📌 Submitting Review:", comment);
  
    dispatch(createComment(comment, token))
      .then((response) => {
        console.log("✅ Review Saved Successfully:", response);
      })
      .catch((error) => {
        console.error("❌ Error Saving Review:", error);
      });
  
    navigation.navigate("UserOrderList");
    setReview("");
    setStars(0);
    setDStars(0);
    setSStars(0);
    setErrorMessage("");
  };
  
  useEffect(() => {
    if (isReview) {
      console.log("🔄 Existing Review Found:", isReview);
      if (isReview.comment) setReview(isReview.comment);
      if (isReview.rating) setStars(isReview.rating);
      if (isReview.driverRating) setDStars(isReview.driverRating);
      if (isReview.serviceRating) setSStars(isReview.serviceRating);
    }
  }, [isReview]);
  
  const handleBack = () => {
    console.log("Navigating back");
    navigation.navigate("UserOrderList");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => handleBack()}>
        <Icon name="arrow-back-outline" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Product Ratings</Text>

      <Image
        source={require("@assets/img/yey.png")}
        style={styles.productImage}
        resizeMode="contain"
      />

      <Text style={styles.question}>
        Please Leave Review To {productId.product.productName}
      </Text>
      <Text style={styles.subText}>
        By providing reviews we can make it better for your next order. Thank
        you
      </Text>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewCat}>Product Quality</Text>
        <AirbnbRating
          count={5}
          defaultRating={stars}
          onFinishRating={handleStar}
          size={30}
          starContainerStyle={styles.starContainer}
        />
      </View>

      {/* Text input */}
      <TextInput
        style={styles.textInput}
        placeholder="Tell us about your experience"
        placeholderTextColor="#A9A9A9"
        multiline={true}
        numberOfLines={4}
        value={review}
        onChangeText={setReview}
      />

      {/* Seller Service Rating */}
      <View style={styles.reviewSection}>
        <Text style={styles.reviewCat}>Seller Service</Text>
        <AirbnbRating
          count={5}
          defaultRating={sStars}
          onFinishRating={handleSStar}
          size={30}
          starContainerStyle={styles.starContainer}
        />
      </View>

      {/* Delivery Speed Rating */}
      <View style={styles.reviewSection}>
        <Text style={styles.reviewCat}>Delivery Speed</Text>
        <AirbnbRating
          count={5}
          defaultRating={dStars}
          onFinishRating={handleDStar}
          size={30}
          starContainerStyle={styles.starContainer}
        />
      </View>
      

      {errormessage ? <Error message={errormessage} /> : null}

      <TouchableOpacity style={styles.button} onPress={handlePostReview}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backArrow: {
    position: "absolute",
    left: 10,
    top: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  productImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
    color: "#A9A9A9",
    marginBottom: 5,
  },
  textInput: {
    height: 100,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#FFFFFF",
    textAlignVertical: "top",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FFC107",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewSection: {
    flexDirection: "column",
    alignItems: "center", // Centers the entire section
    marginBottom: 10,
  },
  reviewCat: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  starContainer: {
    alignSelf: "center", // Centers stars
    marginTop: -5, // Adjusts space between text and stars
  },
});

export default UserAddReview;
