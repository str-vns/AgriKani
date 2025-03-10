import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeBaseProvider, Box, Heading } from "native-base";
import React, { useContext } from "react";
import "react-native-gesture-handler";
import Dashboards from "@screens/admin/dashboard";
import Forum from "@screens/admin/forum";
import Sidebar from "@src/screens/Filter/UserSidebar";
import BlogList from "@src/screens/admin/Blog/BlogList";
import BlogCreate from "@src/screens/admin/Blog/BlogCreate";
import BlogUpdate from "@src/screens/admin/Blog/BlogUpdate";
import BlogCard from "@src/screens/admin/Blog/BlogCard";
import CoopLists from "@screens/admin/Coop/Cooplist";
import UserList from "@src/screens/admin/User/UserList";
import barGraph from "@src/screens/admin/rankProduct";
import CoopActive from "@screens/admin/Coop/CooplistActive";
import CoopDetails from "@screens/admin/Coop/CoopDetails";
import DriverList from "@screens/admin/Driver/DriverList";
import DriverDetails from "@screens/admin/Driver/DriverDetails";
import DriverActive from "@screens/admin/Driver/DriverActive";
import CategoryList from "@screens/admin/Category/CategoryList";
import CategoryCreate from "@screens/admin/Category/CategoryCreate";
import CategoryUpdate from "@screens/admin/Category/CategoryUpdate";
import TypeList from "@screens/admin/Types/TypeList";
import TypeCreate from "@screens/admin/Types/TypeCreate";
import TypeUpdate from "@screens/admin/Types/TypeUpdate";
import WithdrawsSuccess from "@screens/admin/Withdraws/WithdrawsSuccess";
import WithdrawsSingle from "@screens/admin/Withdraws/WithdrawsSingle";
import WithdrawsList from "@screens/admin/Withdraws/WithdrawsList";
import RefundDetails from "@screens/admin/Refund/RefundDetails";
import RefundProcess from "@screens/admin/Refund/RefundProcess";
import RefundSuccess from "@screens/admin/Refund/RefundSuccess";
const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <Box safeArea flex={1}>
      <Stack.Navigator
        initialRouteName="AdminDashboards"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="AdminDashboards" component={Dashboards} />
        <Stack.Screen name="Forum" component={Forum} />
        <Stack.Screen name="BlogList" component={BlogList} />
        <Stack.Screen name="BlogCreate" component={BlogCreate} />
        <Stack.Screen name="BlogUpdate" component={BlogUpdate} />
        <Stack.Screen name="BlogCard" component={BlogCard} />
        <Stack.Screen name="UserList" component={UserList} />
        <Stack.Screen name="CoopList" component={CoopLists} />
        <Stack.Screen name="CoopActive" component={CoopActive} />
        <Stack.Screen name="CoopDetails" component={CoopDetails} />
        <Stack.Screen name="DriverList" component={DriverList} />
        <Stack.Screen name="DriverDetails" component={DriverDetails} />
        <Stack.Screen name="DriverActive" component={DriverActive} />

        <Stack.Screen name="barGraph" component={barGraph} />

        <Stack.Screen name="CategoryList" component={CategoryList} />
        <Stack.Screen name="CategoryCreate" component={CategoryCreate} />
        <Stack.Screen name="CategoryUpdate" component={CategoryUpdate} />

        <Stack.Screen name="TypeList" component={TypeList} />

        <Stack.Screen name="TypeCreate" component={TypeCreate} />
        <Stack.Screen name="TypeUpdate" component={TypeUpdate} />
        <Stack.Screen name="WithdrawsList" component={WithdrawsList} />
        <Stack.Screen name="WithdrawsSuccess" component={WithdrawsSuccess} />
        <Stack.Screen name="WithdrawsSingle" component={WithdrawsSingle} />
        <Stack.Screen name="RefundProcess" component={RefundProcess} />
        <Stack.Screen name="RefundSuccess" component={RefundSuccess} />
        <Stack.Screen name="RefundDetails" component={RefundDetails} />
      </Stack.Navigator>
    </Box>
  );
};

export default Index;
