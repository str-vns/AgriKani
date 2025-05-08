import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native'; // Use View instead of div
// import BlogLists from '@screens/Farmer/Blog/BlogList';
import BlogListCoop from '@screens/Farmer/Blog/BlogListCoop';
import BlogCards from '@screens/Farmer/Blog/BlogCards';

const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <View style={{ flex: 1 }}> 
      <Stack.Screen
        name="BlogListCoop"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
        component={BlogListCoop}
      />
      <Stack.Screen
        name="BlogCards"
        component={BlogCards}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
    </View>
  );
};

export default Index;
