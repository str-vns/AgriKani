import axios from "axios";
import {
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  OTP_USER_FAIL,
  OTP_USER_REQUEST,
  OTP_USER_SUCCESS,
  USER_PROFILE_FAIL,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  EDIT_PROFILE_REQUEST,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_FAIL,
  WISH_USER_REQUEST,
  WISH_USER_SUCCESS,
  WISH_USER_FAIL,
  USER_MESSAGE_FAIL,
  USER_MESSAGE_REQUEST,
  USER_MESSAGE_SUCCESS,
  WISHLIST_FAIL,
  WISHLIST_REQUEST,
  WISHLIST_SUCCESS,
  GET_ALL_USERS_FAIL,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_SOFTDELETE_REQUEST,
  USER_SOFTDELETE_SUCCESS,
  USER_SOFTDELETE_FAIL,
  USER_RESTORE_REQUEST,
  USER_RESTORE_SUCCESS,
  USER_RESTORE_FAIL,
  CLEAR_ERRORS,
  CLEAR_REGISTER,
  COUNT_USER_REQUEST, 
  COUNT_USER_SUCCESS,
  COUNT_USER_FAIL,
  SAVE_USER_DEVICE_TOKEN_REQUEST,
  SAVE_USER_DEVICE_TOKEN_SUCCESS,
  SAVE_USER_DEVICE_TOKEN_FAIL,
  CHECK_EMAIL_REQUEST,
  CHECK_EMAIL_SUCCESS,
  CHECK_EMAIL_FAIL,
  OTP_FORGOT_PASSWORD_REQUEST,  
  OTP_FORGOT_PASSWORD_SUCCESS,
  OTP_FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
    
  GOOGLE_LOGIN_REQUEST, 
  GOOGLE_LOGIN_SUCCESS,
  GOOGLE_LOGIN_FAIL,
} from "../Constants/userConstants";
import baseURL from "@assets/commons/baseurl";
import Toast from "react-native-toast-message";
import mime from "mime";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCurrentUser } from "./Auth.actions";

export const registeruser = (userData) => async (dispatch) => {
  const regi = userData.registration
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    // formData.append("user", coop?.user);
    const formData = new FormData();
    const newImageUri = "file:///" + regi?.image.split("file:/").join("");
    formData.append("firstName", regi?.firstName);
    formData.append("lastName", regi?.lastName);
    formData.append("age", regi?.age);
    formData.append("email", regi?.email);
    formData.append("phoneNum", regi?.phoneNumber);
    formData.append("password", regi?.password);
    formData.append("gender", regi?.gender);
    formData.append("otp", userData.otp);
    formData.append("image",
      {
          uri: newImageUri,
          type: mime.getType(newImageUri),
          name: newImageUri.split("/").pop()
      })
 

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",  
      },
    };

    const { data } = await axios.post(`${baseURL}users`, formData, config);
    dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: {
        ...data.details,   
        password: regi?.password,  
      },
    });

    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Registration Successful",
      text2: "Please login to your account",
    });

  } catch (error) {
    const errorMessage = 
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({
      type: REGISTER_USER_FAIL,
      payload: errorMessage,
    });

    Toast.show({
      position: "bottom",
      bottomOffset: 20,
      type: "error",
      text1: "Something went wrong",
      text2: "Please try again",
    });

    console.log("Error from Register", errorMessage);
  }
};

export const OTPregister = (OtpData) => async (dispatch) => {
  try {
    dispatch({ type: OTP_USER_REQUEST });


    const { data } = await axios.post(`${baseURL}send-otp`, OtpData);

 
    dispatch({
      type: OTP_USER_SUCCESS,
      payload: data.user,
    });


    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "OTP Sent Successfully",
    });

  } catch (error) {
  
    console.error("Error from OTP:", error);


    dispatch({
      type: OTP_USER_FAIL,
      payload:
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    // Show error message
    Toast.show({
      position: "bottom",
      bottomOffset: 20,
      type: "error",
      text1: "Something went wrong",
      text2: "Please try again",
    });

    // Optional: log specific details
    console.log(
      "Error details:",
      error.response && error.response.data ? error.response.data : error.message
    );
  }
};

export const Profileuser = (userDataId, token) => async (dispatch) => {
   console.log("userDataId", userDataId);
  try {

    dispatch({ type: USER_PROFILE_REQUEST });
    
    const config = {
      headers: {
        "Authorization": `Bearer ${token}`,
    }
  }
    const { data } = await axios.get(`${baseURL}users/${userDataId}`, config);
    dispatch({
      type: USER_PROFILE_SUCCESS,
      payload: data.details,
    });
  } catch (error) {
    const errorMessage = 
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({
      type: USER_PROFILE_FAIL,
      payload: errorMessage,
    });

    console.log("Error from Profileuser", errorMessage);
  }
  
}

export const ProfileEdit = (userDataId, token, userData) => async (dispatch) => {
  
  console.log("userData", userData.image);
  try {
    dispatch({ type: EDIT_PROFILE_REQUEST });

    const formData = new FormData();
    formData.append("firstName", userData?.firstName);
    formData.append("lastName", userData?.lastName);
    formData.append("phoneNum", userData?.phoneNumber);
    formData.append("gender", userData?.gender);

    if (userData?.image) {
        const newImageUri = "file:///" + userData?.image.split("file:/").join("");
        formData.append("image", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop(),
        });
    }

    const config = {
        headers: {
            Accept: "multipart/form-data",
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        },
        timeout: 10000,
    };

    const { data } = await axios.put(`${baseURL}users/${userDataId}`, formData, config);


    dispatch({
        type: EDIT_PROFILE_SUCCESS,
        payload: data.details,
    });
    
    const userInfo = data.details.user;
    const TokiToken = data.details.accessToken;
    console.log("User Info:", userInfo);
    await AsyncStorage.setItem("user", JSON.stringify(userInfo));
    await AsyncStorage.setItem("jwt", TokiToken);
    const decoded = token;
    
    dispatch(setCurrentUser(decoded, userInfo ));
 
    Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Profile Updated Successfully",
    });

} catch (error) {
    console.error("Error updating profile:", error);
    dispatch({
        type: EDIT_PROFILE_FAIL,
        payload: error.response ? error.response.data : { message: error.message },
    });

    Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Profile Update Failed",
        text2: error.response ? error.response.data.message : error.message,
    });
}
};

export const WishlistUser = (productId, userId, token) => async (dispatch) => {

  try {
    dispatch({ type: WISH_USER_REQUEST });
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${baseURL}wish/users/${productId}/${userId}`, config);
  

    dispatch({
      type: WISH_USER_SUCCESS,
      payload: data.details, 
    });
  } catch (error) {
    // Handle error messages
    const errorMessage =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    // Dispatch the fail action
    dispatch({
      type: WISH_USER_FAIL,
      payload: errorMessage,
    });

    console.log("Error from WishlistUser:", errorMessage);
  }
};

export const getWishlist = (userId, token) => async (dispatch) => {
  try {
    dispatch({ type: WISHLIST_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${baseURL}wish/${userId}`, config);

    dispatch({
      type: WISHLIST_SUCCESS,
      payload: data.details,
    });
  } catch (error) {
    const errorMessage =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({
      type: WISHLIST_FAIL,
      payload: errorMessage,
    });

    console.log("Error from getWishlist", errorMessage);
  }
}

export const getUsers = (userIds, token) => async (dispatch) => {
  try {
    dispatch({ type: USER_MESSAGE_REQUEST });

    const userRequests = userIds.map((userId) =>
      axios.get(`${baseURL}user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      })
    );


    const responses = await Promise.all(userRequests);
    const users = responses.map((response) => response.data); 

    dispatch({
      type: USER_MESSAGE_SUCCESS,
      payload: users,  
    });
  } catch (error) {
    const errorMessage =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({
      type: USER_MESSAGE_FAIL,
      payload: errorMessage,
    });

    console.log("Error from getUsers", errorMessage); 
  }
};

export const getAllUsers = (token) => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_USERS_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${baseURL}users`, config);

    dispatch({
      type: GET_ALL_USERS_SUCCESS,
      payload: data.details,
    });
  } catch (error) {
    const errorMessage =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({
      type: GET_ALL_USERS_FAIL,
      payload: errorMessage,
    });

    console.log("Error from getAllUsers", errorMessage);
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });

    // Use DELETE method for hard delete (adjust endpoint as necessary)
    await axios.delete(`${baseURL}users/${id}`);

    dispatch({
      type: USER_DELETE_SUCCESS,
      payload: id, // ID of the deleted user
    });
    return Promise.resolve(); // Indicate success
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload: error.response ? error.response.data : error.message,
    });
    return Promise.reject(error); // Indicate failure
  }
};

export const softDeleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_SOFTDELETE_REQUEST });

    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem('jwt');
    if (!token) {
      // If no token, dispatch an error action and return
      dispatch({
        type: USER_SOFTDELETE_FAIL,
        payload: 'Please log in first.',
      });
      return;
    }

    // Make the request with the token in the headers
    const response = await axios.patch(
      `${baseURL}users/${id}`,
      {}, // You might need to pass data depending on the API
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token here
        },
      }
    );

    dispatch({
      type: USER_SOFTDELETE_SUCCESS,
      payload: id, // ID of the soft-deleted user
    });
  } catch (error) {
    dispatch({
      type: USER_SOFTDELETE_FAIL,
      payload: error.response ? error.response.data : error.message,
    });
  }
};

export const restoreUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_RESTORE_REQUEST });

    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem('jwt');
    if (!token) {
      dispatch({
        type: USER_RESTORE_FAIL,
        payload: 'Please log in first.',
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.patch(`${baseURL}restore/users/${id}`, {}, config);

    dispatch({
      type: USER_RESTORE_SUCCESS,
      payload: id,
    });
  } catch (error) {
    dispatch({
      type: USER_RESTORE_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const countUsers = (token) => async (dispatch) => {
  try {
    dispatch({ type: COUNT_USER_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${baseURL}users/count`, config);  // Endpoint should return user count

    dispatch({
      type: COUNT_USER_SUCCESS,
      payload: data.count,  
    });

    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "User count fetched successfully",
    });
  } catch (error) {
    const errorMessage =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({
      type: COUNT_USER_FAIL,
      payload: errorMessage,
    });

    Toast.show({
      position: "bottom",
      bottomOffset: 20,
      type: "error",
      text1: "Something went wrong",
      text2: "Please try again",
    });

    console.log("Error from countUsers", errorMessage);
  }
};

export const saveDeviceToken = (saveDtoken) => async (dispatch) => {

  try {
    dispatch({ type: SAVE_USER_DEVICE_TOKEN_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log("Device Token:", saveDtoken);

    const { data } = await axios.post(`${baseURL}deviceToken`, saveDtoken, config);
    console.log("API Response:", data);

    dispatch({
      type: SAVE_USER_DEVICE_TOKEN_SUCCESS,
      payload: data.details || "No details available", 
    });
  } catch (error) {
    console.error("Error from saveDeviceToken:", error);

    dispatch({
      type: SAVE_USER_DEVICE_TOKEN_FAIL,
      payload: error.response && error.response.data
        ? error.response.data.message
        : error.message,
    });
  }
};

export const checkEmail = (email) => async (dispatch) => {

  try {

    dispatch({ type: CHECK_EMAIL_REQUEST });

    const { data } = await axios.post(`${baseURL}check-email`, email);
    console.log("Data from checkEmail:", data);
    dispatch({
      type: CHECK_EMAIL_SUCCESS,
      payload: data.details,
    });
  }
  catch (error)  {
    console.log("Error from checkEmail:", error);
    dispatch({
      type: CHECK_EMAIL_FAIL,
      payload: error.response && error.response.data
        ? error.response.data.details.message
        : error.message,
    });
  }
};

export const otpForgotPassword = (email) => async (dispatch) => {
 
  try {
    dispatch({ type: OTP_FORGOT_PASSWORD_REQUEST });

    const { data } = await axios.post(`${baseURL}otp-forgot-password`, email);
    dispatch({
      type: OTP_FORGOT_PASSWORD_SUCCESS,
      payload: data,
    });
    
  } catch (error) {
    console.log("Error from otpForgotPassword:", error.message);
    dispatch({
      type: OTP_FORGOT_PASSWORD_FAIL,
      payload: error.response && error.response.data
        ? error.response.data.message
        : error.message,
    });
  }
}

export const resetPassword = (passwordData) => async (dispatch) => {
  console.log("Password Data", passwordData)
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const { data } = await axios.post(`${baseURL}reset-password`, passwordData);
    console.log("Data from resetPassword:", data);
    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: data.details,
    });
  }
  catch (error) {
    console.log("Error from resetPassword:", error.message);
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error.response && error.response.data
        ? error.response.data.message
        : error.message,
    });
  }
}

export const clearRegister = () => async (dispatch) => {
  dispatch({
    type: CLEAR_REGISTER,
  });
};

export const clearErrors = () => async (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS

	})
}


