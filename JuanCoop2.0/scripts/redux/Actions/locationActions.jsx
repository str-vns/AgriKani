import config from "@config"
import Constants from "expo-constants";
import axios from 'axios';
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
  const apiKey = Constants.expoConfig?.extra?.MAP_API_1 ;
  const mapBoxKey = Constants.expoConfig?.extra?.MAPBOX_API_KEY
export const reverseCode = (lat, long) => async (dispatch) => {

  try {
        dispatch({ type: REVERSE_GEOCODE_REQUEST})
        const response = await axios.get(
            `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat}%2C${long}&limit=20&apiKey=${apiKey}`
          );
        console.log(response.data.items[0])
        if (response.data.items.length === 0) {
            dispatch({
                type: REVERSE_GEOCODE_FAIL,
                payload: "No address found",
            });
        } else {
          dispatch({
            type: REVERSE_GEOCODE_SUCCESS,
            payload: response.data.items[0],
          })
            }
    } catch(error) {
        dispatch({
            type: REVERSE_GEOCODE_FAIL,
            payload: error.response.data.message,
        });
    }
}

export const forwardCode = (addressed) => async (dispatch) => {

    try {
        dispatch({ type: FORWARD_GEOCODE_REQUEST})
        const response = await axios.get(
            `https://geocode.search.hereapi.com/v1/geocode?q=${addressed}&in=countryCode:PHL&apiKey=${apiKey}`
          );

        if (response.data.items.length === 0) {
            dispatch({
                type: FORWARD_GEOCODE_FAIL,
                payload: "No address found",
            });
        } else {
          dispatch({
            type: FORWARD_GEOCODE_SUCCESS,
            payload: response.data.items
          })
            }
    } catch(error) {
        dispatch({
            type: FORWARD_GEOCODE_FAIL,
            payload: error.response.data.message,
        });
    }
}

export const fetchRoute = (destination, origin) => async (dispatch) => {

  try {
    dispatch({ type: FETCH_ROUTE_REQUEST });
    const response = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${origin.longitude},${origin.latitude};${Number(destination.long)},${Number(destination.lat)}?alternatives=true&geometries=geojson&access_token=${mapBoxKey}`
    );
    dispatch({
      type: FETCH_ROUTE_SUCCESS,
      payload: response.data.routes,
    });
  } catch (error) {
    dispatch({
      type: FETCH_ROUTE_FAIL,
      payload: error.response.data.message,
    });
  }
}