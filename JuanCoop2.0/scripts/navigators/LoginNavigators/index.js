import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import {
  NativeBaseProvider,
  Button,
  Box,
  HamburgerIcon,
  Pressable,
  Heading,
  VStack,
  Text,
  Center,
  HStack,
  Divider,
  Icon,
  Avatar,
} from "native-base";
import Register from "@src/screens/UserRegis/UserRegistration";
import Login from "@src/screens/UserRegis/UserSignIn";
import OTP from "@src/screens/UserRegis/UserOTP";

const Stack = createNativeStackNavigator();

const Index = () => {
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

export default Index;
