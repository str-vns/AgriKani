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
import CoopFarmProfile from "@screens/Farmer/FarmerProfile";
import EditFarm from "@screens/Farmer/FarmEdit";
import OrderCoop from "@screens/Farmer/Order/OrderList";
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
          name="Order"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={OrderCoop}
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
          name="CoopFarmProfile"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={CoopFarmProfile}
        />
      </Drawer.Navigator>
    </Box>
  );
};

export default Index;
