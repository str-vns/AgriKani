import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity} from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import Messages from "@screens/Farmer/Message/UserChatlist";
import ChatMessaging from "@screens/Farmer/Message/UserChat";
import CoopDashboard from "@screens/Farmer/FarmerDashboard";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
const Stack = createStackNavigator();

const Index = () => {
  const navigation = useNavigation();
  return (
    <>
    <Stack.Navigator>
    <Stack.Screen
        name="CoopDashboard"
        component={CoopDashboard}
        options={{ headerShown: false, tabBarShowLabel: false }}
      />
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{ headerShown: false }}
      />
    <Stack.Screen
        name="ChatMessaging"
        component={ChatMessaging}
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
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate("Messaging", { screen: "Messages" })}>
                <Ionicons name="arrow-back" size={24} color="black" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          };
        }}
      />
    </Stack.Navigator>
      
         </>
  );
};

export default Index;
