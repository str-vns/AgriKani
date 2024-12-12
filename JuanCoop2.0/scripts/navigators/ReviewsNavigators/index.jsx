import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddReviews from "@screens/Review/UserAddReview";

const Stack = createNativeStackNavigator();

const ReviewsNavigators = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddReviews"
        component={AddReviews}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ReviewsNavigators;
