import {
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,
  CATEGORY_CREATE_REQUEST,
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_CREATE_FAIL,
  CATEGORY_EDIT_REQUEST,
  CATEGORY_EDIT_SUCCESS,
  CATEGORY_EDIT_FAIL,
  CATEGORY_DELETE_REQUEST,
  CATEGORY_DELETE_SUCCESS,
  CATEGORY_DELETE_FAIL,
  CATEGORY_CLEAR_ERRORS,
} from "../Constants/categoryConstants";

import baseURL from "@assets/commons/baseurl";
import axios from "axios";
import mime from "mime"; // Ensure mime package is installed

export const categoryList = () => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_LIST_REQUEST });

    const { data } = await axios.get(`${baseURL}category`);
    dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: data.details, // Assuming `data.details` contains the list of categories
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    console.error("Category List Error:", error.message || error.response?.data);
  }
};

export const categoryCreate = (categoryData, image, token) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_CREATE_REQUEST });

    const formData = new FormData();
    formData.append("categoryName", categoryData.categoryName);

    if (image?.uri) {
     
      const newImageUri = "file:///" + image.uri.split("file:/").join("");

      formData.append("image", {
        uri: newImageUri,
        type: mime.getType(newImageUri), // Get MIME type dynamically
        name: newImageUri.split("/").pop(), // Extract the file name
      });
    } else {
      console.error("Invalid image file:", image);
      throw new Error("Invalid image file.");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    console.log("🚀 Sending category create request with image...");
    const { data } = await axios.post(`${baseURL}category`, formData, config);
    console.log("✅ Category created successfully:", data);

    dispatch({ type: CATEGORY_CREATE_SUCCESS, payload: data });

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("❌ Error creating category:", errorMessage);

    dispatch({
      type: CATEGORY_CREATE_FAIL,
      payload: errorMessage,
    });
  }
};

export const categoryEdit = (id, categoryData, image, token) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_EDIT_REQUEST });

    const formData = new FormData();
    formData.append("categoryName", categoryData.categoryName);

    if (image?.uri) {
      // Ensure the image URI is correctly formatted for FormData
      const newImageUri = "file:///" + image.uri.split("file:/").join("");

      formData.append("image", {
        uri: newImageUri,
        type: mime.getType(newImageUri), // Get MIME type dynamically
        name: newImageUri.split("/").pop(), // Extract file name
      });
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    console.log("🚀 Sending category edit request with image...");
    const { data } = await axios.put(`${baseURL}category/${id}`, formData, config);
    console.log("✅ Category updated successfully:", data);

    dispatch({
      type: CATEGORY_EDIT_SUCCESS,
      payload: data,
    });

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("❌ Error updating category:", errorMessage);

    dispatch({
      type: CATEGORY_EDIT_FAIL,
      payload: errorMessage,
    });
  }
};

export const categoryDelete = (id) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_DELETE_REQUEST });

    const { data } = await axios.delete(`${baseURL}category/${id}`);
    dispatch({
      type: CATEGORY_DELETE_SUCCESS,
      payload: data.details,
    });
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message || error.message
      : "An unexpected error occurred.";
    dispatch({
      type: CATEGORY_DELETE_FAIL,
      payload: errorMessage,
    });
    console.error("Category Delete Error:", errorMessage);
  }
};


