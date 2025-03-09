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
import { useNavigation, useRoute } from "@react-navigation/native"
import { Alert, BackHandler } from "react-native";

const Index = () => {
  const navigation = useNavigation()
  // useEffect(() => {
  //   const backAction = () => {
  //     // Access the current route
  //     const currentRoute = navigation.getState().routes[navigation.getState().index];
  //     console.log("Current Route: ", currentRoute);
  //     // If the route has its own nested state, we can check for routeNames
  //     if (currentRoute.state && currentRoute.state.routeNames) {
  //       const routeNames = currentRoute.state.routeNames;
  //       console.log("Route Names: ", routeNames);
        
  //       // For example, if you need to access a specific route name from routeNames
  //       const routeName = routeNames[7];  // Check if index 7 exists
  //       console.log("Selected route name: ", routeName);
        
  //       // You can use this routeName to check for specific navigation logic
  //       if (routeName === "test") {
  //         Alert.alert("Alert", "You cannot go back to the review page.", [
  //           { text: "OK", onPress: () => null }
  //         ]);
  //         return true; // Prevent the back action
  //       }
  //     }

  //     return false; // Allow the default back action if no match
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   // Cleanup the back handler when the component is unmounted
  //   return () => backHandler.remove();
  // }, [navigation]);
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
        name="AddressEdit"
        component={AddressEdit}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{ headerShown: true }}
      />
       <Stack.Screen
        name="Paymaya"
        component={PaymayaForm}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Gcash"
        component={GcashForm}
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
        options={{
          headerShown: true,
          gestureEnabled: false, 
          headerLeft: () => null,
        }}
      />


    </Stack.Navigator>
  );
};

export default Index;
