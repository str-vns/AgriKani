import {
    GET_DAILY_SALES_REQUEST,
    GET_DAILY_SALES_SUCCESS,
    GET_DAILY_SALES_FAIL,
    GET_WEEKLY_SALES_REQUEST,
    GET_WEEKLY_SALES_SUCCESS,
    GET_WEEKLY_SALES_FAIL,
    GET_MONTHLY_SALES_REQUEST,
    GET_MONTHLY_SALES_SUCCESS,
    GET_MONTHLY_SALES_FAIL,
    SALES_ERROR,
  } from "@redux/Constants/salesConstants";
  
  
  const initialState = {
    dailySales: {
      loading: false,
      data: null,
      error: null,
    },
    weeklySales: {
      loading: false,
      data: null,
      error: null,
    },
    monthlySales: {
      loading: false,
      data: null,
      error: null,
    },
    globalError: null,
  };
  
  const salesReducer = (state = initialState, action) => {
    switch (action.type) {
      // Daily Sales
      case GET_DAILY_SALES_REQUEST:
        return {
          ...state,
          dailySales: {
            ...state.dailySales,
            loading: true,
          },
        };
      case GET_DAILY_SALES_SUCCESS:
        return {
          ...state,
          dailySales: {
            ...state.dailySales,
            loading: false,
            data: action.payload,
            error: null,
          },
        };
      case GET_DAILY_SALES_FAIL:
        return {
          ...state,
          dailySales: {
            ...state.dailySales,
            loading: false,
            error: action.payload,
          },
        };
  
      // Weekly Sales
      case GET_WEEKLY_SALES_REQUEST:
        return {
          ...state,
          weeklySales: {
            ...state.weeklySales,
            loading: true,
          },
        };
      case GET_WEEKLY_SALES_SUCCESS:
        return {
          ...state,
          weeklySales: {
            ...state.weeklySales,
            loading: false,
            data: action.payload,
            error: null,
          },
        };
      case GET_WEEKLY_SALES_FAIL:
        return {
          ...state,
          weeklySales: {
            ...state.weeklySales,
            loading: false,
            error: action.payload,
          },
        };
  
      // Monthly Sales
      case GET_MONTHLY_SALES_REQUEST:
        return {
          ...state,
          monthlySales: {
            ...state.monthlySales,
            loading: true,
          },
        };
      case GET_MONTHLY_SALES_SUCCESS:
        return {
          ...state,
          monthlySales: {
            ...state.monthlySales,
            loading: false,
            data: action.payload,
            error: null,
          },
        };
      case GET_MONTHLY_SALES_FAIL:
        return {
          ...state,
          monthlySales: {
            ...state.monthlySales,
            loading: false,
            error: action.payload,
          },
        };
  
      // Global Sales Error (for any global errors)
      case SALES_ERROR:
        return {
          ...state,
          globalError: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  export default salesReducer;
  