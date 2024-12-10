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
import { StatusBar } from 'expo-status-bar';
import messaging from '@react-native-firebase/messaging';

export default function App() {
  const ONE_MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000
  
  const checkSessionValidity = async () => {
    const storedTimestamp = await AsyncStorage.getItem('lastLoginTimestamp');
    if (storedTimestamp) {
      const lastLoginTime = parseInt(storedTimestamp, 10);
      const currentTime = Date.now();
      const timeElapsed = currentTime - lastLoginTime;

      if (timeElapsed > ONE_MONTH_IN_MS) {
        await AsyncStorage.clear();
        Alert.alert('Session expired. Please log in again.');
      }
    }
  };

  useEffect(() => {
    checkSessionValidity();
  }, []);

    // useEffect(() => {
    //   clearAsyncStorage();
    // }, []);
  
    // const clearAsyncStorage = async () => {
    //   try {
    //     await AsyncStorage.clear();
    //     console.log('AsyncStorage data cleared successfully.');
    //   } catch (error) {
    //     console.error('Error clearing AsyncStorage:', error);
    //   }
    // };

    const requestUserPermission = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        
        if (enabled) {
          console.log("Authorization status:", authStatus);
        } else {
          console.log("Permission not granted");
        }
        return enabled;
      } catch (error) {
        console.error("Error requesting permission:", error);
        return false;
      }
    };
  
    useEffect(() => {
      const initializeFCM = async () => {
        const permissionGranted = await requestUserPermission();
        if (permissionGranted) {
          try {
            const FCMtoken = await messaging().getToken();
            console.log("FCM Token:", FCMtoken);
          } catch (error) {
            console.error("Error getting FCM token:", error);
          }
        } else {
          console.log("No permission granted");
        }
  
        // Handle notifications when the app is opened from a quit state
        messaging()
          .getInitialNotification()
          .then((remoteMessage) => {
            if (remoteMessage) {
              console.log("Notification caused app to open from quit state:", remoteMessage.notification);
            }
          });
  
        // Handle notifications when the app is opened from the background
        const unsubscribeOnOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
          console.log("Notification caused app to open from background state:", remoteMessage.notification);
        });
  
        // Handle background notifications
        const unsubscribeBackground = messaging().setBackgroundMessageHandler(async (remoteMessage) => {
          console.log("Message handled in the background:", remoteMessage);
        });
  
        // Handle foreground notifications
        const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
          Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
        });
  
        // Cleanup the subscriptions on unmount
        return () => {
          unsubscribeOnOpened();
          unsubscribeBackground();
          unsubscribeOnMessage();
        };
      };
  
      initializeFCM();
    }, []); 
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
