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
import Dashboards from "@screens/admin/dashboard";
import Forum from "@screens/admin/forum";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, BackHandler } from "react-native";
import Sidebar from "@src/screens/Filter/UserSidebar";
import AuthGlobal from "@redux/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BlogList from "@src/screens/admin/Blog/BlogList";
import BlogCreate from "@src/screens/admin/Blog/BlogCreate";
import BlogUpdate from "@src/screens/admin/Blog/BlogUpdate";
import BlogCard from "@src/screens/admin/Blog/BlogCard";
import CoopLists from "@screens/admin/Coop/Cooplist";
import UserList from "@src/screens/admin/User/UserList";
import barGraph from "@src/screens/admin/rankProduct";

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
          name="AdminDashboards"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={Dashboards}
        />
        <Drawer.Screen
          name="Forum"
          component={Forum}
          options={{ headerShown: false, tabBarShowLabel: false }}
        />

        <Drawer.Screen
          name="BlogList"
          component={BlogList}
          options={{ headerShown: false, tabBarShowLabel: false }}
        />

        <Drawer.Screen
          name="BlogCreate"
          component={BlogCreate}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Drawer.Screen
          name="BlogUpdate"
          component={BlogUpdate}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Drawer.Screen
          name="BlogCard"
          component={BlogCard}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />

        <Drawer.Screen
          name="UserList"
          component={UserList}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />

        <Drawer.Screen
          name="CoopList"
          component={CoopLists}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
          <Drawer.Screen
          name="barGraph"
          component={barGraph}
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
