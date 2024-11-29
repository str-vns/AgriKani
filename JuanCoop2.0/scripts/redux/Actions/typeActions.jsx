import { TYPE_LIST_FAIL, TYPE_LIST_REQUEST, TYPE_LIST_SUCCESS } from "../Constants/typeConstants";
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
}