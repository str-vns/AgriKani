import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductsList from "@screens/Farmer/Product/ProductList";
import ProductsCreate from "@screens/Farmer/Product/ProductCreate";
import productEdit from "@screens/Farmer/Product/ProductUpdate";
import productArchive from "@screens/Farmer/Product/ProductArchive";
import inventoryCreate from "@screens/Farmer/Inventory/InventoryCreate";
import inventoryUpdate from "@screens/Farmer/Inventory/InventoryUpdate";

const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <Stack.Navigator>
       <Stack.Screen
          name="ProductsList"
          component={ProductsList}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Stack.Screen
          name="ProductsCreate"
          component={ProductsCreate}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Stack.Screen
          name="productEdit"
          component={productEdit}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Stack.Screen
          name="productArchive"
          component={productArchive}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Stack.Screen
          name="inventoryCreate"
          component={inventoryCreate}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
        <Stack.Screen
          name="inventoryUpdate"
          component={inventoryUpdate}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
          }}
        />
    </Stack.Navigator>
  );
};

export default Index;
