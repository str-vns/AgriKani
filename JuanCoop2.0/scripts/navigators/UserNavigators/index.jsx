import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "@screens/User/UserProfile";
import EditProfile from "@screens/User/UserEditProfile";
import CoopRegistration from "@screens/Farmer/Registration/FarmRegistration";
import UserOrderList from "@screens/User/UserOrderList";
import ProfileCoop from "@screens/UserRegis/UserCoopRegistration";
import EditFarm from "@screens/Farmer/FarmEdit";
import AddReviews from "@screens/Review/UserAddReview";
import Requirements from "@screens/Farmer/Registration/RequirementsRegistration";
import MembersRegistration from "@screens/UserRegis/MemberRegistration";
import UserTracking from "@screens/User/UserTracking";
import QrGenerate from "@screens/User/QrGenerate";
import ClientCancelled from "@screens/Cancelled/Client_Cancelled";
import MemberList from "@screens/UserRegis/MemberList";
import CoopFarmProfile from "@screens/Farmer/FarmerProfile";
const Stack = createNativeStackNavigator();

const UserNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />

      <Stack.Screen
        name="ProfileCoop"
        component={ProfileCoop}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />

      <Stack.Screen
        name="CoopRegistration"
        component={CoopRegistration}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      <Stack.Screen
        name="Requirements"
        component={Requirements}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      < Stack.Screen
        name="MemberList"
        component={MemberList}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
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
        name="MembersRegistration"
        component={MembersRegistration}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      
      <Stack.Screen
        name="EditFarm"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
        component={EditFarm}
      />

      <Stack.Screen
        name="UserOrderList"
        component={UserOrderList}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="AddReviews"
        component={AddReviews}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="UserTracking"
        component={UserTracking}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="QrGenerate"
        component={QrGenerate}
        options={{
          headerShown: false,
        }}
      />
      < Stack.Screen
        name="Client_Cancelled"
        component={ClientCancelled}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default UserNavigation;
