import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BlogLists from "@screens/Farmer/Blog/BlogList";
import BlogCards from "@screens/Farmer/Blog/BlogCard";
const Stack = createNativeStackNavigator()

const Index = () => {
  return (
    <div>
      <Stack.Screen
          name="BlogLists"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={BlogLists}
        />

        <Stack.Screen
          name="BlogCards"
          component={BlogCards}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
    </div>
  )
}

export default Index
