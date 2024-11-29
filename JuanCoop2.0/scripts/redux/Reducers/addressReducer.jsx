import { GET_ADDRESSES, ADD_ADDRESS, UPDATE_ADDRESS, DELETE_ADDRESS } from "../Constants/addressConstants";

const initialState = {
  data: [],
  loading: false,
};

export const addressReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ADDRESSES:
      return {
        ...state,
        data: action.payload,
      };
    case ADD_ADDRESS:
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    case UPDATE_ADDRESS:
      return {
        ...state,
        data: state.data.map((address) =>
          address._id === action.payload._id ? action.payload : address
        ),
      };
    case DELETE_ADDRESS:
      return {
        ...state,
        data: state.data.filter((address) => address._id !== action.payload),
      };
    default:
      return state;
  }
};

export default addressReducer;