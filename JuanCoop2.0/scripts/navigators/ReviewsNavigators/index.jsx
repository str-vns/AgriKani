import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddReviews from "@screens/Review/UserAddReview";
import { BackButton } from "@shared/DrawerDesign";
const Stack = createNativeStackNavigator();

const ReviewsNavigators = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddReviews"
        component={AddReviews}
        options={{
          header: (props) => <BackButton {...props} title="Review"  />,
        }}
      />
    </Stack.Navigator>
  );
};

export default ReviewsNavigators;
