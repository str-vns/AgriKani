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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { replyComment  } from "@redux/Actions/commentActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProduct } from "@redux/Actions/productActions";
import styles from "@stylesheets/Reviews/userReview";
import { colorCode } from "@stylesheets/colorCode";

const UserAddReview = (props) => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userId = context?.stateUser?.userProfile?._id;
  const { products } = useSelector((state) => state.allProducts);
  const { reviews, prod } = props.route.params;
  const [reply, setReply] = useState("");
  const [token, setToken] = useState(null);
  const [errormessage, setErrorMessage] = useState("");
 const productReview = products?.reviews?.find(
  (review) => review?.product?._id?.toString() === prod?._id?.toString()
);

const isReviewed = productReview?.replyComment?.some(
  (reply) => reply?.user?.toString() === userId?.toString()
);

  useFocusEffect(
    useCallback(() => {
      dispatch(getSingleProduct(prod, token));
    }, [])
    );

    useEffect(() => {
        if (isReviewed && productReview?.replyComment) {
            const userReply = productReview.replyComment.find(
            (reply) => reply.user.toString() === userId?.toString()
            );
            if (userReply) {
            setReply(userReply.commenting);
            }
        }
    }, [isReviewed, productReview, userId]);

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
   },[])

   const handleReply = async () => {
    if (!reply.trim()) {
      setErrorMessage("Reply cannot be empty");
      return;
    }

    if (reply.length > 500) {
      setErrorMessage("Reply must be less than 500 characters");
      return;
    }

    try {
      const response = await dispatch(
        replyComment({
          user: userId,
          comment: reply,
          reviewId: reviews?._id
        }, token)
      );

      if (response) {
        setReply("");
        setErrorMessage("");
        navigation.goBack();
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
}
  return (
<ScrollView contentContainerStyle={styles.container}>
   <View style={styles.reviewSection} >
  
        <Text style={styles.reviewCat}>Your Reply</Text>
      <TextInput
        style={styles.textInput}
        placeholder= {"Write your reply here..."}
        placeholderTextColor= {colorCode.darkGray}
        textAlignVertical="top"
        multiline={true}
        numberOfLines={4}
        value={reply}
        maxLength={500}
        onChangeText={setReply}
      />
</View>
   
      {errormessage ? <Error message={errormessage} /> : null}


      <TouchableOpacity style={styles.button} onPress={handleReply} >
        <Text style={styles.buttonText}>Reply</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UserAddReview;
