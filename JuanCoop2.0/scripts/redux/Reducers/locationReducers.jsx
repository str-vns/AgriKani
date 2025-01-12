import {
  REVERSE_GEOCODE_FAIL,
  REVERSE_GEOCODE_REQUEST,
  REVERSE_GEOCODE_SUCCESS,
  FORWARD_GEOCODE_FAIL,
  FORWARD_GEOCODE_REQUEST,
  FORWARD_GEOCODE_SUCCESS,
  FETCH_ROUTE_REQUEST,
  FETCH_ROUTE_SUCCESS,
  FETCH_ROUTE_FAIL,
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


export const MapBoxRouteReducer = (state = { route: {} }, action) => {
  switch (action.type) {
    case FETCH_ROUTE_REQUEST:
      return { RouteLoading: true, routes: {} };
    case FETCH_ROUTE_SUCCESS:
      return { RouteLoading: false, routes: action.payload };
    case FETCH_ROUTE_FAIL:
      return { RouteLoading: false, RouteError: action.payload };
    default:
      return state;
  }
}