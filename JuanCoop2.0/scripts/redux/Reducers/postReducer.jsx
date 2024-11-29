import {
    POST_REQUEST, POST_SUCCESS, POST_FAIL,
    GET_POST_REQUEST, GET_POST_SUCCESS, GET_POST_FAIL,
    GET_POST_USER_REQUEST, GET_POST_USER_SUCCESS, GET_POST_USER_FAIL,
    UPDATE_POST_REQUEST, UPDATE_POST_SUCCESS, UPDATE_POST_FAIL,
    POST_DELETE_REQUEST, POST_DELETE_SUCCESS, POST_DELETE_FAIL,
    POST_SOFTDELETE_REQUEST, POST_SOFTDELETE_SUCCESS, POST_SOFTDELETE_FAIL,
    POST_RESTORE_REQUEST, POST_RESTORE_SUCCESS, POST_RESTORE_FAIL,
    POST_LIKE_REQUEST, POST_LIKE_SUCCESS, POST_LIKE_FAIL,
    POST_APPROVE_REQUEST, POST_APPROVE_SUCCESS, POST_APPROVE_FAILURE,
    FETCH_APPROVED_POSTS_REQUEST, FETCH_APPROVED_POSTS_SUCCESS, FETCH_APPROVED_POSTS_FAIL,
    CLEAR_ERRORS,
  } from "../Constants/postConstants";
  
  const initialState = {
    posts: [],
    post: null,
    loading: false,
    error: null,
  };
  
  export const postReducer = (state = initialState, action) => {
    switch (action.type) {
      case POST_REQUEST:
      case GET_POST_REQUEST:
      case GET_POST_USER_REQUEST:
      case UPDATE_POST_REQUEST:

      case FETCH_APPROVED_POSTS_REQUEST:
        return {
            ...state,
            loading: true,
            error: null,
        };
      case POST_DELETE_REQUEST:
      case POST_SOFTDELETE_REQUEST:
      case POST_RESTORE_REQUEST:
        return { ...state, loading: true };
  
      case POST_SUCCESS:
        return {
          ...state,
          loading: false,
          post: action.payload, // Update the single post
          posts: [action.payload, ...state.posts], // Add to the list of posts
        };
  
      case GET_POST_SUCCESS:
      case GET_POST_USER_SUCCESS:
        return {
          ...state,
          loading: false,
          posts: action.payload, // Set posts from the action payload
        };
  
      case UPDATE_POST_SUCCESS:
        return {
          ...state,
          loading: false,
          post: action.payload, // Updated single post
          posts: state.posts.map((post) =>
            post._id === action.payload._id ? action.payload : post // Update post in the list
          ),
        };
        case FETCH_APPROVED_POSTS_SUCCESS:
            return {
              ...state,
              loading: false,
              posts: Array.isArray(action.payload) ? action.payload : [],
            };

      case POST_DELETE_SUCCESS:
        return {
          ...state,
          loading: false,
          posts: state.posts.filter((post) => post._id !== action.payload), // Remove deleted post
        };
  
      case POST_SOFTDELETE_SUCCESS:
        return {
          ...state,
          loading: false,
          posts: state.posts.map((post) =>
            post._id === action.payload ? { ...post, isDeleted: true } : post // Mark post as deleted
          ),
        };
  
      case POST_RESTORE_SUCCESS:
        return {
          ...state,
          loading: false,
          posts: state.posts.map((post) =>
            post._id === action.payload ? { ...post, isDeleted: false } : post // Restore deleted post
          ),
        };
  
      case POST_LIKE_REQUEST:
        return { loading: true, ...state };
      case POST_LIKE_SUCCESS:
        return {
          loading: false,
          post: action.payload, // Updated post after like/unlike
        };
      case POST_LIKE_FAIL:
        return { loading: false, error: action.payload };
  
      case POST_FAIL:
      case GET_POST_FAIL:
      case GET_POST_USER_FAIL:
        case FETCH_APPROVED_POSTS_FAIL:
            return {
              ...state,
              loading: false,
              error: action.payload,
            };
      case POST_DELETE_FAIL:
      case POST_SOFTDELETE_FAIL:
      case POST_RESTORE_FAIL:
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
  
  export default postReducer;  