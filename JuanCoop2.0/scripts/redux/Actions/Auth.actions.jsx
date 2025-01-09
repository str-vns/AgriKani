import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import Toast from "react-native-toast-message";
import baseURL from "@assets/commons/baseurl";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const SET_CURRENT_USER = "SET_CURRENT_USER"
export const SET_LOGOUT_USER = "SET_LOGOUT_USER"

export const loginUser = async (user, dispatch) => {

    try {
        const response = await fetch(`${baseURL}signin`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error('Your email or password is incorrect. Please try again.');
           
        }

        const data = await response.json();

        if (data && data.details) {
            const token = data.details.accessToken;
            const userInfo = data.details.user;

            await AsyncStorage.setItem("jwt", token);
            await AsyncStorage.setItem("user", JSON.stringify(userInfo));

            const decoded = jwtDecode(token);

            dispatch(setCurrentUser(decoded, userInfo ));

            console.log("User loaded successfully:", data);
            
        } else {
            logoutUser(dispatch);
        }
    } catch (err) {
        console.error('Login error:', err);
        
        dispatch(setCurrentUser({}, err.message));
  
    }
};

export const getUserProfile = (id) => {
    fetch(`${baseURL}users/${id}`, {
        method: "GET",
        body: JSON.stringify(user),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
    })
    .then((res) => res.json())
    // .then((data) => console.log(data));
}

export const logoutUser = async (dispatch) => {
    try {
        AsyncStorage.removeItem("jwt");
        AsyncStorage.removeItem("user")
        await AsyncStorage.clear();
        console.log('AsyncStorage data cleared successfully.');
        dispatch(setLogoutUser())
    } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
    }
};

export const setCurrentUser = (decoded, userInfo) => { 
    return {
        type: SET_CURRENT_USER,
        payload: decoded,
        userProfile: userInfo,
        isLoginUser: true,
        isguest: false,
        isLoading: false,
    };
};

export const setLogoutUser = () => {
    return {
        type: SET_LOGOUT_USER,
        payload: {},
        userProfile: {},
        isLoginUser: false,
        isguest: true,
        isLoading: false,
    };
}

export const isLogin = async (dispatch) => {
    try {
        const jwt = await AsyncStorage.getItem("jwt");
        const user =   await AsyncStorage.getItem("user");
  
        if (jwt) {
            const userInfo = JSON.parse(user);
            const decoded = jwtDecode(jwt);

            dispatch(setCurrentUser(decoded, userInfo));
        }
    } catch (error) {
        console.error("Error retrieving JWT:", error);
    }
}