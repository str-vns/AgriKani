import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native'; // Use View instead of div
// import BlogLists from '@screens/Farmer/Blog/BlogList';
import BlogList from '@screens/Farmer/Blog/BlogList';
import BlogCards from '@screens/Farmer/Blog/BlogCard';

const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <View style={{ flex: 1 }}> 
      <Stack.Screen
        name="BlogList"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
        component={BlogList}
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
