import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserAddress from "@src/screens/Address/UserAddress";
import UserAddressFormScreen from "@src/screens/Address/UserAddressFormScreen";
import UserAddressEdit from "@screens/Address/UserAddressEdit";
const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserAddress"
        component={UserAddress}
        options={{ headerShown: true,title: "User Address"  }}
      />
      <Stack.Screen
        name="UserAddressFormScreen"
        component={UserAddressFormScreen}
        options={{headerShown: true,title: "Add Address"}}
      />

      <Stack.Screen
        name="UserAddressEdit"
        component={UserAddressEdit}
        options={{ headerShown: true,title: "Edit Address" }}
      />
    </Stack.Navigator>
  );
};

export default Index;
