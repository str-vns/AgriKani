import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import AddressList from "@src/screens/Cart/AddressList";
import AddressForm from "@src/screens/Cart/AddressForm";
import AddressEdit from "@screens/Cart/AddressEdit";
import Payment from "@src/screens/Cart/UserPayment";
import Review from "@src/screens/Cart/UserReview";
import PaymayaForm from "@screens/Cart/paymayaForm";
import GcashForm from "@screens/Cart/gcashForm";
import OrderConfirmation from "@src/screens/Cart/OrderConfirmation";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert, BackHandler } from "react-native";
import { BackButton, OrderConfirmationHeader } from "@shared/DrawerDesign";
const Index = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddressList"
        component={AddressList}
        options={{
          header: (props) => <BackButton {...props} title="Address List" />,
        }}
      />
      <Stack.Screen
        name="AddressForm"
        component={AddressForm}
        options={{
          header: (props) => <BackButton {...props} title="Address Form" />,
        }}
      />
      <Stack.Screen
        name="AddressEdit"
        component={AddressEdit}
        options={{
          header: (props) => <BackButton {...props} title="Address Edit" />,
        }}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{
          header: (props) => <BackButton {...props} title="Payment" />,
        }}
      />
      <Stack.Screen
        name="Paymaya"
        component={PaymayaForm}
        options={{ header: (props) => <BackButton {...props} title="Paymaya" /> }}
      />
      <Stack.Screen
        name="Gcash"
        component={GcashForm}
        options={{ header: (props) => <BackButton {...props} title="Gcash" /> }}
      />
      <Stack.Screen
        name="Review"
        component={Review}
        options={{ header: (props) => <BackButton {...props} title="Review" /> }}
      />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmation}
        options={{
          header: (props) => <OrderConfirmationHeader {...props} title="Order Confirmation" />,
          gestureEnabled: false,
          headerLeft: () => null,
        }}
      />
    </Stack.Navigator>
  );
};

export default Index;
