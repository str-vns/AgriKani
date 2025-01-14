import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import styles from "@screens/stylesheets/singleProduct";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Rating } from "react-native-elements";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const RatingandReview = (props) => {
  const navigation = useNavigation()
  const productRev = props?.route?.params?.reviews;
  const reviews = props?.route?.params?.reviews?.reviews;
  const overallReview = props?.route?.params?.reviews?.ratings;
  console.log("reviews", productRev.sentiment);
  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu-outline" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Review List</Text>
      </View>
    <ScrollView >
      {/* Overall Rating Section */}
      <View style={styles.overallRating}>
        <Text style={styles.ratingText}>Overall Rating</Text>
        <View style={styles.ratingStars}> 
          <Rating
                  imageSize={20}
                  readonly
                  startingValue={overallReview || 0}
                  style={styles.rating}
                  />
        </View>
      </View>

      {/* Suggestions Section */}
      { productRev?.sentiment === "Mostly positive" ? ( 
         <View style={styles.suggestionCard}>
        <Text style={styles.suggestionText}>
          Message: Your product is doing great! Keep up the good work.

        </Text>
      </View>
    ) : productRev?.sentiment === "positive" ? ( 
      <View style={styles.suggestionCard}>
     <Text style={styles.suggestionText}>
       Message: Keep up the good work! Your product is doing great.

     </Text>
   </View>
 ) : productRev?.sentiment === "negative" ? ( 
  <View style={styles.suggestionCard}>
 <Text style={styles.suggestionText}>
   suggestion: Your product needs improvement, more marketing and services

 </Text>
</View>
) : productRev?.sentiment === "Mostly negative" ? ( 
  <View style={styles.suggestionCard}>
 <Text style={styles.suggestionText}>
   suggestion: Your Product needs a lot of improvement, more marketing and services

 </Text>
</View>
) : null}
    



      {/* Reviews Section */}
      <Text style={styles.reviewsHeader}>Product Reviews</Text>
         {reviews?.length > 0 ? (
                 reviews?.map((review, index) => (
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
                             <Text
  style={[
    styles.reviewDate,
    {
      color:
        review.sentimentScore <= -15
          ? '#FF0000' // Red for "Mostly Negative"
          : review.sentimentScore < 0
          ? '#FF0000' // Light Red for "Negative"
          : review.sentimentScore >= 15
          ? '#32CD32' // Green for "Mostly Positive"
          : review.sentimentScore > 0
          ? '#32CD32' // Light Green for "Positive"
          : '#808080', // Gray for "Neutral"
    },
  ]}
>
  {" "}
  {review?.sentimentScore <= -15
    ? 'Mostly Negative'
    : review?.sentimentScore < 0
    ? 'Negative'
    : review?.sentimentScore >= 15
    ? 'Mostly Positive'
    : review?.sentimentScore > 0
    ? 'Positive'
    : 'Neutral'}
</Text>
                           </Text>
                           <Rating
                             imageSize={20}
                             readonly
                             startingValue={review?.rating || 0}
                             style={styles.rating}
                           />
                         </View>
                         <View style={styles.reviewMessage}>
                           <Text>
                             {review?.comment || "No review message available."}
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
    </View>
  );
};

export default RatingandReview;
