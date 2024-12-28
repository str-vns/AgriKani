import {
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,
  CATEGORY_CREATE_REQUEST,
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_CREATE_FAIL,
  CATEGORY_EDIT_REQUEST,
  CATEGORY_EDIT_SUCCESS,
  CATEGORY_EDIT_FAIL,
  CATEGORY_DELETE_REQUEST,
  CATEGORY_DELETE_SUCCESS,
  CATEGORY_DELETE_FAIL,
  CATEGORY_CLEAR_ERRORS,
} from "@redux/Constants/categoryConstants";

// Reducer for fetching all categories
export const categoryListReducer = (state = { loading: false, categories: [], error: null }, action) => {
  switch (action.type) {
    case CATEGORY_LIST_REQUEST:
      return { ...state, loading: true, categories: [], error: null };
    case CATEGORY_LIST_SUCCESS:
      return { ...state, loading: false, categories: action.payload, error: null };
    case CATEGORY_LIST_FAIL:
      return { ...state, loading: false, categories: [], error: action.payload };
    case CATEGORY_CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Reducer for creating a category
export const categoryCreateReducer = (state = { loading: false, success: false, category: {}, error: null }, action) => {
  switch (action.type) {
    case CATEGORY_CREATE_REQUEST:
      return { ...state, loading: true, success: false, category: {}, error: null };
    case CATEGORY_CREATE_SUCCESS:
      return { ...state, loading: false, success: true, category: action.payload, error: null };
    case CATEGORY_CREATE_FAIL:
      return { ...state, loading: false, success: false, category: {}, error: action.payload || 'Something went wrong!' };
    default:
      return state;
  }
};



// Reducer for editing a category
export const categoryEditReducer = (state = { loading: false, success: false, category: {}, error: null }, action) => {
  switch (action.type) {
    case CATEGORY_EDIT_REQUEST:
      return { ...state, loading: true, success: false, category: {}, error: null };
    case CATEGORY_EDIT_SUCCESS:
      return { ...state, loading: false, success: true, category: action.payload, error: null };
    case CATEGORY_EDIT_FAIL:
      return { ...state, loading: false, success: false, category: {}, error: action.payload };
    case CATEGORY_CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Reducer for deleting a category
export const categoryDeleteReducer = (state = { loading: false, success: false, categories: [], error: null }, action) => {
  switch (action.type) {
    case CATEGORY_DELETE_REQUEST:
      return { ...state, loading: true, success: false, categories: [], error: null };
    case CATEGORY_DELETE_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        success: true, 
        categories: state.categories.filter((category) => category._id !== action.payload),
        error: null 
      };
    case CATEGORY_DELETE_FAIL:
      return { ...state, loading: false, success: false, categories: [], error: action.payload };
    case CATEGORY_CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};
