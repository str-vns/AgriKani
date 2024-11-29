import {
    GET_DAILY_SALES_REQUEST,
    GET_DAILY_SALES_SUCCESS,
    GET_DAILY_SALES_FAIL,
    GET_WEEKLY_SALES_REQUEST,
    GET_WEEKLY_SALES_SUCCESS,
    GET_WEEKLY_SALES_FAIL,
    GET_MONTHLY_SALES_REQUEST,
    GET_MONTHLY_SALES_SUCCESS,
    GET_MONTHLY_SALES_FAIL,
    SALES_ERROR,
  } from "@redux/Constants/salesConstants";
  import axios from "axios";
  import baseURL from "@assets/commons/baseurl";
  
  // Action for fetching daily sales
  export const getDailySales = () => async (dispatch) => {
    try {
      dispatch({ type: GET_DAILY_SALES_REQUEST });
  
      const { data } = await axios.get(`${baseURL}order/daily`);
  
      dispatch({
        type: GET_DAILY_SALES_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
  
      dispatch({
        type: GET_DAILY_SALES_FAIL,
        payload: errorMessage,
      });
  
      console.log("Error from getDailySales:", errorMessage);
    }
  };
  
  // Action for fetching weekly sales
  export const getWeeklySales = () => async (dispatch) => {
    try {
      dispatch({ type: GET_WEEKLY_SALES_REQUEST });
  
      const { data } = await axios.get(`${baseURL}order/weekly`);
  
      dispatch({
        type: GET_WEEKLY_SALES_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
  
      dispatch({
        type: GET_WEEKLY_SALES_FAIL,
        payload: errorMessage,
      });
  
      console.log("Error from getWeeklySales:", errorMessage);
    }
  };
  
  // Action for fetching monthly sales
  export const getMonthlySales = () => async (dispatch) => {
    try {
      dispatch({ type: GET_MONTHLY_SALES_REQUEST });
  
      const { data } = await axios.get(`${baseURL}order/monthly`);
  
      dispatch({
        type: GET_MONTHLY_SALES_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
  
      dispatch({
        type: GET_MONTHLY_SALES_FAIL,
        payload: errorMessage,
      });
  
      console.log("Error from getMonthlySales:", errorMessage);
    }
  };
  
  // Global sales error action (for handling unexpected errors)
  export const salesError = (error) => {
    return {
      type: SALES_ERROR,
      payload: error,
    };
  };
  