import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CoopDashboard from "@screens/Farmer/FarmerDashboard";
import OrderCoop from "@screens/Farmer/Order/OrderList";
import FNotificationList from "@screens/Farmer/Notification/FarmerNotification";
import MemberList from "@screens/Farmer/Member/MemberList";
import MemberActive from "@screens/Farmer/Member/MemberActive";
import MemberSingle from "@screens/Farmer/Member/MemberSingle";
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

      <Stack.Screen
        name="MemberList"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
        component={MemberList}
      />

      <Stack.Screen
        name="MemberActive"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
        component={MemberActive}
      />

      <Stack.Screen
        name="MemberSingle"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
        component={MemberSingle}
      />
    </Stack.Navigator>
  );
};

export default Index;
