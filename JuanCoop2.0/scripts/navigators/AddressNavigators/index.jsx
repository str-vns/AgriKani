import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserAddress from "@src/screens/Address/UserAddress";
import UserAddressFormScreen from "@src/screens/Address/UserAddressFormScreen";

const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserAddress"
        component={UserAddress}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="UserAddressFormScreen"
        component={UserAddressFormScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default Index;
