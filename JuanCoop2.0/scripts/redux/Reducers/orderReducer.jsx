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
    ORDER_COOP_USER_FAIL,
    SHIPPED_ORDER_FAIL,
    SHIPPED_ORDER_REQUEST,
    SHIPPED_ORDER_SUCCESS,
    HISTORY_DELIVERY_COOP_REQUEST,
    HISTORY_DELIVERY_COOP_SUCCESS,
    HISTORY_DELIVERY_COOP_FAIL
  } from '../Constants/orderConstants';
  
  const initialState = {
    orders: [],
    order: null, // For single order creation or updates
    loading: false,
    error: null,
  };
  
  export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
      case ORDER_CREATE_REQUEST:
        case FETCH_ORDERS_REQUEST:
          case ORDER_UPDATE_STATUS_REQUEST:
            return { ...state, loading: true, error: null };
      case ORDER_UPDATE_STATUS_REQUEST:
      case ORDER_DELETE_REQUEST:
        return { ...state, loading: true, error: null };
  
      case ORDER_CREATE_SUCCESS:
        return { ...state, loading: false, order: action.payload };
  
        case FETCH_ORDERS_SUCCESS:
            return { ...state, loading: false, orders: action.payload };
  
      case ORDER_UPDATE_STATUS_SUCCESS:
        return {
          ...state,
          loading: false,
          orders: state.orders.map((order) =>
            order._id === action.payload._id ? action.payload : order
          ),
        };
  
      case ORDER_DELETE_SUCCESS:
        return {
          ...state,
          loading: false,
          orders: state.orders.filter((order) => order._id !== action.payload),
        };
  
      case ORDER_CREATE_FAIL:
        case FETCH_ORDERS_FAILURE:
            return { ...state, loading: false, error: action.payload };
      case ORDER_UPDATE_STATUS_FAIL:
      case ORDER_DELETE_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };  

  export const orderCoopReducer = (state = { order: {} }, action) => {
    switch (action.type) {
      case ORDER_COOP_USER_REQUEST:
        return { orderloading: true, orders: {} };
  
      case ORDER_COOP_USER_SUCCESS:
        return { orderloading: false, orders: action.payload };
  
      case ORDER_COOP_USER_FAIL:
        return { orderloading: false, ordererror: action.payload };
  
      default:
        return state;
    }
  }

  export const orderShippedReducer = (state = { order: {} }, action) => {
    switch (action.type) {
      case SHIPPED_ORDER_REQUEST:
        return { shiploading: true, orders: {} };
  
      case SHIPPED_ORDER_SUCCESS:
        return { shiploading: false, orders: action.payload };
  
      case SHIPPED_ORDER_FAIL:
        return { shiploading: false, shiperror: action.payload };
  
      default:
        return state;
    }
  }

  export const historyDeliveryCoopReducer = (state = { history: [] }, action) => {
    switch (action.type) {
      case HISTORY_DELIVERY_COOP_REQUEST:
        return { historyloading: true, history: [] };
  
      case HISTORY_DELIVERY_COOP_SUCCESS:
        return { historyloading: false, history: action.payload };
  
      case HISTORY_DELIVERY_COOP_FAIL:
        return { historyloading: false, historyerror: action.payload };
  
      default:
        return state;
    }
  }
