import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CoopDashboard from "@screens/Farmer/FarmerDashboard";
import OrderCoop from "@screens/Farmer/Order/OrderList";
import FNotificationList from "@screens/Farmer/Notification/FarmerNotification";
const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CoopDashboard"
        component={CoopDashboard}
        options={{ headerShown: false, tabBarShowLabel: false }}
      />

      <Stack.Screen
        name="FNotificationList"
        component={FNotificationList}
        options={{ headerShown: false,  tabBarShowLabel: false }}
      />

      <Stack.Screen
        name="OrderList"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
        component={OrderCoop}
      />
    </Stack.Navigator>
  );
};

export default Index;
