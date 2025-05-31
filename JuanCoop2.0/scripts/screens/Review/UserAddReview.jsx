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
import { CamModal } from "@shared/Modal";
import styles from "@stylesheets/Reviews/userReview";
import { colorCode } from "@stylesheets/colorCode";

const UserAddReview = (props) => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const userId = context?.stateUser?.userProfile?._id;
  const { products } = useSelector((state) => state.allProducts);
  const { orderId, productId } = props.route.params;
  const transactionId = orderId;
  const navigation = useNavigation();
  const [review, setReview] = useState("");
  const [reviewSeller, setReviewSeller] = useState("");
  const [stars, setStars] = useState(0);
  const [dStars, setDStars] = useState(0);
  const [sStars, setSStars] = useState(0);
  const [token, setToken] = useState(null);
  const [errormessage, setErrorMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const maxImage = 5;
  const [images, setImages] = useState([]);

  console.log(context?.stateUser?.roles)
  const isReview = products?.reviews?.find(
    (prod) =>
      prod.user?.toString() === userId?.toString() &&
      prod.order?.toString() === transactionId?.toString()
  );

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

  const handlePostReview = async() => {
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
      rating: stars,
      driverRating: dStars,
      serviceRating: sStars,
      comment: review,
      commentSeller: reviewSeller,
      image: images,
    };

    const response = await dispatch(createComment(comment, token));

    if (response.success) {
      navigation.navigate("UserOrderList");
      setReview("");
      setStars(0);
      setDStars(0);
      setSStars(0);
      setImages([]);
      setErrorMessage("");
    }

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
  
  const starContainer = [
    {
      title: "Product Quality",
      rating: stars,
      onFinishRating: handleStar,
      comment: review,
      setComment: setReview,
      placeholder: "Tell us about the product quality",

    },
    {
      title: "Seller Service",
      rating: sStars,
      onFinishRating: handleSStar,
      comment: reviewSeller,
      setComment: setReviewSeller,  
      placeholder: "Tell us about the seller's service & your Suggestions",
    },
    {
      title: "Delivery Speed",
      rating: dStars,
      onFinishRating: handleDStar,

    }
  ]
  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      {starContainer.map((item, index) => (
   <View style={styles.reviewSection} key={index}>
  
        <Text style={styles.reviewCat}>{item.title}</Text>
        <AirbnbRating
          count={5}
          showRating={false}
          defaultRating={item.rating}
          onFinishRating={item.onFinishRating}
          size={20}
          starContainerStyle={styles.starContainer}
        />

        { item.title !== "Delivery Speed" && item.title !== "Seller Service" && (
      <TextInput
        style={styles.textInput}
        placeholder= {item.placeholder}
        placeholderTextColor= {colorCode.darkGray}
        textAlignVertical="top"
        multiline={true}
        numberOfLines={4}
        value={item.comment}
        maxLength={500}
        onChangeText={item.setComment}
      />
    )}
    
      {item.title === "Product Quality" && (
        <>
          <TouchableOpacity
            style={styles.containerButton}
            onPress={() => setModalVisible(true)}
          >
            <Text>Add Image </Text>
          </TouchableOpacity>
          {images.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((image, index) => (
                <View key={index} style={{ marginRight: 10 }}>
                  <Image
                    source={{ uri: image }}
                    style={styles.imageSize}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setImages((prev) => prev.filter((_, i) => i !== index));
                    }}
                    style={styles.closeButton}
                  >
                    <Icon name="close-circle" size={20} color={colorCode.PASTELRED} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </>
      )}

   </View>
      ))}
   
      {errormessage ? <Error message={errormessage} /> : null}

      {modalVisible && (
        <CamModal
          modalVisible={modalVisible}
          onPress={setModalVisible}
          isMultiple={maxImage}
          isCurrent={images.length}
          ImageReturn={(images) => {
            setImages((prev) => [...prev, ...images].slice(0, maxImage));
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handlePostReview}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UserAddReview;
