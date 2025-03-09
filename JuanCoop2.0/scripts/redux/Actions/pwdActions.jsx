import {
  PWD_LIST_REQUEST,
  PWD_LIST_SUCCESS,
  PWD_LIST_FAIL,
  PWD_REGISTER_REQUEST,
  PWD_REGISTER_SUCCESS,
  PWD_REGISTER_FAIL,
  PWD_SINGLE_REQUEST,
  PWD_SINGLE_SUCCESS,
  PWD_SINGLE_FAIL,
  PWD_APPROVE_LIST_REQUEST,
  PWD_APPROVE_LIST_SUCCESS,
  PWD_APPROVE_LIST_FAIL,
  PWD_APPROVE_REQUEST,
  PWD_APPROVE_SUCCESS,
  PWD_APPROVE_FAIL,
  PWD_REJECT_REQUEST,
  PWD_REJECT_SUCCESS,
  PWD_REJECT_FAIL,
} from "../Constants/pwdConstants";
import axios from "axios";
import baseURL from "@assets/commons/baseurl";
import Toast from "react-native-toast-message";
import mime from "mime";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const listPWD = () => async (dispatch) => {
  try {
    dispatch({ type: PWD_LIST_REQUEST });

    const { data } = await axios.get(`${baseURL}/pwd`);

    dispatch({
      type: PWD_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PWD_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
}
