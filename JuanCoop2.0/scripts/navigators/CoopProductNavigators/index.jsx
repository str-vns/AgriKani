import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductsList from "@screens/Farmer/Product/ProductList";
import ProductsCreate from "@screens/Farmer/Product/ProductCreate";
import productEdit from "@screens/Farmer/Product/ProductUpdate";
import productArchive from "@screens/Farmer/Product/ProductArchive";
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
            headerShown: true,
            title:"Create Product",
            tabBarShowLabel: false,
          }}
        />
        <Stack.Screen
          name="productEdit"
          component={productEdit}
          options={{
            headerShown: true,
            title:"Update Product",
            tabBarShowLabel: false,
          }}
        />
        <Stack.Screen
          name="productArchive"
          component={productArchive}
          options={{
            
            headerShown:true,
            title:"Product Archive",
            headerBackTitleVisible: true,
        
          }}
        />
      
    </Stack.Navigator>
  );
};

export default Index;
