import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, } from "@react-navigation/drawer";
import { Box, Pressable, VStack, Text, HStack, Divider, Icon } from "native-base";
import "react-native-gesture-handler";
import AdminNavigators from "@navigators/AdminNavigators";
import AddressNavigators from "@navigators/AddressNavigators";
import PostNavigators from "@navigators/PostNavigators";
import CoopNavigators from "@navigators/CoopNavigators";
import HomeScreen from "@navigators/Home";
import UserNavigators from "@navigators/UserNavigators";
import CoopProductNavigators from "@navigators/CoopProductNavigators";
import MessagesNavigators from "@navigators/MessagesNavigators";
import BlogNavigators from "@navigators/BlogNavigators"
import Main from "../../../Main";
import { Ionicons } from "@expo/vector-icons";
import Sidebar from "@src/screens/Filter/UserSidebar";
global.__reanimatedWorkletInit = () => {};

const Drawer = createDrawerNavigator();

const Index = () => {
  
  return (
    <Box safeArea flex={1}>
      <Drawer.Navigator drawerContent={(props) => <Sidebar {...props} />}>
        <Drawer.Screen
          name="Home"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={Main}
        />

        <Drawer.Screen
          name="Messages"
          component={HomeScreen}
          initialParams={{ screen: "Messages" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
            
        <Drawer.Screen
          name="UserOrderList"
          component={UserNavigators}
          initialParams={{ screen: "UserOrderList" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />

        <Drawer.Screen
          name="UserAddress"
          component={AddressNavigators}
          initialParams={{ screen: "UserAddress" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />

        <Drawer.Screen
          name="Profile"
          initialParams={{ screen: "Profile" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={UserNavigators}
        />

        <Drawer.Screen
          name="CoopDashboard"
          initialParams={{ screen: "CoopDashboard" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={CoopNavigators}
        />

        <Drawer.Screen
          name="ProductsList"
          initialParams={{ screen: "ProductsList" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={CoopProductNavigators}
        />

        <Drawer.Screen
          name="productArchive"
          initialParams={{ screen: "productArchive" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={CoopProductNavigators}
        />

        <Drawer.Screen
          name="BlogLists"
          initialParams={{ screen: "BlogLists" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={BlogNavigators}
        />

        <Drawer.Screen
          name="CommunityForum"
          initialParams={{ screen: "CommunityForum" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={PostNavigators}
        />

        <Drawer.Screen
          name="OrderList"
          initialParams={{ screen: "OrderList" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={CoopNavigators}
        />
        
        <Drawer.Screen
          name="Messaging"
          initialParams={{ screen: "Messages" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={MessagesNavigators}
          />

        <Drawer.Screen
          name="AdminDashboards"
          initialParams={{ screen: "AdminDashboards" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={AdminNavigators}
        />

        <Drawer.Screen
          name="UserList"
          initialParams={{ screen: "UserList" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={AdminNavigators}
        />

        <Drawer.Screen
          name="CoopList"
          initialParams={{ screen: "CoopList" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={AdminNavigators}
        />

        <Drawer.Screen
          name="BlogList"
          initialParams={{ screen: "BlogList" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={AdminNavigators}
        />

        <Drawer.Screen
          name="PostList"
          initialParams={{ screen: "PostList" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={PostNavigators}
        />

        <Drawer.Screen
          name="barGraph"
          initialParams={{ screen: "barGraph" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={AdminNavigators}
        />
      </Drawer.Navigator>
    </Box>
  );
};

export default Index;
