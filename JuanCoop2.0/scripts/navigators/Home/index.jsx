import React, { useState, useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CoopFarmProfile from "@screens/Farmer/FarmerProfile";
import SingleProduct from "@screens/Product/SingleProduct";
import ProductContainer from "@src/screens/Product/ProductContainer";
import Wishlist from "@screens/User/UserWishlist";
import Messages from "@screens/Message/UserChatlist";
import ChatMessages from "@screens/Message/UserChat";
import Cart from "@src/screens/Cart/UserCart";
import UserFooter from "@screens/Others/UserFooter";
import SearchProduct from "@screens/Filter/SearchProduct";
import CoopDistance from "@screens/User/UserDistance";
import NotificationList from "@screens/Notification/NotificationList";
import AddReviews from "@screens/Review/UserAddReview";
import AuthGlobal from "@redux/Store/AuthGlobal";
import {
  DrawerDesign,
  BackButton,
  MessageBackButton,
  CartBackButton,
} from "@shared/DrawerDesign";
import { useSelector } from "react-redux";
const Stack = createStackNavigator();

const HomeNavigation = () => {
  const cartItems = useSelector((state) => state.cartItems);
  const context = useContext(AuthGlobal);
  
  return (
    <>
      <Stack.Navigator initialRouteName="ProductContainer">
        <Stack.Screen
          name="ProductContainer"
          component={ProductContainer}
          options={{
            header: (props) => <DrawerDesign {...props} title={`Hi, ${context?.stateUser?.userProfile?.firstName || "Guest"}`} />,
          }}
        />

        <Stack.Screen
          name="Wishlist"
          component={Wishlist}
          options={{ header: (props) => <BackButton {...props} title="Wishlist" /> }}
        />

        <Stack.Screen
          name="Messages"
          component={Messages}
          options={{
            header: (props) => <DrawerDesign {...props} title="Message" />,
          }}
        />

        <Stack.Screen
          name="NotificationList"
          component={NotificationList}
          options={{
            header: (props) => <DrawerDesign {...props} title="Notification" />,
          }}
        />

        <Stack.Screen
          name="ChatMessages"
          component={ChatMessages}
          options={({ route }) => ({
            header: (props) => (
              <MessageBackButton
                {...props}
                title="Message"
                item={route.params.item}
              />
            ),
          })}
        />

        <Stack.Screen
          name="SingleProduct"
          component={SingleProduct}
          options={({ route }) => ({
            header: (props) => (
              <BackButton {...props} title={route.params.item.productName} />
            ),
          })}
        />

        <Stack.Screen
          name="CoopFarmProfile"
          options={{
            header: (props) => (
              <BackButton {...props} title="Cooperative Profile" />
            ),
          }}
          component={CoopFarmProfile}
        />

        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{
            header: (props) => (
              <CartBackButton
                {...props}
                title={`Shopping Cart (${cartItems.length})`}
              />
            ),
          }}
        />

        <Stack.Screen
          name="SearchProduct"
          component={SearchProduct}
          options={{
            headerShown: true,
            title: "Search Result",
            tabBarShowLabel: false,
          }}
        />

        <Stack.Screen
          name="CoopDistance"
          component={CoopDistance}
          options={{
            header: (props) => <DrawerDesign {...props} title="Location" />,
          }}
        />

        <Stack.Screen
          name="AddReviews"
          component={AddReviews}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
      </Stack.Navigator>
      <UserFooter />
    </>
  );
};

export default HomeNavigation;
