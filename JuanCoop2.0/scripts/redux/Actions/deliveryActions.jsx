import { CREATE_DELIVERY_REQUEST ,
        CREATE_DELIVERY_FAIL,
        CREATE_DELIVERY_SUCCESS,
        GET_DELIVERY_TRACKING_REQUEST,
        GET_DELIVERY_TRACKING_SUCCESS,
        GET_DELIVERY_TRACKING_FAIL,
        GET_DELIVERY_DRIVER_REQUEST,
        GET_DELIVERY_DRIVER_SUCCESS,
        GET_DELIVERY_DRIVER_FAIL,
        UPDATE_DELIVERY_STATUS_REQUEST,
        UPDATE_DELIVERY_STATUS_SUCCESS,
        UPDATE_DELIVERY_STATUS_FAIL,
        QR_CODE_REQUEST,
        QR_CODE_SUCCESS,
        QR_CODE_FAIL,
        HISTORY_DELIVERY_REQUEST,
        HISTORY_DELIVERY_SUCCESS,
        HISTORY_DELIVERY_FAIL,
        COMPLETED_DELIVERY_REQUEST,
        COMPLETED_DELIVERY_SUCCESS,
        COMPLETED_DELIVERY_FAIL,
        DELIVERY_LIST_FAIL,
        DELIVERY_LIST_REQUEST,
        DELIVERY_LIST_SUCCESS,
        THIS_MONTH_DELIVERY_REQUEST,
        THIS_MONTH_DELIVERY_SUCCESS,
        THIS_MONTH_DELIVERY_FAIL,
        REMOVE_DELIVERY_REQUEST,
        REMOVE_DELIVERY_SUCCESS,
        REMOVE_DELIVERY_FAIL,
        CLEAR_ERRORS
} from "../Constants/deliveryConstants";
import axios from "axios";
import baseURL from "@assets/commons/baseurl";

export const createDelivery = (deliveryData, token) => async (dispatch) => {
    try{
      dispatch({ type: CREATE_DELIVERY_REQUEST });
        const config = {
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            },
        };
    
        const { data } = await axios.post(`${baseURL}delivery`, deliveryData, config);
       
        dispatch({
            type: CREATE_DELIVERY_SUCCESS,
            payload: data.details,
        });
    } catch(error) {
        dispatch({
            type: CREATE_DELIVERY_FAIL,
            payload: error.response ? error.response.data : error.message,
        });
        console.error("Error creating delivery:", error);
    }
}

export const getDeliveryTracking = (deliveryId, token) => async (dispatch) => {
}

export const getDeliveryDriver = (deliveryId, token) => async (dispatch) => {
    try {
        
        dispatch({
            type: GET_DELIVERY_DRIVER_REQUEST,
        });
        const response = await axios.get(`${baseURL}delivery/driver/${deliveryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({
            type: GET_DELIVERY_DRIVER_SUCCESS,
            payload: response.data.details,
        });

    } catch (error) {
        dispatch({
            type: GET_DELIVERY_DRIVER_FAIL,
            payload: error.response.data,
        });
       console.error("Error getting delivery driver:", error);
    }
}

export const getHistoryDelivery = (deliveryId, token) => async (dispatch) => {
    try {
        dispatch({
            type: HISTORY_DELIVERY_REQUEST,
        });
        const response = await axios.get(`${baseURL}delivery/history/${deliveryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({
            type: HISTORY_DELIVERY_SUCCESS,
            payload: response.data.details,
        });

    } catch (error) {
        dispatch({
            type: HISTORY_DELIVERY_FAIL,
            payload: error.response.data,
        });
        console.error("Error getting delivery history:", error);
    }
}

export const getCompletedDelivery = (deliveryId, token) => async (dispatch) => {
    try{
        dispatch({
            type: COMPLETED_DELIVERY_REQUEST,
        });
        const response = await axios.get(`${baseURL}delivery/complete/${deliveryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({
            type: COMPLETED_DELIVERY_SUCCESS,
            payload: response.data.details,
        });


    } catch (error) {
        dispatch({
            type: COMPLETED_DELIVERY_FAIL,
            payload: error.response.data,
        });
        console.error("Error getting completed delivery:", error);
    }
}

export const updateDeliveryStatus = (deliveryId, status, token) => async (dispatch) => {
   console.log("updateDeliveryStatus", deliveryId, status);
    try {
        dispatch({
            type: UPDATE_DELIVERY_STATUS_REQUEST,
        });

        const response = await axios.patch(`${baseURL}delivery/${deliveryId}`, { status }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({
            type: UPDATE_DELIVERY_STATUS_SUCCESS,
            payload: response.data.details,
        });

    }
    catch (error) {
        dispatch({
            type: UPDATE_DELIVERY_STATUS_FAIL,
            payload: error.response.data,
        });
        console.error("Error updating delivery status:", error);
    }

}


export const generateQRCode = (deliveryId, token) => async (dispatch) => {
}

export const deliveryList = (coopId, token) => async (dispatch) => {
    try{

        dispatch({
            type: DELIVERY_LIST_REQUEST,
        });

        const response = await axios.get(`${baseURL}orders/delivery/${coopId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({
            type: DELIVERY_LIST_SUCCESS,
            payload: response.data.details,
        });

    }catch (error) {
        dispatch({
            type: DELIVERY_LIST_FAIL,
            payload: error.response.data,
        });
        console.error("Error getting delivery list:", error);
    }

}

export const thisMonthDelivery = (coopId, token) => async (dispatch) => {

    try {
        
        dispatch({
            type: THIS_MONTH_DELIVERY_REQUEST,
        });

        const response = await axios.get(`${baseURL}driver/delivery/month/${coopId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({
            type: THIS_MONTH_DELIVERY_SUCCESS,
            payload: response.data.details,
        });

    } catch (error) {
        dispatch({
            type: THIS_MONTH_DELIVERY_FAIL,
            payload: error.response.data,
        });
        console.error("Error getting this month delivery:", error);
    }
}

export const removeDelivery = (id, token) => async (dispatch) => {
   console.log("removeDelivery", id);
    try {
        dispatch({
            type: REMOVE_DELIVERY_REQUEST,
        });

        const response = await axios.delete(`${baseURL}delivery/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({
            type: REMOVE_DELIVERY_SUCCESS,
            payload: response.data.details,
        });

    } catch (error) {
        dispatch({
            type: REMOVE_DELIVERY_FAIL,
            payload: error.response.data,
        });
        console.error("Error removing delivery:", error);
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS

    })
}