import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CoopDashboard from "@screens/Farmer/FarmerDashboard";
import OrderCoop from "@screens/Farmer/Order/OrderList";
import FNotificationList from "@screens/Farmer/Notification/FarmerNotification";
import MemberList from "@screens/Farmer/Member/MemberList";
import MemberActive from "@screens/Farmer/Member/MemberActive";
import MemberSingle from "@screens/Farmer/Member/MemberSingle";
import AssignList from "@screens/Farmer/Assign/AssignList";
import HistoryCoop from "@src/screens/Rider/HistoryCoop";
import AssingDetails from "@screens/Farmer/Assign/AssignDetails";
import ReviewList from "@screens/Farmer/Review/RatingList";
import Reviews from "@screens/Farmer/Review/RatingandReview";
import InventoryList from "@screens/Farmer/Inventory/InventoryList";
import InventoryDetail from "@screens/Farmer/Inventory/InventoryDetail";
import inventoryCreate from "@screens/Farmer/Inventory/InventoryCreate";
import inventoryUpdate from "@screens/Farmer/Inventory/InventoryUpdate";
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
        options={{ headerShown: false, tabBarShowLabel: false }}
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

      <Stack.Screen
        name="AssignList"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
        component={AssignList}
      />

      <Stack.Screen
        name="HistoryCoop"
        component={HistoryCoop}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AssingDetails"
        component={AssingDetails}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ReviewList"
        component={ReviewList}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Reviews"
        component={Reviews}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="InventoryList"
        component={InventoryList}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="InventoryDetail"
        component={InventoryDetail}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="inventoryCreate"
        component={inventoryCreate}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />

      <Stack.Screen
        name="inventoryUpdate"
        component={inventoryUpdate}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />

    </Stack.Navigator>
  );
};

export default Index;
