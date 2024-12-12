import {
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_FAIL,
  SINGLE_COOP_FAIL,
  SINGLE_COOP_SUCCESS,
  SINGLE_COOP_REQUEST,
  ALL_PRODUCT_COOP_FAIL,
  ALL_PRODUCT_COOP_SUCCESS,
  ALL_PRODUCT_COOP_REQUEST,
  CREATE_PRODUCT_FAIL,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_FAIL,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_REQUEST,
  DELETE_PRODUCT_IMAGE_FAIL, 
  DELETE_PRODUCT_IMAGE_REQUEST,
  DELETE_PRODUCT_IMAGE_SUCCESS,
  SOFTDELETE_PRODUCT_FAIL, 
  SOFTDELETE_PRODUCT_REQUEST,
  SOFTDELETE_PRODUCT_SUCCESS,
  RESTORE_PRODUCT_FAIL,
  RESTORE_PRODUCT_REQUEST,
  RESTORE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  ARCHIVE_PRODUCT_FAIL, 
  ARCHIVE_PRODUCT_REQUEST,
  ARCHIVE_PRODUCT_SUCCESS,
  GET_SINGLE_PRODUCT_FAIL,
  GET_SINGLE_PRODUCT_REQUEST,
  GET_SINGLE_PRODUCT_SUCCESS,
  PRODUCT_ACTIVE_FAIL,
  PRODUCT_ACTIVE_REQUEST,
  PRODUCT_ACTIVE_SUCCESS,
  CLEAR_ERRORS,
} from "@redux/Constants/productConstants";

export const reducerProduct = (state = { products: [] }, action) => {
  switch (action.type) {
    case ALL_PRODUCT_REQUEST:
      case GET_SINGLE_PRODUCT_REQUEST:
      return { ...state, loading: true, products: [] };
    case ALL_PRODUCT_SUCCESS:
      case GET_SINGLE_PRODUCT_SUCCESS:
      return { ...state, loading: false, products: action.payload };
    case ALL_PRODUCT_FAIL:
      case GET_SINGLE_PRODUCT_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const reducerCoop = (state = { coop: {} }, action) => {
  switch (action.type) {
    case SINGLE_COOP_REQUEST:
      return { ...state, loading: true, coop: {} };
    case SINGLE_COOP_SUCCESS:
      return { ...state, loading: false, coop: action.payload };
    case SINGLE_COOP_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const reducerCoopProduct = (state = { coopProducts: [] }, action) => {
  switch (action.type) {
    case ALL_PRODUCT_COOP_REQUEST:
      case ARCHIVE_PRODUCT_REQUEST:
      return { ...state, loading: true, coopProducts: [] };
    case ALL_PRODUCT_COOP_SUCCESS:
      case ARCHIVE_PRODUCT_SUCCESS:
      return { ...state, loading: false, coopProducts: action.payload };
    case ALL_PRODUCT_COOP_FAIL:
      case ARCHIVE_PRODUCT_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export const reducerCreateProduct = (state = { product: {} }, action) => {
  switch (action.type) {
    case CREATE_PRODUCT_REQUEST:
      case PRODUCT_ACTIVE_REQUEST:
      return { ...state, loading: true, product: {} };
    case CREATE_PRODUCT_SUCCESS:
      case PRODUCT_ACTIVE_SUCCESS:
      return { ...state, loading: false, success: action.payload };
    case CREATE_PRODUCT_FAIL:
      case PRODUCT_ACTIVE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export const reducerEditProduct = (state = { product: {} }, action) => {
  switch (action.type) {
    case UPDATE_PRODUCT_REQUEST:
      case DELETE_PRODUCT_IMAGE_REQUEST:
      return { ...state, loading: true, product: {} };
    case UPDATE_PRODUCT_SUCCESS:
      case DELETE_PRODUCT_IMAGE_SUCCESS:
      return { ...state, loading: false, success: action.payload };
    case UPDATE_PRODUCT_FAIL:
      case DELETE_PRODUCT_IMAGE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export const reducerDelResProduct = (state = { product: {} }, action) => {
        switch (action.type) {
            case SOFTDELETE_PRODUCT_REQUEST:
            case RESTORE_PRODUCT_REQUEST:
            case DELETE_PRODUCT_REQUEST:
                return { ...state, loading: true, product: {} };
            case SOFTDELETE_PRODUCT_SUCCESS:
            case RESTORE_PRODUCT_SUCCESS:
            case DELETE_PRODUCT_SUCCESS:
                return { ...state, loading: false, success: action.payload };
            case SOFTDELETE_PRODUCT_FAIL:
            case RESTORE_PRODUCT_FAIL:
            case DELETE_PRODUCT_FAIL:
                return { ...state, loading: false, error: action.payload };
            case CLEAR_ERRORS:
                return {
                    ...state,
                    error: null,
                };
            default:
                return state;
        }
}