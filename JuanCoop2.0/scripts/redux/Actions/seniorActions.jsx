import {
  SENIOR_LIST_REQUEST,
  SENIOR_LIST_SUCCESS,
  SENIOR_LIST_FAIL,
  SENIOR_REGISTER_REQUEST,
  SENIOR_REGISTER_SUCCESS,
  SENIOR_REGISTER_FAIL,
  SENIOR_SINGLE_REQUEST,
  SENIOR_SINGLE_SUCCESS,
  SENIOR_SINGLE_FAIL,
  SENIOR_APPROVE_LIST_REQUEST,
  SENIOR_APPROVE_LIST_SUCCESS,
  SENIOR_APPROVE_LIST_FAIL,
  SENIOR_APPROVE_REQUEST,
  SENIOR_APPROVE_SUCCESS,
  SENIOR_APPROVE_FAIL,
  SENIOR_REJECT_REQUEST,
  SENIOR_REJECT_SUCCESS,
  SENIOR_REJECT_FAIL,
} from "../Constants/seniorConstants";
import axios from "axios";
import baseURL from "@assets/commons/baseurl";
import Toast from "react-native-toast-message";
import mime from "mime";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const listSenior = () => async (dispatch) => {
  try {
    dispatch({ type: SENIOR_LIST_REQUEST });

    const { data } = await axios.get(`${baseURL}/senior`);

    dispatch({
      type: SENIOR_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SENIOR_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
}