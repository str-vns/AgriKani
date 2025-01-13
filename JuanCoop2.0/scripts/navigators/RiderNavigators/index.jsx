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
import Completed from "@src/screens/Rider/HistoryCompleted";
import QrScan from "@src/screens/Rider/QrScan";
import RiderDetails from "@src/screens/Rider/RiderDetails";
import AssignLocation from "@src/screens/Rider/RiderAssignLoc";
import MaxCapacity from "@src/screens/Rider/RiderCapacity";
// Coop part for rider
import Register from "@src/screens/Rider/Register";
import Otp from "@src/screens/Rider/Otp";

const Stack = createNativeStackNavigator();

const RiderNavigators = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Deliveries"
        component={Deliveries}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Location"
        component={Location}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dropoff"
        component={Dropoff}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Riderlist"
        component={Riderlist}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name= "RiderDetails"
        component={RiderDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AssignLocation"
        component={AssignLocation}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MaxCapacity"
        component={MaxCapacity}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen
        name="Assign"
        component={Assign}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
        <Stack.Screen
        name="OtpRider"
        component={Otp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Completed"
        component={Completed}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QrScan"
        component={QrScan}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default RiderNavigators;
