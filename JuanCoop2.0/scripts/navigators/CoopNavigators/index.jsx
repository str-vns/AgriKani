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
import InfoCancelled from "@src/screens/Cancelled/InfoCancelled";
import Assign from "@src/screens/Rider/Assign";
import RiderDetails from "@src/screens/Rider/RiderDetails";
import AssignLocation from "@src/screens/Rider/RiderAssignLoc";
import MaxCapacity from "@src/screens/Rider/RiderCapacity";
import Riderlist from "@src/screens/Rider/Riderlist";
import History from "@src/screens/Rider/History";
import Reason from "@screens/Cancelled/ReasonCancelled";
import WithdrawList from "@screens/Farmer/Withdraw/WithdrawList";
import Register from "@src/screens/Rider/Register";
import Otp from "@src/screens/Rider/Otp";
import PaymentMethod from "@screens/Farmer/Withdraw/PaymentWithdraw";
import PaymayaWithdraw from "@screens/Farmer/Withdraw/PaymayaWithdrawForm";
import GcashWithdraw from "@screens/Farmer/Withdraw/GcashWithdrawForm";
import CreateWithdraw from "@screens/Farmer/Withdraw/CreateWithdraw";

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

      <Stack.Screen
        name="Riderlist"
        component={Riderlist}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="RiderDetails"
        component={RiderDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AssignLocation"
        component={AssignLocation}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MaxCapacity"
        component={MaxCapacity}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Assign"
        component={Assign}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="InfoCancelled"
        component={InfoCancelled}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />

      <Stack.Screen
        name="Reason"
        component={Reason}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />

      <Stack.Screen
        name="OtpRider"
        component={Otp}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="WithdrawList"
        component={WithdrawList}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />

      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethod}
        options={{
          headerShown: true,
          tabBarShowLabel: false,
        }}
      />

      <Stack.Screen
        name="PaymayaWithdraw"
        component={PaymayaWithdraw}
        options={{
          headerShown: true,
          tabBarShowLabel: false,
        }}
      />

      <Stack.Screen
        name="GcashWithdraw"
        component={GcashWithdraw}
        options={{
          headerShown: true,
          tabBarShowLabel: false,
        }}
      />

      <Stack.Screen
        name="CreateWithdraw"
        component={CreateWithdraw}
        options={{
          headerShown: true,
          tabBarShowLabel: false,
        }}
      />
      
    </Stack.Navigator>
  );
};

export default Index;
