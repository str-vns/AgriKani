import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "@src/screens/UserRegis/UserRegistration";
import Login from "@src/screens/UserRegis/UserSignIn";
import OTP from "@src/screens/UserRegis/UserOTP";
import ForgotPass from "@src/screens/UserRegis/ForgotPass";
import Email from "@src/screens/UserRegis/Email";
import NewPassword from "@src/screens/UserRegis/NewPassword";
import { DrawerDesign, BackButton } from "@shared/DrawerDesign";
const Stack = createNativeStackNavigator();

const SignInNavigators = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          header: (props) => <BackButton {...props} title="Login" />,
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
      <Stack.Screen
        name="ForgotPass"
        component={ForgotPass}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      <Stack.Screen
        name="Email"
        component={Email}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      <Stack.Screen
        name="NewPassword"
        component={NewPassword}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default SignInNavigators;
