import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Rating } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import styles from "@screens/stylesheets/Reviews/single";
import { ImageShowModal } from "@shared/Modal";

const RatingandReview = (props) => {
  const reviews = props?.route?.params?.reviews?.reviews || [];
  const prod = props?.route?.params?.reviews;
  const navigation = useNavigation();
  const [imagePick, setImagePick] = useState(null);
  const [isViewVisible, setIsViewVisible] = useState(false);
  const calculateAverage = (key) => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + (review[key] || 0), 0);
    return total / reviews.length;
  };

  console.log("Reviews:", );

  const toPercentage = (rating) => Math.round((rating / 5) * 100);

  const overallProductRating = calculateAverage("rating");
  const overallServiceRating = calculateAverage("serviceRating");
  const overallDeliveryRating = calculateAverage("driverRating");

  const productPercentage = toPercentage(overallProductRating);
  const servicePercentage = toPercentage(overallServiceRating);
  const deliveryPercentage = toPercentage(overallDeliveryRating);

  /* Generate Feedback Messages */
  const getMessage = (percentage, category) => {
    if (percentage >= 90)
      return `${category}: Excellent! (${percentage}%) Keep up the great work!`;
    if (percentage >= 75)
      return `${category}: Very Good! (${percentage}%) Customers are happy.`;
    if (percentage >= 50)
      return `${category}: Average (${percentage}%) Consider some improvements.`;
    if (percentage >= 30)
      return `${category}: Below Average (${percentage}%) Needs improvement.`;
    return `${category}: Poor (${percentage}%) Immediate improvements needed!`;
  };

  /* Sentiment Analysis for Comments */
  const getSentiment = (rating) => {
    if (rating >= 4) return "😊 Positive";
    if (rating >= 2.5) return "😐 Neutral";
    return "😡 Negative";
  };

  const handleImageClick = (imageUrl) => {
    setImagePick(imageUrl);
    setIsViewVisible(true);
  };

  const handleReviewSubmit = (reviews) => {
    navigation.navigate("ReplyReview", { reviews, prod: prod?._id });
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Ratings</Text>

          <View style={styles.overallRating}>
            <Text style={styles.ratingText}>Product Rating</Text>
            <Rating
              imageSize={22}
              readonly
              startingValue={overallProductRating}
            />
          </View>
          <Text style={styles.feedback}>
            {getMessage(productPercentage, "Product Rating")}
          </Text>

          <View style={styles.overallRating}>
            <Text style={styles.ratingText}>Seller Service Rating</Text>
            <Rating
              imageSize={22}
              readonly
              startingValue={overallServiceRating}
            />
          </View>
          <Text style={styles.feedback}>
            {getMessage(servicePercentage, "Seller Service Rating")}
          </Text>

          <View style={styles.overallRating}>
            <Text style={styles.ratingText}>Delivery Speed Rating</Text>
            <Rating
              imageSize={22}
              readonly
              startingValue={overallDeliveryRating}
            />
          </View>
          <Text style={styles.feedback}>
            {getMessage(deliveryPercentage, "Delivery Speed Rating")}
          </Text>
        </View>

        {/* Product Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Reviews</Text>

          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <View key={index} style={styles.review}>
                <Image
                  source={
                    review.user?.image?.url
                      ? { uri: review.user.image.url }
                      : require("@assets/img/sample.png")
                  }
                  style={styles.reviewProfile}
                />
                <View style={styles.reviewContent}>
                  <Text style={styles.reviewName}>
                    {review.user?.firstName || "Anonymous"}{" "}
                    {review.user?.lastName || ""}
                  </Text>

                  <View style={styles.additionalRatings}>
                    <Text style={styles.ratingCategory}>Seller Service:</Text>
                    <Rating
                      imageSize={18}
                      readonly
                      startingValue={review?.serviceRating || 0}
                    />
                  </View>
                  <View style={styles.additionalRatings}>
                    <Text style={styles.ratingCategory}>Delivery Speed:</Text>
                    <Rating
                      imageSize={18}
                      readonly
                      startingValue={review?.driverRating || 0}
                    />
                  </View>
                  <View style={styles.additionalRatings}>
                    <Text style={styles.ratingCategory}>Product Quality:</Text>
                    <Rating
                      imageSize={18}
                      readonly
                      startingValue={review?.rating || 0}
                    />
                  </View>
                  <Text style={styles.sentiment}>
                    Sentiments: {getSentiment(review?.rating || 0)}
                  </Text>
                  <Text style={styles.reviewMessage}>
                    Comment: {review?.comment || "No review message available."}
                  </Text>
                  {review?.image?.length > 0 && (
                    <View>
                      <Text style={styles.reviewMessage}>Image:</Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                      >
                        {review.image.map((image, imgIndex) => (
                          <View key={imgIndex} style={{ marginRight: 10 }}>
                            <TouchableOpacity
                              onPress={() => handleImageClick(image.url)}
                            >
                              <Image
                                key={imgIndex}
                                source={{ uri: image.url }}
                                style={styles.reviewImage}
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.replyButton}
                    onPress={() => handleReviewSubmit(review)}
                  >
                    <Text style={styles.replyText}>
                      <Icon name="chatbubble-outline" size={13} color="#000" />{" "}
                      Reply
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noReviews}>No Reviews</Text>
          )}
        </View>
      </ScrollView>
      {isViewVisible && (
        <ImageShowModal
          modalVisible={isViewVisible}
          selectedImage={imagePick || "https://via.placeholder.com/150"}
          onPress={() => setIsViewVisible(false)}
        />
      )}
    </View>
  );
};

export default RatingandReview;
