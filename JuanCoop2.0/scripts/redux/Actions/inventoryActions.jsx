import {
  INVENTORY_CREATE_REQUEST,
  INVENTORY_CREATE_SUCCESS,
  INVENTORY_CREATE_FAIL,
  INVENTORY_UPDATE_REQUEST,
  INVENTORY_UPDATE_SUCCESS,
  INVENTORY_UPDATE_FAIL,
  INVENTORY_DELETE_REQUEST,
  INVENTORY_DELETE_SUCCESS,
  INVENTORY_DELETE_FAIL,
  INVENTORY_ACTIVE_REQUEST,
  INVENTORY_ACTIVE_SUCCESS,
  INVENTORY_ACTIVE_FAIL,
  SINGLE_INVENTORY_REQUEST,
  SINGLE_INVENTORY_SUCCESS,
  SINGLE_INVENTORY_FAIL,
} from "@redux/Constants/inventoryConstants";
import axios from "axios";
import baseURL from "@assets/commons/baseurl";


export const createInventory = (inventory, token) => async (dispatch) => {
  try {
    dispatch({ type: INVENTORY_CREATE_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${baseURL}inventory`, inventory, config);

    dispatch({
      type: INVENTORY_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: INVENTORY_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateInventory =(inventory, inventoryId, token) => async (dispatch) => {
    try {
      dispatch({ type: INVENTORY_UPDATE_REQUEST });

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${baseURL}inventory/${inventoryId}`,
        inventory,
        config
      );

      dispatch({
        type: INVENTORY_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: INVENTORY_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }};

export const deleteInventory = (inventoryId, token) => async (dispatch) => {
  try {
    dispatch({ type: INVENTORY_DELETE_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(
      `${baseURL}inventory/${inventoryId}`,
      config
    );

    dispatch({
      type: INVENTORY_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: INVENTORY_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const activeInventory = (inventoryId, token) => async (dispatch) => {
    console.log(inventoryId)
    try {
         dispatch({ type: INVENTORY_ACTIVE_REQUEST });

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.put(
                `${baseURL}inventory/active/${inventoryId}`,
                {},
                config
            );

            dispatch({
                type: INVENTORY_ACTIVE_SUCCESS,
                payload: data,
            });

    }catch(error){
        dispatch({
            type: INVENTORY_ACTIVE_FAIL,
            payload:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
          });
    }

}

export const singleInventory = (inventoryId, token) => async (dispatch) => {
  try {
    dispatch({ type: SINGLE_INVENTORY_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${baseURL}inventory/${inventoryId}`,
      config
    );

    dispatch({
      type: SINGLE_INVENTORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SINGLE_INVENTORY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
}
