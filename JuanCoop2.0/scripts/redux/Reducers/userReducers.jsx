import {
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,

  OTP_USER_REQUEST,
  OTP_USER_FAIL,
  OTP_USER_SUCCESS,

  USER_PROFILE_FAIL,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,

  EDIT_PROFILE_REQUEST,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_FAIL,

  WISH_USER_FAIL,
  WISH_USER_REQUEST,
  WISH_USER_SUCCESS,

  USER_MESSAGE_FAIL,
  USER_MESSAGE_REQUEST,
  USER_MESSAGE_SUCCESS,

  WISHLIST_FAIL,
  WISHLIST_REQUEST,
  WISHLIST_SUCCESS,

  GET_ALL_USERS_FAIL,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,

  CLEAR_ERRORS,
  CLEAR_REGISTER,
  
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,

  USER_SOFTDELETE_REQUEST,
  USER_SOFTDELETE_SUCCESS,
  USER_SOFTDELETE_FAIL,

  USER_RESTORE_REQUEST,
  USER_RESTORE_SUCCESS,
  USER_RESTORE_FAIL,

  GET_USER_COUNT_REQUEST,
  GET_USER_COUNT_SUCCESS,
  GET_USER_COUNT_FAIL,
} from "../Constants/userConstants";

export const RegisterReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case REGISTER_USER_REQUEST:
      case WISH_USER_REQUEST:
        case WISHLIST_REQUEST:
      return {isAuthenticated: false, loading: true, user: action.payload };
    case REGISTER_USER_SUCCESS:
      case WISH_USER_SUCCESS:
        case WISHLIST_SUCCESS:
      return {isAuthenticated: true, loading: false, user: action.payload };
    case REGISTER_USER_FAIL:
      case WISH_USER_FAIL:
        case WISHLIST_FAIL:
      return {isAuthenticated: false, loading: false, error: action.payload };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
          isAuthenticated: false,
        };
    default:
      return state;
  }
};

export const OTPReducer = (
  state = { loading: false, error: null, isAuthenticated: false },
  action
) => {
  switch (action.type) {
    case OTP_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        isAuthenticated: false,
      };

    case OTP_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };

    case OTP_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };

    case CLEAR_REGISTER:
      return {
        ...state,
        user: {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          age: "",
          gender: null,
          password: "",
          confirmPassword: "",
          image: null,
          mainImage: "",
        },
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const userReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_PROFILE_REQUEST:
      return { loading: true, user: {} };
    case USER_PROFILE_SUCCESS:
      return { loading: false, user: action.payload };
    case USER_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const getUsersReducers = (state = { users: [] }, action) => {
  switch (action.type) {
    case USER_MESSAGE_REQUEST:
      return { loading: true, users: [] };
    case USER_MESSAGE_SUCCESS:
      return { loading: false, users: action.payload };
    case USER_MESSAGE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const EditProfileReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case EDIT_PROFILE_REQUEST:
      return { loading: true, user: {} };
    case EDIT_PROFILE_SUCCESS:
      return { loading: false, user: action.payload };
    case EDIT_PROFILE_FAIL:
      return { loading: false, error: action.payload };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
    default:
      return state;
  }
};

export const AllUsersReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    // Fetching all users
    case GET_ALL_USERS_REQUEST:
      return { loading: true, users: [] };

    case GET_ALL_USERS_SUCCESS:
      return { loading: false, users: action.payload };

    case GET_ALL_USERS_FAIL:
      return { loading: false, error: action.payload };

    // Handling user actions (Delete, Soft Delete, Restore)
    case USER_DELETE_REQUEST:
    case USER_SOFTDELETE_REQUEST:
    case USER_RESTORE_REQUEST:
      return { ...state, loading: true };

    case USER_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.filter((user) => user._id !== action.payload) // Remove deleted user
      };

    case USER_SOFTDELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map((user) =>
          user._id === action.payload ? { ...user, isDeleted: true } : user
        ),
      };

    case USER_RESTORE_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map((user) =>
          user._id === action.payload ? { ...user, isDeleted: false } : user
        ),
      };

    case USER_DELETE_FAIL:
    case USER_SOFTDELETE_FAIL:
    case USER_RESTORE_FAIL:
    case GET_ALL_USERS_FAIL:
      return { ...state, loading: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null, isAuthenticated: false };

    default:
      return state;
  }
};

export const userCountReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case GET_USER_COUNT_REQUEST:
      return { ...state, loading: true };
    case GET_USER_COUNT_SUCCESS:
      return { loading: false, count: action.payload };
    case GET_USER_COUNT_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};
