import {
  TYPE_LIST_FAIL,
  TYPE_LIST_REQUEST,
  TYPE_LIST_SUCCESS,
  TYPE_CREATE_REQUEST,
  TYPE_CREATE_SUCCESS,
  TYPE_CREATE_FAIL,
  TYPE_DELETE_REQUEST,
  TYPE_DELETE_SUCCESS,
  TYPE_DELETE_FAIL,
  TYPE_UPDATE_REQUEST,
  TYPE_UPDATE_SUCCESS,
  TYPE_UPDATE_FAIL,
} from "../Constants/typeConstants";
import axios from "axios";
import baseURL from "@assets/commons/baseurl";

export const typeList = () => async (dispatch) => {
  try {
    dispatch({ type: TYPE_LIST_REQUEST });

    const { data } = await axios.get(`${baseURL}type`);

    dispatch({
      type: TYPE_LIST_SUCCESS,
      payload: data.details,
    });
  } catch (error) {
    dispatch({
      type: TYPE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const typeCreate = (typeData, token) => async (dispatch) => {
  try {
    dispatch({ type: TYPE_CREATE_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${baseURL}type`, typeData, config);

    console.log("API Response data:", data); // Log the response data to check if the backend is returning the correct data

    dispatch({
      type: TYPE_CREATE_SUCCESS,
      payload: data, // Ensure the correct data is returned here
    });
  } catch (error) {
    dispatch({
      type: TYPE_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const typeDelete = (typeId, token) => async (dispatch) => {
  try {
    dispatch({ type: TYPE_DELETE_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`${baseURL}type/${typeId}`, config);

    dispatch({
      type: TYPE_DELETE_SUCCESS,
      payload: typeId,
    });
  } catch (error) {
    const errorMessage =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({
      type: TYPE_DELETE_FAIL,
      payload: errorMessage,
    });

    console.log("Error from deleteType:", errorMessage);
  }
};

export const typeUpdate = (typeId, updatedData, token) => async (dispatch) => {
    try {
      // Dispatch request action to indicate the update process has started
      dispatch({ type: TYPE_UPDATE_REQUEST });
  
      // Set up the config for the PUT request with Authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      // Send the PUT request to the backend to update the type
      const response = await axios.put(
        `${baseURL}type/${typeId}`,
        updatedData,
        config
      );
  
      // Dispatch success action with updated type data in payload
      dispatch({
        type: TYPE_UPDATE_SUCCESS,
        payload: response.data, // Assuming the backend returns the updated type
      });
    } catch (error) {
      // Handle errors and determine the error message to show
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
  
      // Dispatch failure action with error message
      dispatch({
        type: TYPE_UPDATE_FAIL,
        payload: errorMessage,
      });
  
      // Log the error for debugging
      console.log('Error from typeUpdate:', errorMessage);
    }
};