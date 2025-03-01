import { COMMENT_CREATE_FAIL, COMMENT_CREATE_REQUEST, COMMENT_CREATE_SUCCESS } from "../Constants/commentConstants";
import axios from "axios";
import baseURL from "@assets/commons/baseurl";

export const createComment = (comment, token) => async (dispatch) => {
    console.log('Comment:', comment);
    try {
        dispatch({ type: COMMENT_CREATE_REQUEST });


        const formData = new FormData();
        formData.append("user", comment.user);
        formData.append("order", comment.order);
        formData.append("productId", comment.productId);
        formData.append("rating", comment.rating);
        formData.append("comment", comment.comment);
        formData.append("driverRating", comment.driverRating);
        formData.append("serviceRating", comment.serviceRating);
        
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },

        };

        const { data } = await axios.post(`${baseURL}products/comment`, formData, config);

        if (data.success) {
            dispatch({
                type: COMMENT_CREATE_SUCCESS,
                payload: data.details,
            });
            return { success: true, comment: data.details };
        } else {
            dispatch({
                type: COMMENT_CREATE_FAIL,
                payload: data.message,
            });
        }
    } catch (error) {
        dispatch({
            type: COMMENT_CREATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
}