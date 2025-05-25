import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserPostList from "@src/screens/Post/UserPostList";
import UserPostScreen from "@src/screens/Post/UserPostScreen";
import PostList from "@src/screens/admin/Post/postList";
import CommunityForum from "@src/screens/Post/CommunityForum";
import { DrawerDesign, BackButton } from "@shared/DrawerDesign";
const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <Stack.Navigator>
      
       <Stack.Screen
        name="UserPostList"
        component={UserPostList}
        options={{ headerShown: true , title:"Your Post"}}
      />
       <Stack.Screen
        name="PostList"
        component={PostList}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="UserPostScreen"
        component={UserPostScreen}
        options={{ headerShown: true,title:"Create Post" }}
      />
      <Stack.Screen
        name="CommunityForum"
        component={CommunityForum}
        options={{ header: (props) => <DrawerDesign {...props} title="Discussion Board" />, }}
        
      />
    </Stack.Navigator>
  );
};

export default Index;
