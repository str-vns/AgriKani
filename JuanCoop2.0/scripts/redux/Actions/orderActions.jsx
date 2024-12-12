import axios from 'axios';
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  FETCH_ORDERS_REQUEST, 
  FETCH_ORDERS_SUCCESS, 
  FETCH_ORDERS_FAILURE,
  ORDER_UPDATE_STATUS_REQUEST,
  ORDER_UPDATE_STATUS_SUCCESS,
  ORDER_UPDATE_STATUS_FAIL,
  ORDER_DELETE_REQUEST,
  ORDER_DELETE_SUCCESS,
  ORDER_DELETE_FAIL,
  ORDER_COOP_USER_REQUEST,
  ORDER_COOP_USER_SUCCESS,
  ORDER_COOP_USER_FAIL
} from '../Constants/orderConstants';
import baseURL from '@assets/commons/baseurl';

// ok
export const createOrder = (orderData, token) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });
    
    const config = {
      headers: {
       'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${baseURL}order`, orderData, config);

    // Check if the data contains the order object directly or within another key
    const order = data?.order || data;
    if (!order) {
      throw new Error("Order creation response is missing order data.");
    }

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: { order },
    });

    return { order };
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: error.response?.data.message || error.message,
    });
    throw new Error(error.response?.data.message || "Order creation failed");
  }
};

//ok
export const fetchUserOrders = (userId, token) => async (dispatch) => {
    dispatch({ type: FETCH_ORDERS_REQUEST });
  
    try {
      const response = await axios.get(`${baseURL}order/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ 
        type: FETCH_ORDERS_SUCCESS, 
        payload: response.data.details });
    } catch (error) {
      dispatch({
        type: FETCH_ORDERS_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// Action to update the status of an order (cancel an order)
export const cancelOrder = (productId, token) => async (dispatch) => {
  console.log('cancelOrder', productId);
    try {
      dispatch({ type: ORDER_UPDATE_STATUS_REQUEST });
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
  
      // Set the status to 'Cancelled' for pending orders
      const { data } = await axios.put(`${baseURL}order/edit/${orderId}`, { status: 'Cancelled' }, config);
  
      dispatch({ type: ORDER_UPDATE_STATUS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: ORDER_UPDATE_STATUS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
// Action to update the status of an order
export const updateOrderStatus = (orderId, status, token) => async (dispatch, getState) => {

  try {
    dispatch({ type: ORDER_UPDATE_STATUS_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(`${baseURL}order/edit/${orderId}`,status,  config);

    dispatch({ type: ORDER_UPDATE_STATUS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_UPDATE_STATUS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Action to delete an order
export const deleteOrder = (productId, token) => async (dispatch, getState) => {
  console.log('cancelOrder', productId);
  try {
    dispatch({ type: ORDER_DELETE_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`${baseURL}order/delete/${productId}`, config);

    dispatch({ type: ORDER_DELETE_SUCCESS, payload: orderId });
  } catch (error) {
    dispatch({
      type: ORDER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const fetchCoopOrders = (coopId, token) => async (dispatch) => {

  try{
  
    dispatch({ type: ORDER_COOP_USER_REQUEST });
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const { data } = await axios.get(`${baseURL}coop/ordersList/${coopId}`, config);
  
    dispatch({ type: ORDER_COOP_USER_SUCCESS, payload: data.details });

  } catch (error) {
    dispatch({
      type: ORDER_COOP_USER_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
}