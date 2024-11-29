import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "@src/screens/UserRegis/UserRegistration";
import Login from "@src/screens/UserRegis/UserSignIn";
import OTP from "@src/screens/UserRegis/UserOTP";
const Stack = createNativeStackNavigator();

const SignInNavigators = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      <Stack.Screen
        name="OTP"
        component={OTP}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default SignInNavigators;
