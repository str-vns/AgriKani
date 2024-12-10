import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Alert, BackHandler } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import HomeScreen from "@navigators/Home";
import RegisterScreen from "@navigators/SignInNavigators";
import ReviewsNavigators from "@navigators/ReviewsNavigators";
import AdminNavigators from "@navigators/AdminNavigators";
import AddressNavigators from "@navigators/AddressNavigators";
import PostNavigators from "@navigators/PostNavigators";
import CoopNavigators from "@navigators/CoopNavigators";
import CheckOutNavigators from "@navigators/CheckOutNavigators";
import UserNavigators from "@navigators/UserNavigators";
import CoopProductNavigators from "@navigators/CoopProductNavigators";
import MessagesNavigators from "@navigators/MessagesNavigators";
import BlogNavigators from "@navigators/BlogNavigators";

import AuthGlobal from "@redux/Store/AuthGlobal";

const Stack = createStackNavigator();

const Main = () => {
  const context = useContext(AuthGlobal);
  const navigation = useNavigation(); 
  const UserRoles = context.stateUser.user.CustomerInfo;

  const handleBackPress = () => {
    const currentRoute = navigation.getCurrentRoute()?.name;
    console.log("Current Route:", navigation.getCurrentRoute());
    if (currentRoute === "Coop") { 
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
    } else {

      navigation.goBack();
      return true; 
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      return () => {
        backHandler.remove();
      };
    }, [navigation])
  );

  const renderStackNavigator = () => {
    if (
      context?.stateUser?.isAuthenticated &&
      UserRoles?.roles.includes("Customer") &&
      UserRoles?.roles.includes("Cooperative")
    ) {
  
      return (
        <Stack.Navigator
          initialRouteName="Coop" 
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Coop" component={CoopNavigators} />
          <Stack.Screen name="User" component={UserNavigators} />
          <Stack.Screen name="CoopProduct" component={CoopProductNavigators} />
          <Stack.Screen name="Post" component={PostNavigators} />
          <Stack.Screen name="Messaging" component={MessagesNavigators} />
          <Stack.Screen name="Blog" component={BlogNavigators} />
        </Stack.Navigator>
      );
    } else if (
      context?.stateUser?.isAuthenticated &&
      UserRoles?.roles.includes("Admin")
    ) {
      return (
        <Stack.Navigator
          initialRouteName="Admin" 
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Admin" component={AdminNavigators} />
        </Stack.Navigator>
      );
    } else {
      return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Reviews" component={ReviewsNavigators} />
          <Stack.Screen name="Address" component={AddressNavigators} />
          <Stack.Screen name="CheckOut" component={CheckOutNavigators} />
          <Stack.Screen name="User" component={UserNavigators} />
        </Stack.Navigator>
      );
    }
  };

  return <>{renderStackNavigator()}</>;
};

export default Main;
