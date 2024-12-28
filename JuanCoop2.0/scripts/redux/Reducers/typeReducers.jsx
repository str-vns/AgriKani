import {
  TYPE_LIST_REQUEST,
  TYPE_LIST_SUCCESS,
  TYPE_LIST_FAIL,
  TYPE_CREATE_REQUEST,
  TYPE_CREATE_SUCCESS,
  TYPE_CREATE_FAIL,
  TYPE_DELETE_REQUEST,
  TYPE_DELETE_SUCCESS,
  TYPE_DELETE_FAIL,
  TYPE_UPDATE_REQUEST,
  TYPE_UPDATE_SUCCESS,
  TYPE_UPDATE_FAIL,
  CLEAR_TYPE_ERRORS,
} from "../Constants/typeConstants";

export const typeListReducer = (state = { types: [] }, action) => {
  switch (action.type) {
    case TYPE_LIST_REQUEST:
      return { loading: true, types: [] }; // Loading state

    case TYPE_LIST_SUCCESS:
      return { loading: false, types: action.payload }; // Success state with data

    case TYPE_LIST_FAIL:
      return { loading: false, error: action.payload }; // Error state with message

    default:
      return state;
  }
};

export const typeCreateReducer = (
  state = { loading: false, type: {} },
  action
) => {
  switch (action.type) {
    case TYPE_CREATE_REQUEST:
      return { ...state, loading: true };
    case TYPE_CREATE_SUCCESS:
      return { ...state, loading: false, success: true, type: action.payload }; // Make sure payload is stored correctly
    case TYPE_CREATE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const typeDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case TYPE_DELETE_REQUEST:
      return { loading: true };
    case TYPE_DELETE_SUCCESS:
      return { loading: false, success: true, id: action.payload }; // Store deleted ID for reference
    case TYPE_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const typeUpdateReducer = (state = { type: {} }, action) => {
    switch (action.type) {
      case TYPE_UPDATE_REQUEST:
        return { ...state, loading: true, type: {} };
        
      case TYPE_UPDATE_SUCCESS:
        return { ...state, loading: false, success: action.payload };
        
      case TYPE_UPDATE_FAIL:
        return { ...state, loading: false, error: action.payload };
        
      case CLEAR_TYPE_ERRORS:
        return { ...state, error: null };
  
      default:
        return state;
    }
  };
  
