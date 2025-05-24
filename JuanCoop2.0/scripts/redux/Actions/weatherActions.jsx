import {
  WEATHER_DAILY_REQUEST,
  WEATHER_DAILY_SUCCESS,
  WEATHER_DAILY_FAIL,
  WEATHER_CURRENT_SUCCESS,
  WEATHER_CURRENT_REQUEST,
  WEATHER_CURRENT_FAIL,
  CLEAR_ERRORS,
} from "../Constants/weatherConstants";
import axios from "axios";
import baseURL from "@assets/commons/baseurl";

export const weatherDailyActions = () => async (dispatch) => {
  try {
    dispatch({ type: WEATHER_DAILY_REQUEST });

    const { data } = await axios.get(`${baseURL}daily/weather`);

    dispatch({
      type: WEATHER_DAILY_SUCCESS,
      payload: data.details,
    });
  } catch (error) {
    dispatch({
      type: WEATHER_DAILY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const weatherCurrentActions = () => async (dispatch) => {
  try {
    dispatch({ type: WEATHER_CURRENT_REQUEST });

    const { data } = await axios.get(`${baseURL}current/weather`);

    dispatch({
      type: WEATHER_CURRENT_SUCCESS,
      payload: data.details,
    });
  } catch (error) {
    dispatch({
      type: WEATHER_CURRENT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
