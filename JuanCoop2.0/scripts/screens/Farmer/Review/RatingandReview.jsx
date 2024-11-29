import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RatingandReview = () => {
  const reviews = [
    {
      id: 1,
      name: 'Alexandra Aquino',
      avatar: 'https://via.placeholder.com/50', // Placeholder for image URL
      rating: 5,
      date: '2 Days Ago',
      comment:
        'From browsing the user-friendly website to receiving the high-quality rice in record time, my entire shopping experience with Agriconnect was smooth and impressive. I’ll definitely recommend them!',
    },
    {
      id: 2,
      name: 'Alexandra Aquino',
      avatar: 'https://via.placeholder.com/50',
      rating: 5,
      date: '3 Days Ago',
      comment:
        'From browsing the user-friendly website to receiving the high-quality rice in record time, my entire shopping experience with Agriconnect was smooth and impressive. I’ll definitely recommend them!',
    },
    {
      id: 3,
      name: 'Alexandra Aquino',
      avatar: 'https://via.placeholder.com/50',
      rating: 5,
      date: '4 Days Ago',
      comment:
        'From browsing the user-friendly website to receiving the high-quality rice in record time, my entire shopping experience with Agriconnect was smooth and impressive. I’ll definitely recommend them!',
    },
  ];

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i < rating ? 'star' : 'star-border'}
          size={20}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  return (
    <ScrollView>
      <View>
        <Text>Overall Rating</Text>
        <Text>5.0</Text>
        <View>{renderStars(5)}</View>
      </View>

      {reviews.map((review) => (
        <View key={review.id}>
          <Image source={{ uri: review.avatar }} />
          <View>
            <View>
              <Text>{review.name}</Text>
              <Text>{review.date}</Text>
            </View>
            <View>{renderStars(review.rating)}</View>
            <Text>{review.comment}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default RatingandReview;
