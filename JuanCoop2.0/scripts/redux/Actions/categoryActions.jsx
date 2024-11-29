import { CATEGORY_LIST_FAIL, CATEGORY_LIST_REQUEST, CATEGORY_LIST_SUCCESS } from "../Constants/categoryConstants";
import baseURL from "@assets/commons/baseurl";
import axios from "axios";
export const categoryList = () => async (dispatch) => {
    try {
        dispatch({ type: CATEGORY_LIST_REQUEST });

        const { data } = await axios.get(`${baseURL}category`);
        dispatch({
            type: CATEGORY_LIST_SUCCESS,
            payload: data.details,
        });
    } catch (error) {
        dispatch({
            type: CATEGORY_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
   
}