import axios from "axios";
import { GET_ADDRESSES, ADD_ADDRESS, UPDATE_ADDRESS, DELETE_ADDRESS } from "../Constants/addressConstants";
import baseURL from "@assets/commons/baseurl";


export const fetchAddresses = (userId) => async (dispatch) => {
  try {
    const response = await axios.get(`${baseURL}address/${userId}`);
    dispatch({
      type: GET_ADDRESSES,
      payload: response.data.details,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
  }
};

export const addAddress = (addressData) => async (dispatch) => {
  try {
    const response = await axios.post(`${baseURL}address`, addressData);
    dispatch({
      type: ADD_ADDRESS,
      payload: response.data.details,
    });
 // Success notification
 toast.success("Address added successfully!", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
} catch (error) {
  console.error("Error adding address:", error);
     // Error notification
     toast.error("Failed to add address. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

export const updateAddress = (addressData, id) => async (dispatch) => {
  try {
    const response = await axios.put(`${baseURL}address/${id}`, addressData);
    dispatch({
      type: UPDATE_ADDRESS,
      payload: response.data.details,
    });
  } catch (error) {
    console.error("Error updating address:", error);
  }
};

export const deleteAddress = (id) => async (dispatch) => {
  try {
    await axios.delete(`${baseURL}address/${id}`);
    dispatch({
      type: DELETE_ADDRESS,
      payload: id,
    });
  } catch (error) {
    console.error("Error deleting address:", error);
  }
};