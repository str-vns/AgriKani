import React, { useContext, useEffect, useState } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import {
  Box,
  Pressable,
  VStack,
  Text,
  HStack,
  Divider,
  Icon,
} from "native-base";
import "react-native-gesture-handler";
import AdminNavigators from "@navigators/AdminNavigators";
import AddressNavigators from "@navigators/AddressNavigators";
import PostNavigators from "@navigators/PostNavigators";
import CoopNavigators from "@navigators/CoopNavigators";
import HomeScreen from "@navigators/Home";
import ReviewsNavigators from "@navigators/ReviewsNavigators";
import UserNavigators from "@navigators/UserNavigators";
import CoopProductNavigators from "@navigators/CoopProductNavigators";
import MessagesNavigators from "@navigators/MessagesNavigators";
import BlogNavigators from "@navigators/BlogNavigators";
import RiderNavigators from "@navigators/RiderNavigators";
import WithdrawList from "@screens/Farmer/Withdraw/WithdrawList";
import WithdrawsList from "@screens/admin/Withdraws/WithdrawsList";
import RefundProcess from "@screens/admin/Refund/RefundProcess";
import RegisterScreen from "@navigators/SignInNavigators"
import AboutUs from "@screens/User/AboutUs";
import Tutorial from "@screens/User/Tutorial";
import Landing from "@screens/User/Landing";
import ProductContainer from "@screens/Product/ProductContainer";
import CoopDistance from "@screens/User/UserDistance";
import Main from "../../../Main";
import Sidebar from "@src/screens/Filter/UserSidebar";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isLogin } from "@redux/Actions/Auth.actions";
import { ActivityIndicator } from "react-native";
import { DrawerDesign } from "@shared/DrawerDesign";

global.__reanimatedWorkletInit = () => {};

const Drawer = createDrawerNavigator();

const Index = () => {
  const context = useContext(AuthGlobal);

  useEffect(() => {
    const initialize = async () => {
      await context.dispatch(isLogin(context.dispatch));
    };

    initialize();
  }, []);

  // if (loading) {
  //   // Show loading spinner while the app is being initialized
  //   return (
  //     <Box flex={1} justifyContent="center" alignItems="center">
  //       <ActivityIndicator size="large" color="#0000ff" />
  //       <Text>Loading...</Text>
  //     </Box>
  //   );
  // }

  return (
    <Box safeArea flex={1}>
      <Drawer.Navigator drawerContent={(props) => <Sidebar {...props} />}>
        <Drawer.Screen
          name="Home"
          component={Main}
          options={{ headerShown: false, tabBarShowLabel: false }}
        />
        <Drawer.Screen
          name="Messages"
          component={HomeScreen}
          initialParams={{ screen: "Messages" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
        />
        <Drawer.Screen
          name="UserOrderList"
          component={UserNavigators}
          initialParams={{ screen: "UserOrderList" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
        />
        <Drawer.Screen
          name="UserAddress"
          component={AddressNavigators}
          initialParams={{ screen: "UserAddress" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
        />
        <Drawer.Screen
          name="Profile"
          initialParams={{ screen: "Profile" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={UserNavigators}
        />
        <Drawer.Screen
          name="CoopDashboard"
          initialParams={{ screen: "CoopDashboard" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={CoopNavigators}
        />
        <Drawer.Screen
          name="ProductsList"
          initialParams={{ screen: "ProductsList" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={CoopProductNavigators}
        />
        <Drawer.Screen
          name="productArchive"
          initialParams={{ screen: "productArchive" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={CoopProductNavigators}
        />
        <Drawer.Screen
          name="BlogLists"
          initialParams={{ screen: "BlogLists" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={BlogNavigators}
        />
        <Drawer.Screen
          name="CommunityForum"
          initialParams={{ screen: "CommunityForum" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={PostNavigators}
        />
        <Drawer.Screen
          name="OrderList"
          initialParams={{ screen: "OrderList" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={CoopNavigators}
        />
        <Drawer.Screen
          name="Messaging"
          initialParams={{ screen: "Messages" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={MessagesNavigators}
        />
        <Drawer.Screen
          name="AdminDashboards"
          initialParams={{ screen: "AdminDashboards" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={AdminNavigators}
        />
        <Drawer.Screen
          name="UserList"
          initialParams={{ screen: "UserList" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={AdminNavigators}
        />
        <Drawer.Screen
          name="CoopList"
          initialParams={{ screen: "CoopList" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={AdminNavigators}
        />
        <Drawer.Screen
          name="BlogList"
          initialParams={{ screen: "BlogList" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={AdminNavigators}
        />
        <Drawer.Screen
          name="PostList"
          initialParams={{ screen: "PostList" }}
          options={{
            headerShown: true,
            tabBarShowLabel: false,
            title: "Post List",
          }}
          component={PostNavigators}
        />

        <Drawer.Screen
          name="DriverList"
          initialParams={{ screen: "DriverList" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={AdminNavigators}
        />

        <Drawer.Screen
          name="Reviews"
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={ReviewsNavigators}
        />
        <Drawer.Screen
          name="barGraph"
          initialParams={{ screen: "barGraph" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={AdminNavigators}
        />
        <Drawer.Screen
          name="MemberList"
          initialParams={{ screen: "MemberList" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={CoopNavigators}
        />
        <Drawer.Screen
          name="FNotificationList"
          initialParams={{ screen: "FNotificationList" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={CoopNavigators}
        />
        <Drawer.Screen
          name="Riderlist"
          initialParams={{ screen: "Riderlist" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={CoopNavigators}
        />
        <Drawer.Screen
          name="Deliveries"
          initialParams={{ screen: "Deliveries" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={RiderNavigators}
        />
        <Drawer.Screen
          name="History"
          initialParams={{ screen: "History" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={RiderNavigators}
        />

        <Drawer.Screen
          name="AssignList"
          initialParams={{ screen: "AssignList" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={CoopNavigators}
        />

        <Drawer.Screen
          name="InventoryList"
          initialParams={{ screen: "InventoryList" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={CoopNavigators}
        />

        <Drawer.Screen
          name="ReviewList"
          initialParams={{ screen: "ReviewList" }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={CoopNavigators}
        />

        <Drawer.Screen
          name="CategoryList"
          initialParams={{ screen: "CategoryList " }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={AdminNavigators}
        />

        <Drawer.Screen
          name="TypeList"
          initialParams={{ screen: "TypeList " }}
          options={{ headerShown: false, tabBarShowLabel: false }}
          component={AdminNavigators}
        />

        <Drawer.Screen
          name="WithdrawsList"
          component={WithdrawsList}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />

        <Drawer.Screen
          name="RefundProcess"
          component={RefundProcess}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Drawer.Screen
          name="AboutUs"
          component={AboutUs}
          options={{
            header: (props) => <DrawerDesign {...props} title="About Us" />,
          }}
        />
        <Drawer.Screen
          name="Tutorial"
          component={Tutorial}
          options={{
            header: (props) => (
              <DrawerDesign {...props} title="Tutorial Videos" />
            ),
          }}
        />
        <Drawer.Screen
          name="Landing"
          component={Landing}
          options={{
            header: (props) => (
              <DrawerDesign
                {...props}
                title={`Hi, ${
                  context?.stateUser?.userProfile?.firstName || "Guest"
                }`}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="ProductContainer"
          component={ProductContainer}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Drawer.Screen
          name="CoopDistance"
          component={CoopDistance}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />

        <Drawer.Screen
          name="ChatMessaging"
          component={RiderNavigators}
          initialParams={{ screen: "ChatMessaging" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />

        <Drawer.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          initialParams={{ screen: "Login" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}  
        />
      </Drawer.Navigator>
    </Box>
  );
};

export default Index;
