import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Start from "@src/screens/Rider/Start";
import Deliveries from "@src/screens/Rider/Deliveries";
import Details from "@src/screens/Rider/Details";
import Location from "@src/screens/Rider/Location";
import Dropoff from "@src/screens/Rider/Dropoff";
import Completed from "@src/screens/Rider/HistoryCompleted";
import QrScan from "@src/screens/Rider/QrScan";
import RiderCancelled from "@src/screens/Cancelled/Rider_Cancelled"
import CoopDashboard from "@screens/Farmer/FarmerDashboard";
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
      <Stack.Screen
        name="Rider_Cancelled"
        component={RiderCancelled}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default RiderNavigators;
