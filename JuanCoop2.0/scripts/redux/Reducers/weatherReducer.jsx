import {
  WEATHER_DAILY_REQUEST,
  WEATHER_DAILY_SUCCESS,
  WEATHER_DAILY_FAIL,
  WEATHER_CURRENT_SUCCESS,
  WEATHER_CURRENT_REQUEST,
  WEATHER_CURRENT_FAIL,
  CLEAR_ERRORS,
} from "../Constants/weatherConstants";

export const weatherDailyReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case WEATHER_DAILY_REQUEST:
      return { loadingWDaily: true };
    case WEATHER_DAILY_SUCCESS:
      return { loadingWDaily: false, weatherDaily: action.payload };
    case WEATHER_DAILY_FAIL:
      return { loadingWDaily: false, errorWDaily: action.payload };
    case CLEAR_ERRORS:
      return { ...state, errorWDaily: null };
    default:
      return state;
  }
};

export const weatherCurrentReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case WEATHER_CURRENT_REQUEST:
      return { loadingWCurrent: true };
    case WEATHER_CURRENT_SUCCESS:
      return { loading: false, weatherCurrent: action.payload };
    case WEATHER_CURRENT_FAIL:
      return { loadingWCurrent: false, errorWCurrent: action.payload };
    case CLEAR_ERRORS:
      return { ...state, errorWCurrent: null };
    default:
      return state;
  }
};
