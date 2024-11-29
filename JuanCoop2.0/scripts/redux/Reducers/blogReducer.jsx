import {
  ALL_BLOG_REQUEST,
  ALL_BLOG_SUCCESS,
  ALL_BLOG_FAIL,
  SINGLE_BLOG_REQUEST,
  SINGLE_BLOG_SUCCESS,
  SINGLE_BLOG_FAIL,
  CREATE_BLOG_REQUEST,
  CREATE_BLOG_SUCCESS,
  CREATE_BLOG_FAIL,
  UPDATE_BLOG_REQUEST,
  UPDATE_BLOG_SUCCESS,
  UPDATE_BLOG_FAIL,
  DELETE_BLOG_REQUEST,
  DELETE_BLOG_SUCCESS,
  DELETE_BLOG_FAIL,
  CLEAR_BLOG_ERRORS,
} from "@redux/Constants/blogConstants";

export const reducerBlog = (state = { blogs: [] }, action) => {
  switch (action.type) {
    case ALL_BLOG_REQUEST:
      return { ...state, loading: true, blogs: [] };
    case ALL_BLOG_SUCCESS:
      return { ...state, loading: false, blogs: action.payload };
    case ALL_BLOG_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CLEAR_BLOG_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const reducerSingleBlog = (state = { blog: {} }, action) => {
  switch (action.type) {
    case SINGLE_BLOG_REQUEST:
      return { ...state, loading: true, blog: {} };
    case SINGLE_BLOG_SUCCESS:
      return { ...state, loading: false, blog: action.payload };
    case SINGLE_BLOG_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CLEAR_BLOG_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const reducerCreateBlog = (state = { blog: {} }, action) => {
  switch (action.type) {
    case CREATE_BLOG_REQUEST:
      return { ...state, loading: true, blog: {} };
    case CREATE_BLOG_SUCCESS:
      return { ...state, loading: false, success: action.payload };
    case CREATE_BLOG_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CLEAR_BLOG_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const reducerEditBlog = (state = { blog: {} }, action) => {
  switch (action.type) {
    case UPDATE_BLOG_REQUEST:
      return { ...state, loading: true, blog: {} };
    case UPDATE_BLOG_SUCCESS:
      return { ...state, loading: false, success: action.payload };
    case UPDATE_BLOG_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CLEAR_BLOG_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const reducerDelBlog = (state = { blog: {} }, action) => {
  switch (action.type) {
    case DELETE_BLOG_REQUEST:
      return { ...state, loading: true, blog: {} };
    case DELETE_BLOG_SUCCESS:
      return { ...state, loading: false, success: action.payload };
      
    case DELETE_BLOG_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CLEAR_BLOG_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
