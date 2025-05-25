import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserAddress from "@src/screens/Address/UserAddress";
import UserAddressFormScreen from "@src/screens/Address/UserAddressFormScreen";
import UserAddressEdit from "@screens/Address/UserAddressEdit";
import { DrawerDesign, BackButton } from "@shared/DrawerDesign";
const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserAddress"
        component={UserAddress}
        options={{ header: (props) => <DrawerDesign {...props} title="Address" />,}}
      />
      <Stack.Screen
        name="UserAddressFormScreen"
        component={UserAddressFormScreen}
        options={{header: (props) => <BackButton {...props} title="New Address" />,}}
      />

      <Stack.Screen
        name="UserAddressEdit"
        component={UserAddressEdit}
        options={{ header: (props) => <BackButton {...props} title="Update Address" />,
        }}
      />
    </Stack.Navigator>
  );
};

export default Index;
