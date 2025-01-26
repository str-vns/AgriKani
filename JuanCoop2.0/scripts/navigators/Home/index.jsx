import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
const Stack = createStackNavigator();

const HomeNavigation = () => {
  const navigation = useNavigation();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  return (
    <>
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
        name="NotificationList"
        component={NotificationList}
        options={{ headerShown: false }}
      />

        <Stack.Screen
          name="ChatMessages"
          component={ChatMessages}
          options={({ route }) => {
            const { item } = route.params;
            console.log("Item: ", item);
            const firstName = item?.firstName || "";
            const lastName = item?.lastName || "";
            const profileImage =
              item?.image?.url ||
              "https://as2.ftcdn.net/v2/jpg/02/48/15/85/1000_F_248158543_jK3q4R8EQh0AhRtjp5n6CLXGpa0lxJvX.jpg";

            return {
              headerTitle: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{ uri: profileImage }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />

                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", marginLeft: 8 }}
                  >
                    {`${firstName} ${lastName}`}
                  </Text>
                </View>
              ),
              headerTitleAlign: "left",
              headerLeft: () => (
                            <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
                              <Ionicons name="arrow-back" size={24} color="black" style={{ marginLeft: 10 }} />
                            </TouchableOpacity>
                          ),
            };
          }}
        />

        <Stack.Screen
          name="SingleProduct"
          component={SingleProduct}
          options={{ headerShown: true }}
        />

        <Stack.Screen
          name="CoopFarmProfile"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={CoopFarmProfile}
        />

        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SearchProduct"
          component={SearchProduct}
          options={{ headerShown: false, tabBarShowLabel: false }}
        />

        <Stack.Screen
          name="CoopDistance"
          component={CoopDistance}
          options={{ headerShown: false, tabBarShowLabel: false }}
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
