import {
    CONVERSATION_LIST_FAIL,
    CONVERSATION_LIST_SUCCESS,
    CONVERSATION_LIST_REQUEST,
    NEW_CONVETION_FAIL,
    NEW_CONVETION_SUCCESS,
    NEW_CONVETION_REQUEST,
  } from "../Constants/conversationConstants";
  import axios from "axios";
  import baseURL from "@assets/commons/baseurl";
  
  
  export const conversationList = (userId, token) => async (dispatch) => {
    try {
      dispatch({ type: CONVERSATION_LIST_REQUEST });
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const { data } = await axios.get(`${baseURL}t/${userId}`, config);
      dispatch({
        type: CONVERSATION_LIST_SUCCESS,
        payload: data.details,
      });

      return data.details;
    } catch (error) {
      dispatch({
        type: CONVERSATION_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const createConversation = (convProf, token) => async (dispatch) => {
      try {
          dispatch({ type: NEW_CONVETION_REQUEST });
  
          const config = {
              headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
              },
  
          };
  
          const { data } = await axios.post(`${baseURL}t`, convProf, config);
  
          if (data.success) {
              dispatch({
                  type: NEW_CONVETION_SUCCESS,
                  payload: data.details,
              });
              return { success: true, conversation: data.details };
          } else {
              dispatch({
                  type: NEW_CONVETION_FAIL,
                  payload: data.message || "Error creating conversation",
              });
              return { success: false, error: data.message || "Error creating conversation" };
          }
      } catch (error) {
          dispatch({
              type: NEW_CONVETION_FAIL,
              payload: error.response?.data?.message || error.message,
          });
  
          return {
              success: false,
              error: error.response?.data?.message || error.message,
          };
      }
  };