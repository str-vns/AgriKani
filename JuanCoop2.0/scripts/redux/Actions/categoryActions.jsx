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

export const categoryCreate = (categoryData) => async (dispatch) => {
  try {
    const response = await fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error('Failed to create category');
    }

    const data = await response.json();
    dispatch({
      type: 'CATEGORY_CREATE_SUCCESS',
      payload: data,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    dispatch({
      type: 'CATEGORY_CREATE_FAIL',
      error: error.message,
    });
  }
};


export const categoryEdit = (id, categoryData) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_EDIT_REQUEST });

    const { categoryName, image } = categoryData;
    if (!categoryName) {
      throw new Error("Category name is required.");
    }

    const formData = new FormData();
    formData.append("categoryName", categoryName);

    // Handle image if available
    if (image) {
      const imageUri = image.uri || image;  // Handle both object or string formats for image
      const imageType = mime.getType(imageUri);
      const imageName = imageUri.split("/").pop();

      const imageData = {
        uri: imageUri,
        type: imageType,
        name: imageName,
      };

      formData.append("image", imageData);
      console.log("Image Data being appended:", imageData);  // Debug log
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.put(
      `${baseURL}category/edit/${id}`,
      formData,
      config
    );

    dispatch({
      type: CATEGORY_EDIT_SUCCESS,
      payload: data.details,  // Assuming `data.details` contains the updated category details
    });
    console.log("Category updated successfully:", data.details);  // Debug log

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch({
      type: CATEGORY_EDIT_FAIL,
      payload: errorMessage,
    });
    console.error("Category Edit Error:", errorMessage);  // Detailed error log
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


