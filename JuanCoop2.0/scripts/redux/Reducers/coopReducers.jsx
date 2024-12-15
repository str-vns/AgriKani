import {
  COOP_REGISTER_REQUEST,
  COOP_REGISTER_SUCCESS,
  COOP_REGISTER_FAIL,
  COOP_IMAGE_DELETE_FAIL,
  COOP_IMAGE_DELETE_REQUEST,
  COOP_IMAGE_DELETE_SUCCESS,
  COOP_UPDATE_FAIL,
  COOP_UPDATE_REQUEST,
  COOP_UPDATE_SUCCESS,
  COOP_ALL_FAIL,
  COOP_ALL_REQUEST,
  COOP_ALL_SUCCESS,
  COOP_ALL_ORDERS_FAIL,
  COOP_ALL_ORDERS_REQUEST,
  COOP_ALL_ORDERS_SUCCESS,
  COOP_UPDATE_ORDERS_FAIL,
  COOP_UPDATE_ORDERS_REQUEST,
  COOP_UPDATE_ORDERS_SUCCESS,
  COOP_SINGLE_FAIL,
  COOP_SINGLE_REQUEST,
  COOP_SINGLE_SUCCESS,
  COOP_MATCH_FAIL,
  COOP_MATCH_REQUEST,
  COOP_MATCH_SUCCESS,
  INACTIVE_COOP_REQUEST,
  INACTIVE_COOP_SUCCESS,
  INACTIVE_COOP_FAIL,
  COOP_ACTIVE_FAIL,
  COOP_ACTIVE_REQUEST,
  COOP_ACTIVE_SUCCESS,
  COOP_DELETE_FAIL,
  COOP_DELETE_REQUEST,
  COOP_DELETE_SUCCESS,
} from "../Constants/coopConstants";

export const coopYReducer = (state = { coop: {} }, action) => {
  switch (action.type) {
    case COOP_REGISTER_REQUEST:
    case COOP_IMAGE_DELETE_REQUEST:
    case COOP_UPDATE_REQUEST:
      return { ...state, loading: true };

    case COOP_REGISTER_SUCCESS:
      return { loading: false, success: action.payload, authentication: true };

    case COOP_IMAGE_DELETE_SUCCESS:
      return { loading: false, success: action.payload, authentication: true };

    case COOP_UPDATE_SUCCESS:
      return { loading: false, success: action.payload, authentication: true };

    case COOP_REGISTER_FAIL:
    case COOP_IMAGE_DELETE_FAIL:
    case COOP_UPDATE_FAIL:
      return { loading: false, error: action.payload, authentication: false };

    default:
      return state;
  }
};

export const coopAllReducer = (state = { coops: [] }, action) => {
  switch (action.type) {
    case COOP_ALL_REQUEST:
    case COOP_SINGLE_REQUEST:
    case COOP_MATCH_REQUEST: 
    case INACTIVE_COOP_REQUEST:
      return { loading: true, coops: [] };

    case COOP_ALL_SUCCESS:
    case COOP_SINGLE_SUCCESS:
    case COOP_MATCH_SUCCESS:
    case INACTIVE_COOP_SUCCESS:
      return { loading: false, coops: action.payload };

    case COOP_ALL_FAIL:
    case COOP_SINGLE_FAIL:
    case COOP_MATCH_FAIL:
    case INACTIVE_COOP_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const coopOrderReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case COOP_ALL_ORDERS_REQUEST:
      return { loading: true, orders: [] };

    case COOP_ALL_ORDERS_SUCCESS:
      return { loading: false, orders: action.payload };

    case COOP_ALL_ORDERS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const coopOrderUpdateReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case COOP_UPDATE_ORDERS_REQUEST:
      return { loading: true, order: {} };

    case COOP_UPDATE_ORDERS_SUCCESS:
      return { loading: false, success: action.payload };

    case COOP_UPDATE_ORDERS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const coopActiveReducer = (state = { coop: {} }, action) => {
  switch (action.type) {
    case COOP_ACTIVE_REQUEST:
      case COOP_DELETE_REQUEST:
      return { loading: true, coop: {} };

    case COOP_ACTIVE_SUCCESS:
      case COOP_DELETE_SUCCESS:
      return { loading: false, success: action.payload };

    case COOP_ACTIVE_FAIL:
      case COOP_DELETE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
}
