import {
    MESSAGE_LIST_FAIL,
    MESSAGE_LIST_REQUEST,
    MESSAGE_LIST_SUCCESS,
    SEND_MESSAGE_FAIL,
    SEND_MESSAGE_REQUEST,
    SEND_MESSAGE_SUCCESS,
} from "../Constants/messageConstants";

import axios from "axios";
import baseURL from "@assets/commons/baseurl";
import mime from "mime";
export const listMessages = (id, token) => async (dispatch) => {
  console.log("id", id);
    try {
        dispatch({ type: MESSAGE_LIST_REQUEST });
        
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }, 
        }

        const { data } = await axios.get(`${baseURL}m/${id}`, config);
        console.log("data", data);
        dispatch({
        type: MESSAGE_LIST_SUCCESS,
        payload: data.details,
        });
    } catch (error) {
        dispatch({
        type: MESSAGE_LIST_FAIL,
        payload:
            error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        });
    }
}

export const sendingMessage = (message, token) => async (dispatch) => {
    console.log("message", message?.image);    

    try {
      dispatch({ type: SEND_MESSAGE_REQUEST });
      const formData = new FormData();
      formData.append("sender", message?.sender);
      formData.append("text", message?.text);
      formData.append("conversationId", message?.conversationId);
  
      message?.image.forEach((imageUri) => {
        const newImageUri = "file:///" + imageUri.split("file:/").join("");
        formData.append("image", {
          uri: newImageUri,
          type: mime.getType(newImageUri),
          name: newImageUri.split("/").pop(),
        });
      });
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
  
      const { data } = await axios.post(`${baseURL}m`, formData, config);
      dispatch({
        type: SEND_MESSAGE_SUCCESS,
        payload: data.details,
      });
    } catch (error) {
      dispatch({
        type: SEND_MESSAGE_FAIL,
        payload: error.response ? error.response.data.message : error.message,
      });
    }
  };