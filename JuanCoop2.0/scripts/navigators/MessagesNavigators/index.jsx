import React, { useState } from "react";
import { View, Text, Image} from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import Messages from "@screens/Message/UserChatlist";
import ChatMessages from "@screens/Message/UserChat";
import CoopDashboard from "@screens/Farmer/FarmerDashboard";
const Stack = createStackNavigator();

const Index = () => {
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
    </Stack.Navigator>
      
         </>
  );
};

export default Index;
