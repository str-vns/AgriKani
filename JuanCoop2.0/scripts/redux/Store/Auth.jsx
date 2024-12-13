import React, { useContext, useEffect, useReducer, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from '@redux/Reducers/Auth.reducers';
import { setCurrentUser } from '@redux/Actions/Auth.actions';
import AuthGlobal from '@redux/Store/AuthGlobal';

const Auth = (props) => {
  const [stateUser, dispatch] = useReducer(authReducer, {
    isAuthenticated: null,
    user: {},
    userProfile: null,
    isLoading: true,
  });

  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        const userInfo = await AsyncStorage.getItem('user');

        if (token && userInfo) {
          const decodedToken = jwtDecode(token);
          const parsedUserInfo = JSON.parse(userInfo);

          dispatch(setCurrentUser(decodedToken, parsedUserInfo));
        }

        setShowChild(true);
      } catch (error) {
        console.error('Error checking login status:', error);
        setShowChild(true);
      }
    };

    checkLoginStatus();
  }, [dispatch]);

  if (!showChild) {
    return null;
  } else {
    return (
      <AuthGlobal.Provider
        value={{
          stateUser,
          dispatch,
        }}
      >
        {props.children}
      </AuthGlobal.Provider>
    );
  }
};

export default Auth;