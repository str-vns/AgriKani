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
      return { loading: true, coops: [] };

    case COOP_ALL_SUCCESS:
      return { loading: false, coops: action.payload };

    case COOP_ALL_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
}

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
}

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
}
