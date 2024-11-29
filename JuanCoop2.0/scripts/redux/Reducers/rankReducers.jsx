import {
  GET_RANKED_PRODUCTS_REQUEST,
  GET_RANKED_PRODUCTS_SUCCESS,
  GET_RANKED_PRODUCTS_FAIL,
  PRODUCTS_ERROR,
} from "@redux/Constants/rankConstants";

const initialState = {
  rankedProducts: [],  // Initial empty array
  loading: false,
  error: null,
};

const rankedReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RANKED_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_RANKED_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        rankedProducts: action.payload,  // Set 'details' array here
      };
    case GET_RANKED_PRODUCTS_FAIL:
    case PRODUCTS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default rankedReducer;
