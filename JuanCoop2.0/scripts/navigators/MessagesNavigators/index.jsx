import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity} from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import Messages from "@screens/Farmer/Message/UserChatlist";
import ChatMessaging from "@screens/Farmer/Message/UserChat";
import CoopDashboard from "@screens/Farmer/FarmerDashboard";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import {
  DrawerDesign,
  BackButton,
  MessageBackButton,
  ListContainer,
} from "@shared/DrawerDesign";
const Stack = createStackNavigator();

const Index = () => {
  const navigation = useNavigation();
  return (
    <>
    <Stack.Navigator initialRouteName="CoopDashboard">
      <Stack.Screen
        name="CoopDashboard"
        component={CoopDashboard}
        options={{
          header: (props) => <DrawerDesign {...props} title="Dashboard" />,
        }}
      />
      
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{
                 header: (props) => <DrawerDesign {...props} title="Message" />,
               }}
        
      />
    <Stack.Screen
        name="ChatMessaging"
        component={ChatMessaging}
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
    </Stack.Navigator>
      
         </>
  );
};

export default Index;
