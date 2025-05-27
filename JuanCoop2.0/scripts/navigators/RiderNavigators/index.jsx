import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Deliveries from "@src/screens/Rider/Deliveries";
import Details from "@src/screens/Rider/Details";
import Location from "@src/screens/Rider/Location";
import Dropoff from "@src/screens/Rider/Dropoff";
import Completed from "@src/screens/Rider/HistoryCompleted";
import QrScan from "@src/screens/Rider/QrScan";
import RiderCancelled from "@src/screens/Cancelled/Rider_Cancelled";
import History from "@src/screens/Rider/History";
import HistoryDetails from "@src/screens/Rider/HistoryDetails";
import Messages from "@src/screens/Rider/Message/RiderChatlist";
import ChatMessaging from "@src/screens/Rider/Message/RiderChat";
import {
  BackButton,
  DrawerDesign,
  MessageBackButton,
} from "@shared/DrawerDesign";

const Stack = createNativeStackNavigator();

const RiderNavigators = () => {
  return (
    <Stack.Navigator initialRouteName="Deliveries">
      <Stack.Screen
        name="Deliveries"
        component={Deliveries}
        options={{
          header: (props) => (
            <DrawerDesign {...props} title={`Deliveries`} isDelivery={true} />
          ),
        }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{
          header: (props) => (
            <BackButton {...props} title={`Deliveries Details`} />
          ),
        }}
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
      <Stack.Screen
        name="History"
        component={History}
        options={{
          header: (props) => (
            <DrawerDesign {...props} title={`History`} />
          ),
        }}
      />
      <Stack.Screen
        name="HistoryDetails"
        component={HistoryDetails}
        options={{
          header: (props) => (
            <BackButton {...props} title={`History Details`} />
          ),
        }}
      />
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{
          header: (props) => <DrawerDesign {...props} title="Message" />,
        }}
      />
      <Stack.Screen
        name="ChatMessaging"
        component={ChatMessaging}
        options={({ route }) => ({
          header: (props) => (
            <MessageBackButton
              {...props}
              title="Message"
              item={route.params.item}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default RiderNavigators;
