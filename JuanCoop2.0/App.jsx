import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { SocketProvider } from "./SocketIo";
import "react-native-gesture-handler";
import Auth from "@redux/Store/Auth";
import { Provider } from "react-redux";
import store from "@redux/store";
import DrawerNavi from "@navigators/DrawerNavigators";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
  const [appReady, setAppReady] = useState(false);

  if (!appReady) {
    setAppReady(true);
    SplashScreen.hide();
  }
  
  return (
    <Auth>
      <SocketProvider>
          <Provider store={store}>
            <NativeBaseProvider>
              <NavigationContainer>
                <DrawerNavi />
                {/* <Main /> */}
              </NavigationContainer>
            </NativeBaseProvider>
          </Provider>
      </SocketProvider>
    </Auth>
  );
}
