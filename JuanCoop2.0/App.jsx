import React, { useEffect, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NativeBaseProvider } from "native-base";
import { SocketProvider } from './SocketIo'; 
import 'react-native-gesture-handler';
import Auth from "@redux/Store/Auth"
import { Provider } from 'react-redux';
import store from '@redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DrawerNavi from "@navigators/DrawerNavigators"

export default function App() {
  
    useEffect(() => {
      clearAsyncStorage();
    }, []);
  
    const clearAsyncStorage = async () => {
      try {
        await AsyncStorage.clear();
        console.log('AsyncStorage data cleared successfully.');
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }
    };

    
  return (
    
    <Auth>
      <SocketProvider>
      <Provider store={store}>
        <NativeBaseProvider>
          <NavigationContainer>
            <DrawerNavi/>
            {/* <Main /> */}
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
      </SocketProvider>
  </Auth>
  );
}
