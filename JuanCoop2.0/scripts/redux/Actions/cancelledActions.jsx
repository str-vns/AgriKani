import {
  CREATE_CANCELLED_REQUEST,
  CREATE_CANCELLED_SUCCESS,
  CREATE_CANCELLED_FAIL,
  CANCELLED_ORDER_REQUEST,
  CANCELLED_ORDER_SUCCESS,
  CANCELLED_ORDER_FAIL,
} from "../Constants/cancelledConstants";

import axios from "axios";
import baseURL from "@assets/commons/baseurl";

export const createCancelled = (cancelled, token) => async (dispatch) => {
    console.log(cancelled);
    dispatch({ type: CREATE_CANCELLED_REQUEST });
    try {
        const response = await axios.post(`${baseURL}cancelled`, cancelled, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        
        dispatch({ type: CREATE_CANCELLED_SUCCESS, payload: response.data });
    }
    catch (error) {
        dispatch({ type: CREATE_CANCELLED_FAIL, payload: error });
    }
}

export const SingleCancelled = (Ids, token) => async (dispatch) => {

    dispatch({ type: CANCELLED_ORDER_REQUEST });
    try {
        const {data} = await axios.get(`${baseURL}cancelled/${Ids}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        console.log("data",data.details);
        dispatch({ type: CANCELLED_ORDER_SUCCESS, 
            payload: data.details });
    }

    catch (error) {
        dispatch({ type: CANCELLED_ORDER_FAIL, payload: error });
    }

}