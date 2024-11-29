import {
    GET_RANKED_PRODUCTS_REQUEST,
    GET_RANKED_PRODUCTS_SUCCESS,
    GET_RANKED_PRODUCTS_FAIL,
    PRODUCTS_ERROR,
  } from "@redux/Constants/rankConstants";
  import axios from "axios";
  import baseURL from "@assets/commons/baseurl";
  
  // Action to fetch ranked products
  export const getRankedProducts = () => async (dispatch) => {
    try {
      dispatch({ type: GET_RANKED_PRODUCTS_REQUEST });
      const { data } = await axios.get(`${baseURL}/products/ranked`);
      
      // Dispatch only the details array to the reducer
      dispatch({
        type: GET_RANKED_PRODUCTS_SUCCESS,
        payload: data.details,  // Assuming 'details' contains the ranked products
      });
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
  
      dispatch({
        type: GET_RANKED_PRODUCTS_FAIL,
        payload: errorMessage,
      });
  
      dispatch({
        type: PRODUCTS_ERROR,
        payload: errorMessage,
      });
    }
  };
  