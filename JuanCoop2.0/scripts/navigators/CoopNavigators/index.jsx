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
import BlogListCoop from "@screens/Farmer/Blog/BlogListCoop";
import BlogCards from "@screens/Farmer/Blog/BlogCards";
import { DrawerDesign, BackButton, ListContainer } from "@shared/DrawerDesign";
const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <Stack.Navigator initialRouteName="CoopDashboard">
      <Stack.Screen
        name="CoopDashboard"
        component={CoopDashboard}
        options={({ route }) => ({
          header: (props) => (
            <ListContainer
              {...props}
              title="Dashboard"
              isScreen="CoopDash"
              isCreate={true}
            />
          ),
        })}
      />

      <Stack.Screen
        name="FNotificationList"
        component={FNotificationList}
        options={{
          header: (props) => <DrawerDesign {...props} title="Notification" />,
        }}
      />

      <Stack.Screen
        name="OrderList"
        options={{
          header: (props) => <DrawerDesign {...props} title="Order List" />,
        }}
        component={OrderCoop}
      />

      <Stack.Screen
        name="MemberList"
        options={{
          header: (props) => <DrawerDesign {...props} title="Member List" />,
        }}
        component={MemberList}
      />

      <Stack.Screen
        name="MemberActive"
        options={{
          header: (props) => <DrawerDesign {...props} title="Member List" />,
        }}
        component={MemberActive}
      />

      <Stack.Screen
        name="MemberSingle"
        options={{
          header: (props) => <BackButton {...props} title="Member Details" />,
        }}
        component={MemberSingle}
      />

      <Stack.Screen
        name="AssignList"
        options={({ route }) => ({
          header: (props) => (
            <ListContainer
              {...props}
              title="History"
              isScreen="Assign History"
              isCreate={true}
            />
          ),
        })}
        component={AssignList}
      />

      <Stack.Screen
        name="HistoryCoop"
        component={HistoryCoop}
        options={{
          header: (props) => <BackButton {...props} title="History" />,
        }}
      />

      <Stack.Screen
        name="AssingDetails"
        component={AssingDetails}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ReviewList"
        component={ReviewList}
        options={{
          header: (props) => <DrawerDesign {...props} title="Review List" />,
        }}
      />

      <Stack.Screen
        name="Reviews"
        component={Reviews}
        options={{
          header: (props) => <BackButton {...props} title="Review Summary" />,
        }}
      />

      <Stack.Screen
        name="InventoryList"
        component={InventoryList}
        options={{
          header: (props) => <DrawerDesign {...props} title="Inventory List" />,
        }}
      />

      <Stack.Screen
        name="InventoryDetail"
        component={InventoryDetail}
        options={({ route }) => ({
          header: (props) => (
            <ListContainer
              {...props}
              title="Inventory Detail"
              isCreate={true}
              isScreen="Inventory"
              item={route.params?.Inv}
            />
          ),
        })}
      />

      <Stack.Screen
        name="inventoryCreate"
        component={inventoryCreate}
        options={{
          header: (props) => <BackButton {...props} title="Add Inventory" />,
        }}
      />

      <Stack.Screen
        name="inventoryUpdate"
        component={inventoryUpdate}
        options={{
          header: (props) => <BackButton {...props} title="Update Inventory" />,
        }}
      />

      <Stack.Screen
        name="Riderlist"
        component={Riderlist}
        options={({ route }) => ({
          header: (props) => (
            <ListContainer
              {...props}
              title="Rider List"
              isCreate={true}
              isScreen="Rider"
            />
          ),
        })}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          header: (props) => <BackButton {...props} title="Register" />,
        }}
      />

      <Stack.Screen
        name="RiderDetails"
        component={RiderDetails}
        options={{
          header: (props) => <BackButton {...props} title="Rider Details" />,
        }}
      />
      <Stack.Screen
        name="AssignLocation"
        component={AssignLocation}
        options={{
          header: (props) => <BackButton {...props} title="Register" />,
        }}
      />

      <Stack.Screen
        name="MaxCapacity"
        component={MaxCapacity}
        options={{
          header: (props) => <BackButton {...props} title="Rider Capacity" />,
        }}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Assign"
        component={Assign}
        options={{
          header: (props) => <BackButton {...props} title="Assigned" />,
        }}
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
          header: (props) => <BackButton {...props} title="Reason of Cancel" />,
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
          header: (props) => <DrawerDesign {...props} title="Wallet" />,
        }}
      />

      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethod}
        options={{
          header: (props) => <BackButton {...props} title="Payment Method" />,
        }}
      />

      <Stack.Screen
        name="PaymayaWithdraw"
        component={PaymayaWithdraw}
        options={{
          header: (props) => <BackButton {...props} title="Paymaya Withdraw" />,
        }}
      />

      <Stack.Screen
        name="GcashWithdraw"
        component={GcashWithdraw}
        options={{
          header: (props) => <BackButton {...props} title="Gcash Withdraw" />,
        }}
      />

      <Stack.Screen
        name="CreateWithdraw"
        component={CreateWithdraw}
        options={{
          header: (props) => <BackButton {...props} title="Create Withdraw" />,
        }}
      />
      <Stack.Screen
        name="BlogListCoop"
        component={BlogListCoop}
        options={{
          header: (props) => <DrawerDesign {...props} title="Blogs" />,
        }}
      />
      <Stack.Screen
        name="BlogCards"
        component={BlogCards}
        options={{ header: (props) => <BackButton {...props} title="Blog" /> }}
      />
    </Stack.Navigator>
  );
};

export default Index;
