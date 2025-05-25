import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductsList from "@screens/Farmer/Product/ProductList";
import ProductsCreate from "@screens/Farmer/Product/ProductCreate";
import productEdit from "@screens/Farmer/Product/ProductUpdate";
import productArchive from "@screens/Farmer/Product/ProductArchive";
import {
  DrawerDesign,
  BackButton,
  ListContainer,
} from "@shared/DrawerDesign";
const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <Stack.Navigator initialRouteName="ProductsList">
       <Stack.Screen
          name="ProductsList"
          component={ProductsList}
          options={{ header: (props) => <ListContainer {...props} title="Product List" isCreate={true} isScreen={"Product"}/> }}
        />
        <Stack.Screen
          name="ProductsCreate"
          component={ProductsCreate}
          options={{
          header: (props) => <BackButton {...props} title="Create Product" />
          }}
        />
        <Stack.Screen
          name="productEdit"
          component={productEdit}
          options={{
            header: (props) => <BackButton {...props} title="Update Product" />
          }}
        />
        <Stack.Screen
          name="productArchive"
          component={productArchive}
          options={{
            header: (props) => <DrawerDesign {...props} title="Product Archive" />
        
          }}
        />
      
    </Stack.Navigator>
  );
};

export default Index;
