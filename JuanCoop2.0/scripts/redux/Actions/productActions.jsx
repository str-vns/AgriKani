import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    SINGLE_COOP_REQUEST,
    SINGLE_COOP_SUCCESS,
    SINGLE_COOP_FAIL,
    ALL_PRODUCT_COOP_FAIL,
    ALL_PRODUCT_COOP_REQUEST,
    ALL_PRODUCT_COOP_SUCCESS,
    CREATE_PRODUCT_FAIL,
    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    DELETE_PRODUCT_IMAGE_FAIL,
    DELETE_PRODUCT_IMAGE_REQUEST,
    DELETE_PRODUCT_IMAGE_SUCCESS,
    SOFTDELETE_PRODUCT_FAIL,
    SOFTDELETE_PRODUCT_REQUEST,
    SOFTDELETE_PRODUCT_SUCCESS,
    RESTORE_PRODUCT_FAIL,
    RESTORE_PRODUCT_REQUEST,
    RESTORE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    ARCHIVE_PRODUCT_FAIL,
    ARCHIVE_PRODUCT_REQUEST,
    ARCHIVE_PRODUCT_SUCCESS,
    GET_SINGLE_PRODUCT_FAIL,
    GET_SINGLE_PRODUCT_REQUEST,
    GET_SINGLE_PRODUCT_SUCCESS,
    PRODUCT_ACTIVE_FAIL,
    PRODUCT_ACTIVE_REQUEST,
    PRODUCT_ACTIVE_SUCCESS,
    CLEAR_ERRORS,
  } from "@redux/Constants/productConstants";
  import baseURL from "@assets/commons/baseurl";
  import axios from "axios";
  import Toast from "react-native-toast-message";
  import mime from "mime";
  
  
  export const getProduct = () => async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCT_REQUEST });
  
      const { data } = await axios.get(`${baseURL}products`);
      dispatch({
        type: ALL_PRODUCT_SUCCESS,
        payload: data.details,
      });
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
  
      dispatch({
        type: ALL_PRODUCT_FAIL,
        payload: errorMessage,
      });
  
      console.log("Error from GetProduct", errorMessage);
    }
  };
  
  export const getCoop = (userId) => async (dispatch) => {
    try {
      dispatch({ type: SINGLE_COOP_REQUEST });
  
      const { data } = await axios.get(`${baseURL}farm/${userId}`);
      dispatch({
        type: SINGLE_COOP_SUCCESS,
        payload: data.details,
      });
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
  
      dispatch({
        type: SINGLE_COOP_FAIL,
        payload: errorMessage,
      });
  
      console.log("Error from getCoop", errorMessage);
    }
  };
  
  export const getCoopProducts = (coopId) => async (dispatch) => {
  
    try {
      dispatch({ type: ALL_PRODUCT_COOP_REQUEST });
  
      const { data } = await axios.get(`${baseURL}products/coop/${coopId}`);
      dispatch({
        type: ALL_PRODUCT_COOP_SUCCESS,
        payload: data.details,
      });
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
  
      dispatch({
        type: ALL_PRODUCT_COOP_FAIL,
        payload: errorMessage,
      });
  
      console.log("Error from getCoopProducts", errorMessage);
    }
  };
  
  export const createCoopProducts = (product, token) => async (dispatch) => {
    try {
      dispatch({ type: CREATE_PRODUCT_REQUEST });
  
      const formData = new FormData();
  
      formData.append("productName", product?.productName);
      formData.append("description", product?.description);
      formData.append("stock", product?.stock);
      formData.append("pricing", product?.price);
      formData.append("user", product?.user);
      product?.category.forEach((category) => {
        formData.append("category", category);
      }),
        product?.type.forEach((type) => {
          formData.append("type", type);
        }),
        product?.image.forEach((imageUri) => {
          const newImageUri = "file:///" + imageUri.split("file:/").join("");
          formData.append("image", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop(),
          });
        });
  
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
  
      const { data } = await axios.post(`${baseURL}products`, formData, config);
  
      dispatch({ type: CREATE_PRODUCT_SUCCESS, payload: data.details });
    } catch (error) {
      dispatch({
        type: CREATE_PRODUCT_FAIL,
        payload: error.response.data.message,
      });
    }
  };
  
  export const updateCoopProducts = (productId, product, token) => async (dispatch) => {
    console.log(product.image, "image");
  
    try {
      dispatch({ type: UPDATE_PRODUCT_REQUEST });
  
      const formData = new FormData();
      formData.append("productName", product?.productName);
      formData.append("description", product?.description);
      formData.append("stock",   
   product?.stock);
      formData.append("pricing", product?.pricing);
  
      product?.category.forEach((category) => {
        formData.append("category", category);
        console.log("Adding category:", category);
      });
  
      product?.type.forEach((type) => {
        formData.append("type", type);
        console.log("Adding type", type);
      });
  
      if (product?.image?.length) {
        product?.image.forEach((imageUri) => {
          const newImageUri = "file:///" + imageUri.split("file:/").join("");
          formData.append("image", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop(),
          });
        });
      }
  
  
      console.log("FormData:", formData);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          
        },
        timeout: 10000,
      };
  
      const { data } = await axios.put(`${baseURL}products/edit/${productId}`, formData, config);
      dispatch({
        type: UPDATE_PRODUCT_SUCCESS,
        payload: data,
      });
  
    } catch (error) {
  
      let errorMessage = "An error occurred while updating the product.";
  
      if (error.response) {
        const { status, data } = error.response;
        errorMessage = `Error ${status}: ${data.message || "No additional information available."}`;
      } else if (error.request) {
        errorMessage = "The request was made, but no response was received.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
  
      console.error("Update product error:", errorMessage, {
        error: error.response ? error.response.data : error,
      });
  
      dispatch({
        type: UPDATE_PRODUCT_FAIL,
        payload: errorMessage,
      });
    }
  };
  
  export const imageDel = (productId, imageId)  => async (dispatch) => {
    console.log("productId", productId);
    console.log("imageId", imageId);
    try {
      dispatch({ type: DELETE_PRODUCT_IMAGE_REQUEST });
      await axios.put(`${baseURL}products/image/${productId}/${imageId}`);
      dispatch({
        type: DELETE_PRODUCT_IMAGE_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: DELETE_PRODUCT_IMAGE_FAIL,
        payload: error.response.data.message,
      });
    }
  }
  
  export const soflDelProducts = (productId) => async (dispatch) => {
    try {
      dispatch({ type: SOFTDELETE_PRODUCT_REQUEST });
  
      await axios.patch(`${baseURL}products/softdel/${productId}`);
      dispatch({
        type: SOFTDELETE_PRODUCT_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: SOFTDELETE_PRODUCT_FAIL,
        payload: error.response.data.message,
      });
    }
  }
  
  export const restoreProducts = (productId) => async (dispatch) => {
    try {
      dispatch({ type: RESTORE_PRODUCT_REQUEST });
  
      await axios.patch(`${baseURL}restore/products/${productId}`);
      dispatch({
        type: RESTORE_PRODUCT_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: RESTORE_PRODUCT_FAIL,
        payload: error.response.data.message,
      });
    }
  }
  
  export const deleteProducts = (productId) => async (dispatch) => {
    try {
      dispatch({ type: DELETE_PRODUCT_REQUEST });
  
      await axios.delete(`${baseURL}products/${productId}`);
      dispatch({
        type: DELETE_PRODUCT_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: DELETE_PRODUCT_FAIL,
        payload: error.response.data.message,
      });
    }
  }
  
  export const archiveProducts = (coopId) => async (dispatch) => {
    try {
      dispatch({ type: ARCHIVE_PRODUCT_REQUEST });
  
      const {data} = await axios.get(`${baseURL}products/archive/${coopId}`);
      dispatch({
        type: ARCHIVE_PRODUCT_SUCCESS,
        payload: data.details,
      });
    } catch (error) {
      dispatch({
        type: ARCHIVE_PRODUCT_FAIL,
        payload: error.response.data.message,
      });
    }
  }
  
  export const getSingleProduct = (productId) => async (dispatch) => {
    try {
      dispatch({ type: GET_SINGLE_PRODUCT_REQUEST });
  
      const { data } = await axios.get(`${baseURL}products/${productId}`);
      dispatch({
        type: GET_SINGLE_PRODUCT_SUCCESS,
        payload: data.details,
      });
    } catch (error) {
      dispatch({
        type: GET_SINGLE_PRODUCT_FAIL,
        payload: error.response.data.message,
      });
    }
  }
  
  export const activeProduct = (productId) => async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_ACTIVE_REQUEST });
  
      await axios.patch(`${baseURL}products/active/${productId}`);
      dispatch({
        type: PRODUCT_ACTIVE_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_ACTIVE_FAIL,
        payload: error.response.data.message,
      });
    }
  }

  export const clearErrors = () => async (dispatch) => {
    dispatch({
      type: CLEAR_ERRORS,
    });
  };
  