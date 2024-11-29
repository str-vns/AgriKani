import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "@navigators/Home";
import UserFooter from "@screens/Others/UserFooter";
import RegisterScreen from "@navigators/SignInNavigators";
const Stack = createStackNavigator();

const Main = () => {
  return (<>
    <Stack.Navigator initialRouteName="Home" screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false}}/>
      
    </Stack.Navigator>
          <UserFooter />
          </>
  );
};

export default Main;