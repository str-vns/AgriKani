import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import {
  NativeBaseProvider,
  Button,
  Box,
  HamburgerIcon,
  Pressable,
  Heading,
  VStack,
  Text,
  Center,
  HStack,
  Divider,
  Icon,
  Avatar,
} from "native-base";
import React, { useContext } from "react";
import "react-native-gesture-handler";
import Profile from "@screens/User/UserProfile";
import EditProfile from "@screens/User/UserEditProfile";
import Login from "@screens/UserRegis/UserSignIn";
import ProfileCoop from "@screens/UserRegis/UserCoopRegistration";
import CoopRegistration from "@screens/Farmer/Registration/FarmRegistration";
import CoopDashboard from "@screens/Farmer/FarmerDashboard";
import ProductsList from "@screens/Farmer/Product/ProductList";
import ProductsCreate from "@screens/Farmer/Product/ProductCreate";
import productEdit from "@screens/Farmer/Product/ProductUpdate";
import productArchive from "@screens/Farmer/Product/ProductArchive";
import SearchProduct from "@screens/Filter/SearchProduct";
import BlogLists from "@screens/Farmer/Blog/BlogList";
import BlogCards from "@screens/Farmer/Blog/BlogCard";
import AdminNavigators from "@navigators/AdminNavigators";
import CoopFarmProfile from "@navigators/FarmerNavigators";
import EditFarm from "@screens/Farmer/FarmEdit";
import OrderCoop from "@screens/Farmer/Order/OrderList";
import ProductPace from "@navigators/ProductNavigators";
import ReviewsNavigators from '@navigators/ReviewsNavigators'
import FarmNavigators from '@navigators/FarmerNavigators'
import Main from "../../../Main";
import SignInNavigators from "@navigators/SignInNavigators";
import Home from "@screens/Product/ProductList";
import Register from "@src/screens/UserRegis/UserRegistration";
import OTP from "@src/screens/UserRegis/UserOTP";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, BackHandler } from "react-native";
import Sidebar from "@src/screens/Filter/UserSidebar";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
global.__reanimatedWorkletInit = () => {};

const Drawer = createDrawerNavigator();
const ScrollDrawer = DrawerContentScrollView;
const getIcon = (screenName) => {
  switch (screenName) {
    case "Home":
      return "home-outline";
    case "Products":
      return "cube-outline";
    case "User Profile":
      return "person-circle-outline";
    case "Cart":
      return "cart-outline";
    case "Product List":
      return "archive";
    case "Trash":
      return "trash-can";
    case "Spam":
      return "alert-circle";
    case "Brands":
      return "briefcase-outline";
    default:
      return undefined;
  }
};

function CustomDrawerContent(props) {
  // const context  = userContext(AuthGlobal)

  return (
    <ScrollDrawer {...props} safeArea>
      <VStack space="6" my="2" mx="1">
        <Box px="4">
          <HStack space="4" alignItems="center">
            {/* <Avatar source={{ uri: context.stateUser.userProfile && context.stateUser.userProfile.image && context.stateUser.userProfile.image[0].url }} size="md" /> */}
            <VStack alignItems="flex-start">
              <Text bold color="gray.700">
                {/* {context.stateUser && context.stateUser.userProfile && context.stateUser.userProfile.name ? context.stateUser.userProfile.name : ""} */}
              </Text>
              <Text fontSize="14" color="gray.500" fontWeight="500">
                {/* {context.stateUser && context.stateUser.userProfile && context.stateUser.userProfile.email ? context.stateUser.userProfile.email : ""} */}
              </Text>
            </VStack>
          </HStack>
        </Box>
        <VStack divider={<Divider />} space="4">
          <VStack space="3">
            {props.state.routeNames.map((name, index) => (
              <Pressable
                px="5"
                py="3"
                rounded="md"
                bg={
                  index === props.state.index
                    ? "rgba(6, 182, 212, 0.1)"
                    : "transparent"
                }
                onPress={(event) => {
                  props.navigation.navigate(name);
                }}
              >
                <HStack space="7" alignItems="center">
                  <Icon
                    color={
                      index === props.state.index ? "primary.500" : "gray.500"
                    }
                    size="5"
                    as={<Ionicons name={getIcon(name)} />}
                  />
                  <Text
                    fontWeight="500"
                    color={
                      index === props.state.index ? "primary.500" : "gray.700"
                    }
                  >
                    {name}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </VStack>
        </VStack>
      </VStack>
    </ScrollDrawer>
  );
}

const Index = () => {
  // const context = useContext(AuthGlobal)

  // console.log(context.stateUser.user.UserInfo.roles.includes("Customer"));
  const handleBackPress = () => {
    Alert.alert("Exit App", "Exiting the application?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    })
  );
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
         name="RegisterScreen"
         component={Main}
         initialParams={{ screen: "RegisterScreen" }}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Drawer.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Drawer.Screen
          name="CoopRegistration"
          component={CoopRegistration}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Drawer.Screen
          name="ProfileCoop"
          component={ProfileCoop}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />

        <Drawer.Screen
          name="CoopDashboard"
          component={CoopDashboard}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />

        <Drawer.Screen
          name="ProductsList"
          component={ProductsList}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Drawer.Screen
          name="ProductsCreate"
          component={ProductsCreate}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Drawer.Screen
          name="productEdit"
          component={productEdit}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Drawer.Screen
          name="productArchive"
          component={productArchive}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Drawer.Screen
          name="SearchProduct"
          component={SearchProduct}
          options={{ headerShown: false, tabBarShowLabel: false }}
        />
        <Drawer.Screen
          name="Admin"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={AdminNavigators}
        />

        <Drawer.Screen
          name="BlogLists"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={BlogLists}
        />

        <Drawer.Screen
          name="BlogCards"
          component={BlogCards}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Drawer.Screen
          name="CoopFarmProfile"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={CoopFarmProfile}
        />

        <Drawer.Screen
          name="ProductPace"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={ProductPace}
        />
          <Drawer.Screen
          name="EditFarm"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={EditFarm}
        />
        <Drawer.Screen 
        name = "Reviews"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
        component={ReviewsNavigators}
        />
            <Drawer.Screen
          name="OrderList"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={OrderCoop}
        />
        <Drawer.Screen
          name="Farms"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={FarmNavigators}
        />
      </Drawer.Navigator>
    </Box>
  );
};

export default Index;
