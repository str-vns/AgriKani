import {
  MEMBER_LIST_REQUEST,
  MEMBER_LIST_SUCCESS,
  MEMBER_LIST_FAIL,
  MEMBER_DETAILS_REQUEST,
  MEMBER_DETAILS_SUCCESS,
  MEMBER_DETAILS_FAIL,
  MEMBER_APPROVE_REQUEST,
  MEMBER_APPROVE_SUCCESS,
  MEMBER_APPROVE_FAIL,
  MEMBER_REJECT_REQUEST,
  MEMBER_REJECT_SUCCESS,
  MEMBER_REJECT_FAIL,
  MEMBER_CREATE_REQUEST,
  MEMBER_CREATE_SUCCESS,
  MEMBER_CREATE_FAIL,
  MEMBER_ALL_REQUEST,
  MEMBER_ALL_SUCCESS,
  MEMBER_ALL_FAIL,
  MEMBER_INACTIVE_FAIL,
  MEMBER_INACTIVE_REQUEST,
  MEMBER_INACTIVE_SUCCESS,
  MEMBER_REMOVE_REQUEST,
  MEMBER_REMOVE_SUCCESS,
  MEMBER_REMOVE_FAIL,
  CLEAR_ERRORS
} from "@redux/Constants/memberConstants";

export const memberListReducer = (state = { members: [] }, action) => {
  switch (action.type) {
    case MEMBER_LIST_REQUEST:
    case MEMBER_DETAILS_REQUEST:
      case MEMBER_ALL_REQUEST:
        case MEMBER_INACTIVE_REQUEST:
      return { loading: true, members: [] };
    case MEMBER_LIST_SUCCESS:
    case MEMBER_DETAILS_SUCCESS:
      case MEMBER_ALL_SUCCESS:
        case MEMBER_INACTIVE_SUCCESS:
      return { loading: false, members: action.payload };
    case MEMBER_LIST_FAIL:
    case MEMBER_DETAILS_FAIL:
      case MEMBER_ALL_FAIL:
        case MEMBER_INACTIVE_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null, };
    default:
      return state;
  }
};

export const memberApiReducer = (state = { member: {} }, action) => {
  switch (action.type) {
    case MEMBER_CREATE_REQUEST:
    case MEMBER_APPROVE_REQUEST:
    case MEMBER_REJECT_REQUEST:
      case MEMBER_REMOVE_REQUEST:
      return { loading: true, member: {} };
    case MEMBER_CREATE_SUCCESS:
    case MEMBER_APPROVE_SUCCESS:
    case MEMBER_REJECT_SUCCESS:
      case MEMBER_REMOVE_SUCCESS:
      return { loading: false, success: true, member: action.payload };
    case MEMBER_CREATE_FAIL:
    case MEMBER_APPROVE_FAIL:
    case MEMBER_REJECT_FAIL:
      case MEMBER_REMOVE_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null, };
    default:
      return state;
  }
};
