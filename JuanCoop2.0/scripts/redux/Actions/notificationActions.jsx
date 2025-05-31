import {
  CREATE_NOTIFICATION_REQUEST,
  CREATE_NOTIFICATION_FAIL,
  CREATE_NOTIFICATION_SUCCESS,
  SINGLE_NOTIFICATION_FAIL,
  SINGLE_NOTIFICATION_REQUEST,
  SINGLE_NOTIFICATION_SUCCESS,
  NOTIFICATION_ALL_READ_FAIL,
  NOTIFICATION_ALL_READ_REQUEST,
  NOTIFICATION_ALL_READ_SUCCESS,
  NOTIFICATION_READ_FAIL,
  NOTIFICATION_READ_REQUEST,
  NOTIFICATION_READ_SUCCESS,
} from "../Constants/notificationConstants";
import axios from "axios";
import baseURL from "@assets/commons/baseurl";

export const sendNotifications = (notification, token) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_NOTIFICATION_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${baseURL}notification`,
      notification,
      config
    );

    dispatch({ type: CREATE_NOTIFICATION_SUCCESS, payload: data.details });
  } catch (error) {
    dispatch({
      type: CREATE_NOTIFICATION_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const singleNotification = (notificationId, token) => async (dispatch) => {
    try {
      dispatch({ type: SINGLE_NOTIFICATION_REQUEST });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${baseURL}notification/${notificationId}`,
        config
      );

      dispatch({ type: SINGLE_NOTIFICATION_SUCCESS, payload: data.details });
    } catch (error) {
      dispatch({
        type: SINGLE_NOTIFICATION_FAIL,
        payload: error.response ? error.response.data.message : error.message,
      });
    }
  };

export const readNotification = (notificationId, token) => async (dispatch) => {
  try {
    dispatch({ type: NOTIFICATION_READ_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.patch(
      `${baseURL}notification/read/${notificationId}`,
      config
    );

    dispatch({ type: NOTIFICATION_READ_SUCCESS, payload: data.details });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_READ_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
}

export const readAllNotifications = (userId, token) => async ( dispatch) => {
  try {
    dispatch({ type: NOTIFICATION_ALL_READ_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.patch(`${baseURL}notification/read/all/${userId}`, config);

    dispatch({ type: NOTIFICATION_ALL_READ_SUCCESS, payload: data.details });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_ALL_READ_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
}
