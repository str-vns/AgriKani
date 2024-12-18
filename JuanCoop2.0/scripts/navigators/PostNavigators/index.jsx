import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserPostList from "@src/screens/Post/UserPostList";
import UserPostScreen from "@src/screens/Post/UserPostScreen";
import PostList from "@src/screens/admin/Post/postList";
import CommunityForum from "@src/screens/Post/CommunityForum";
const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <Stack.Navigator>
       <Stack.Screen
        name="UserPostList"
        component={UserPostList}
        options={{ headerShown: true }}
      />
       <Stack.Screen
        name="PostList"
        component={PostList}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="UserPostScreen"
        component={UserPostScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="CommunityForum"
        component={CommunityForum}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Index;
