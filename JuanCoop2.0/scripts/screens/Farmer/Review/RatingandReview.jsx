import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { Rating } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import styles from "@screens/stylesheets/Reviews/single";

const RatingandReview = (props) => {
  const reviews = props?.route?.params?.reviews?.reviews || [];

  const calculateAverage = (key) => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + (review[key] || 0), 0);
    return total / reviews.length;
  };

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

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
      <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>

            </View>
        <Text style={styles.headerTitle}>Review Summary</Text>
      </View> */}

      <ScrollView>
        {/* Overall Ratings Section */}
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
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noReviews}>No Reviews</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default RatingandReview;
