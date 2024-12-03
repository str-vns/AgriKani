import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import AddressList from "@src/screens/Cart/AddressList";
import AddressForm from "@src/screens/Cart/AddressForm";
import Payment from "@src/screens/Cart/UserPayment";
import Review from "@src/screens/Cart/UserReview";
import OrderConfirmation from "@src/screens/Cart/OrderConfirmation";

const Index = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddressList"
        component={AddressList}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="AddressForm"
        component={AddressForm}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{ headerShown: true }}
      />
        <Stack.Screen
        name="Review"
        component={Review}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmation}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default Index;
