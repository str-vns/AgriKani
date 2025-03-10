import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Rating } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const RatingandReview = (props) => {
  const navigation = useNavigation();
  const productRev = props?.route?.params?.reviews;
  const reviews = props?.route?.params?.reviews?.reviews || [];

  /* Calculate Overall Ratings and Percentages */
  const calculateAverage = (key) => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + (review[key] || 0), 0);
    return total / reviews.length;
  };

  const toPercentage = (rating) => Math.round((rating / 5) * 100);

  const overallProductRating = calculateAverage('rating');
  const overallServiceRating = calculateAverage('serviceRating');
  const overallDeliveryRating = calculateAverage('driverRating');

  const productPercentage = toPercentage(overallProductRating);
  const servicePercentage = toPercentage(overallServiceRating);
  const deliveryPercentage = toPercentage(overallDeliveryRating);

  /* Generate Feedback Messages */
  const getMessage = (percentage, category) => {
    if (percentage >= 90) return `${category}: Excellent! (${percentage}%) Keep up the great work!`;
    if (percentage >= 75) return `${category}: Very Good! (${percentage}%) Customers are happy.`;
    if (percentage >= 50) return `${category}: Average (${percentage}%) Consider some improvements.`;
    if (percentage >= 30) return `${category}: Below Average (${percentage}%) Needs improvement.`;
    return `${category}: Poor (${percentage}%) Immediate improvements needed!`;
  };

  /* Sentiment Analysis for Comments */
  const getSentiment = (rating) => {
    if (rating >= 4) return '😊 Positive';
    if (rating >= 2.5) return '😐 Neutral';
    return '😡 Negative';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>

            </View>
        <Text style={styles.headerTitle}>Review Summary</Text>
      </View>

      <ScrollView>
        {/* Overall Ratings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Ratings</Text>

          <View style={styles.overallRating}>
            <Text style={styles.ratingText}>Product Rating</Text>
            <Rating imageSize={22} readonly startingValue={overallProductRating} />
          </View>
          <Text style={styles.feedback}>{getMessage(productPercentage, "Product Rating")}</Text>

          <View style={styles.overallRating}>
            <Text style={styles.ratingText}>Seller Service Rating</Text>
            <Rating imageSize={22} readonly startingValue={overallServiceRating} />
          </View>
          <Text style={styles.feedback}>{getMessage(servicePercentage, "Seller Service Rating")}</Text>

          <View style={styles.overallRating}>
            <Text style={styles.ratingText}>Delivery Speed Rating</Text>
            <Rating imageSize={22} readonly startingValue={overallDeliveryRating} />
          </View>
          <Text style={styles.feedback}>{getMessage(deliveryPercentage, "Delivery Speed Rating")}</Text>
        </View>

        {/* Product Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Reviews</Text>

          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <View key={index} style={styles.review}>
                <Image
                  source={review.user?.image?.url ? { uri: review.user.image.url } : require('@assets/img/sample.png')}
                  style={styles.reviewProfile}
                />
                <View style={styles.reviewContent}>
                  <Text style={styles.reviewName}>{review.user?.firstName || 'Anonymous'} {review.user?.lastName || ''}</Text>
                 
                  <View style={styles.additionalRatings}>
                    <Text style={styles.ratingCategory}>Seller Service:</Text>
                    <Rating imageSize={18} readonly startingValue={review?.serviceRating || 0} />
                  </View>
                  <View style={styles.additionalRatings}>
                    <Text style={styles.ratingCategory}>Delivery Speed:</Text>
                    <Rating imageSize={18} readonly startingValue={review?.driverRating || 0} />
                  </View>
                  <View style={styles.additionalRatings}>
                    <Text style={styles.ratingCategory}>Product Quality:</Text>
                    <Rating imageSize={18} readonly startingValue={review?.rating || 0} />
                  </View>
                  <Text style={styles.sentiment}>Sentiments: {getSentiment(review?.rating || 0)}</Text>
                  <Text style={styles.reviewMessage}>Comment: {review?.comment || 'No review message available.'}</Text>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingBottom: 15 },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000000', marginLeft: 10 },
  section: { marginVertical: 10, paddingHorizontal: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  overallRating: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 },
  ratingText: { fontSize: 16 },
  feedback: { fontSize: 14, fontStyle: 'italic', color: '#555', marginBottom: 5 },
  review: { flexDirection: 'row', padding: 10, marginBottom: 10, backgroundColor: '#fff', borderRadius: 8, elevation: 2 },
  reviewProfile: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  reviewContent: { flex: 1 },
  reviewName: { fontWeight: 'bold', fontSize: 14 },
  additionalRatings: { flexDirection: 'row', alignItems: 'center', marginVertical: 3 },
  ratingCategory: { fontSize: 14, marginRight: 5 },
  reviewMessage: { fontSize: 14, color: '#555', marginTop: 5 },
  sentiment: { fontSize: 14, color: '#333', marginTop: 5 },
  noReviews: { textAlign: 'center', fontSize: 14, color: '#888', marginTop: 10 },
});

export default RatingandReview;