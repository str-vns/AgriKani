import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Start from "@src/screens/Rider/Start";
import Deliveries from "@src/screens/Rider/Deliveries";
import Details from "@src/screens/Rider/Details";
import Location from "@src/screens/Rider/Location";
import Dropoff from "@src/screens/Rider/Dropoff";
import Riderlist from "@src/screens/Rider/Riderlist";
import History from "@src/screens/Rider/History";
import Assign from "@src/screens/Rider/Assign";

// Coop part for rider
import Register from "@src/screens/Rider/Register";
import Otp from "@src/screens/Rider/Otp";

const Stack = createNativeStackNavigator();

const RiderNavigators = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Start"
        component={Start}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Deliveries"
        component={Deliveries}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Location"
        component={Location}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Dropoff"
        component={Dropoff}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Riderlist"
        component={Riderlist}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Assign"
        component={Assign}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: true }}
      />
        <Stack.Screen
        name="Otp"
        component={Otp}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default RiderNavigators;
