import {
    CREATE_BLOG_REQUEST,
    CREATE_BLOG_SUCCESS,
    CREATE_BLOG_FAIL,
    ALL_BLOG_REQUEST,
    ALL_BLOG_SUCCESS,
    ALL_BLOG_FAIL,
    SINGLE_BLOG_REQUEST,
    SINGLE_BLOG_SUCCESS,
    SINGLE_BLOG_FAIL,
    UPDATE_BLOG_REQUEST,
    UPDATE_BLOG_SUCCESS,
    UPDATE_BLOG_FAIL,
    DELETE_BLOG_REQUEST,
    DELETE_BLOG_SUCCESS,
    DELETE_BLOG_FAIL,
    CLEAR_ERRORS,
  } from "@redux/Constants/blogConstants";
  import axios from "axios";
  import baseURL from "@assets/commons/baseurl";
  
  // Get all blogs
  export const getBlog = () => async (dispatch) => {
    try {
      dispatch({ type: ALL_BLOG_REQUEST });
  
      const { data } = await axios.get(`${baseURL}blog`);
      dispatch({
        type: ALL_BLOG_SUCCESS,
        payload: data.details,
      });
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
  
      dispatch({
        type: ALL_BLOG_FAIL,
        payload: errorMessage,
      });
  
      console.log("Error from getAllBlogs:", errorMessage);
    }
  };
  
  // Get a single blog by ID
  export const getBlogById = (id) => async (dispatch) => {
    try {
      dispatch({ type: SINGLE_BLOG_REQUEST });
  
      const { data } = await axios.get(`${baseURL}blog/${id}`);
      dispatch({
        type: SINGLE_BLOG_SUCCESS,
        payload: data.details,
      });
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
  
      dispatch({
        type: SINGLE_BLOG_FAIL,
        payload: errorMessage,
      });
  
      console.log("Error from getBlogById:", errorMessage);
    }
  };
  
  // Create a new blog
  export const createBlog = (blogData, token) => async (dispatch) => {
    try {
      dispatch({ type: CREATE_BLOG_REQUEST });
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  
      const { data } = await axios.post(`${baseURL}blog`, blogData, config);
  
      dispatch({
        type: CREATE_BLOG_SUCCESS,
        payload: data.details,
      });
    } catch (error) {
      dispatch({
        type: CREATE_BLOG_FAIL,
        payload: error.response.data.message,
      });
    }
  };
  
  // Update a blog
  export const updateBlog = (id, blogData, token) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_BLOG_REQUEST });
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  
      const { data } = await axios.put(`${baseURL}blog/${id}`, blogData, config);
  
      dispatch({
        type: UPDATE_BLOG_SUCCESS,
        payload: data.details,
      });
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
  
      dispatch({
        type: UPDATE_BLOG_FAIL,
        payload: errorMessage,
      });
  
      console.log("Error from updateBlog:", errorMessage);
    }
  };
  
  // Delete a blog
  export const deleteBlog = (blogId, token) => async (dispatch) => {
    try {
      dispatch({ type: DELETE_BLOG_REQUEST });
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      await axios.delete(`${baseURL}blog/${blogId}`, config);
  
      dispatch({
        type: DELETE_BLOG_SUCCESS,
      });
    } catch (error) {
    
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
  
      dispatch({
        type: DELETE_BLOG_FAIL,
        payload: errorMessage,
      });
  
      console.log("Error from deleteBlog:", errorMessage);
    }
  };
  
  export const clearErrors = () => async (dispatch) => {
    dispatch({
      type: CLEAR_ERRORS,
    });
  };
  