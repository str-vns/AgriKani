import React, { useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import CoopFarmProfile from "@screens/Farmer/FarmerProfile";
import SingleProduct from "@screens/Product/SingleProduct";
import ProductContainer from "@src/screens/Product/ProductContainer";
import Wishlist from "@screens/User/UserWishlist";
import Messages from "@screens/Message/UserChatlist";
import ChatMessages from "@screens/Message/UserChat";
import CoopDashboard from "@screens/Farmer/FarmerDashboard";
import Cart from "@src/screens/Cart/UserCart";
import AddressList from "@src/screens/Address/AddressList";
import AddressForm from "@src/screens/Address/AddressForm";
import Payment from "@src/screens/Cart/UserPayment";
import Review from "@src/screens/Cart/UserReview";
import OrderConfirmation from "@src/screens/Cart/OrderConfirmation";
import UserOrderList from "@src/screens/User/UserOrderList";
//import UserPostList from "@src/screens/Post/PostList";
import UserPostList from "@src/screens/Post/UserPostList";
import UserPostScreen from "@src/screens/Post/UserPostScreen";
import UserAddress from "@src/screens/Address/UserAddress";
import UserAddressFormScreen from "@src/screens/Address/UserAddressFormScreen";
import PostList from "@src/screens/admin/Post/postList";
import CommunityForum from "@src/screens/Post/CommunityForum";
import barGraph from "@src/screens/admin/rankProduct";
const Stack = createStackNavigator();

const HomeNavigation = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductContainer"
        component={ProductContainer}
        options={{ headerShown: false, tabBarShowLabel: false }}
      />
      
      <Stack.Screen
        name="Wishlist"
        component={Wishlist}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{ headerShown: true }}
      />
    <Stack.Screen
        name="ChatMessages"
        component={ChatMessages}
        options={({ route }) => {
          const { item } = route.params;
          console.log("Item: ", item);
          const firstName = item?.firstName || '';
          const lastName =  item?.lastName ||'';
          const profileImage =  item?.image?.url || 'https://as2.ftcdn.net/v2/jpg/02/48/15/85/1000_F_248158543_jK3q4R8EQh0AhRtjp5n6CLXGpa0lxJvX.jpg';
          
          return {
            headerTitle: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />

                <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 8 }}>
                  {`${firstName} ${lastName}`}
                </Text>
              </View>
            ),
            headerTitleAlign: "left",
          };
        }}
      />
      <Stack.Screen
        name="SingleProduct"
        component={SingleProduct}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AddressList"
        component={AddressList}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="AddressForm"
        component={AddressForm}
        options={{ headerShown: true }}
      />
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
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Review"
        component={Review}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmation}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="UserOrderList"
        component={UserOrderList}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="UserPostList"
        component={UserPostList}
        options={{ headerShown: true }}
      />

<Stack.Screen
        name="CoopDashboard"
        component={CoopDashboard}
        options={{ headerShown: false, tabBarShowLabel: false }}
      />
 <Stack.Screen
        name="CooperativeProfile"
        component={CoopFarmProfile}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="PostList"
        component={PostList}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="UserPostScreen"
        component={UserPostScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="CommunityForum"
        component={CommunityForum}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Background color
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
  selectedChatItem: {
    backgroundColor: '#fef8e5',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 10,
    height: 10,
    borderRadius: 25,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'green',
    position: 'absolute',
    bottom: 0,
    right: 70,
    borderWidth: 2,
    borderColor: '#fff',
  },
  offlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'gray',
    position: 'absolute',
    bottom: 0,
    right: 70,
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatTextContainer: {
    marginLeft: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    color: '#777',
    marginTop: 2,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  time: {
    color: '#999',
    fontSize: 12,
  },
  unreadBadge: {
    backgroundColor: '#f7b900',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  unreadCount: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default HomeNavigation;
