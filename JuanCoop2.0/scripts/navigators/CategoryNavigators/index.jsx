import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CategoryList from '@screens/admin/Category/CategoryList';
import CategoryUpdate from '@screens/admin/Category/CategoryUpdate';
import CategoryCreate from '@screens/admin/Category/CategoryCreate';
const Stack = createNativeStackNavigator()

const Index = () => {
  return (
    <div>
      <Stack.Screen
          name="CategoryList"
          options={{
            headerShown: true,
            tabBarShowLabel: false,
          }}
          component={CategoryList}
        />
        <Stack.Screen
          name="CategoryCreate"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
          component={CategoryCreate}
        />
        <Stack.Screen
          name="CategoryUpdate"
          options={{
            headerShown: true,
            tabBarShowLabel: true,
          }}
          component={CategoryUpdate}
        />
    </div>
  )
}

export default Index
