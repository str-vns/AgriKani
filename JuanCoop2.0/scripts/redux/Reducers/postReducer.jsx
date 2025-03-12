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
  ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAIL,
  GET_COMMENTS_REQUEST, GET_COMMENTS_SUCCESS, GET_COMMENTS_FAIL,
  POST_IMAGE_DELETE_REQUEST, POST_IMAGE_DELETE_SUCCESS, POST_IMAGE_DELETE_FAIL,
  CLEAR_ERRORS,
} from "../Constants/postConstants";

const initialState = {
  posts: [],
  post: null,
  comments: [],
  likedPost: null,
  loading: false,
  error: null,
};

// MAIN POST REDUCER
export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    // HANDLE LOADING STATES
    case POST_REQUEST:
    case GET_POST_REQUEST:
    case GET_POST_USER_REQUEST:
    case UPDATE_POST_REQUEST:
    case FETCH_APPROVED_POSTS_REQUEST:
    case POST_DELETE_REQUEST:
    case POST_SOFTDELETE_REQUEST:
    case POST_RESTORE_REQUEST:
    case POST_LIKE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // SUCCESS HANDLERS
    case POST_SUCCESS:
      return {
        ...state,
        loading: false,
        post: action.payload,
        posts: [action.payload, ...state.posts],
      };

    case GET_POST_SUCCESS:
    case GET_POST_USER_SUCCESS:
    case FETCH_APPROVED_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: Array.isArray(action.payload) ? action.payload : [],
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
    case POST_IMAGE_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        post: action.payload,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };

    case POST_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: state.posts.filter((post) => post._id !== action.payload),
      };

    case POST_SOFTDELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: state.posts.map((post) =>
          post._id === action.payload ? { ...post, isDeleted: true } : post
        ),
      };

    case POST_RESTORE_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: state.posts.map((post) =>
          post._id === action.payload ? { ...post, isDeleted: false } : post
        ),
      };

    // HANDLE LIKE FUNCTIONALITY
    case POST_LIKE_SUCCESS:
      return {
        ...state,
        loading: false,
        likedPost: action.payload,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };

    // HANDLE ERRORS
    case POST_FAIL:
    case GET_POST_FAIL:
    case GET_POST_USER_FAIL:
    case FETCH_APPROVED_POSTS_FAIL:
    case POST_DELETE_FAIL:
    case POST_SOFTDELETE_FAIL:
    case POST_RESTORE_FAIL:
    case POST_LIKE_FAIL:
    case POST_IMAGE_DELETE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // CLEAR ERRORS
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// ADD COMMENT REDUCER
export const addCommentReducer = (state = { loading: false, success: null, error: null }, action) => {
  switch (action.type) {
    case ADD_COMMENT_REQUEST:
      return { loading: true };
    case ADD_COMMENT_SUCCESS:
      return { loading: false, success: action.payload };
    case ADD_COMMENT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// GET COMMENTS REDUCER
export const getCommentsReducer = (state = { loading: false, comments: [], error: null }, action) => {
  switch (action.type) {
    case GET_COMMENTS_REQUEST:
      return { ...state, loading: true };
    case GET_COMMENTS_SUCCESS:
      return { loading: false, comments: action.payload };
    case GET_COMMENTS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// POST LIKE REDUCER (Separation for Better Management)
const initialLikeState = { likedPost: null, loading: false, error: null };

export const postLikeReducer = (state = initialLikeState, action) => {
  switch (action.type) {
    case POST_LIKE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case POST_LIKE_SUCCESS:
      return {
        ...state,
        loading: false,
        likedPost: action.payload,
        error: null,
      };
    case POST_LIKE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default postReducer;