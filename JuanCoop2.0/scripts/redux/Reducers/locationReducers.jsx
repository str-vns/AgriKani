import {
  REVERSE_GEOCODE_FAIL,
  REVERSE_GEOCODE_REQUEST,
  REVERSE_GEOCODE_SUCCESS,
  FORWARD_GEOCODE_FAIL,
  FORWARD_GEOCODE_REQUEST,
  FORWARD_GEOCODE_SUCCESS,
} from "../Constants/locationConstants";

export const HereMapReducer = (state = { location: {} }, action) => {
  switch (action.type) {
    case REVERSE_GEOCODE_REQUEST:
    case FORWARD_GEOCODE_REQUEST:
      return { GeoLoading: true, location: {} };
    case REVERSE_GEOCODE_SUCCESS:
    case FORWARD_GEOCODE_SUCCESS:
      return { GeoLoading: false, location: action.payload };
    case REVERSE_GEOCODE_FAIL:
    case FORWARD_GEOCODE_FAIL:
      return { GeoLoading: false, GeoError: action.payload };
    default:
      return state;
  }
};
