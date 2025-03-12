import axios from "axios";
import {
  POST_REQUEST,
  POST_SUCCESS,
  POST_FAIL,
  GET_POST_REQUEST,
  GET_POST_SUCCESS,
  GET_POST_FAIL,
  GET_POST_USER_REQUEST,
  GET_POST_USER_SUCCESS,
  GET_POST_USER_FAIL,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAIL,
  POST_DELETE_REQUEST,
  POST_DELETE_SUCCESS,
  POST_DELETE_FAIL,
  POST_SOFTDELETE_REQUEST,
  POST_SOFTDELETE_SUCCESS,
  POST_SOFTDELETE_FAIL,
  POST_RESTORE_REQUEST,
  POST_RESTORE_SUCCESS,
  POST_RESTORE_FAIL,
  POST_LIKE_REQUEST,
  POST_LIKE_SUCCESS,
  POST_LIKE_FAIL,
  POST_APPROVE_REQUEST,
  POST_APPROVE_SUCCESS,
  POST_APPROVE_FAILURE,
  FETCH_APPROVED_POSTS_REQUEST,
  FETCH_APPROVED_POSTS_SUCCESS,
  FETCH_APPROVED_POSTS_FAIL,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAIL,
  GET_COMMENTS_REQUEST,
  GET_COMMENTS_SUCCESS,
  GET_COMMENTS_FAIL,
  POST_IMAGE_DELETE_REQUEST,
  POST_IMAGE_DELETE_SUCCESS,
  POST_IMAGE_DELETE_FAIL,
  CLEAR_ERRORS,
} from "../Constants/postConstants";
import baseURL from "@assets/commons/baseurl";

export const createPost = (formData) => async (dispatch) => {
  try {
    dispatch({ type: POST_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data", // Required for FormData
      },
    };

    const { data } = await axios.post(`${baseURL}p/create`, formData, config);

    dispatch({
      type: POST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: POST_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

export const getPost = () => async (dispatch) => {
  try {
    dispatch({ type: GET_POST_REQUEST });

    const { data } = await axios.get(`${baseURL}p`);

    dispatch({
      type: GET_POST_SUCCESS,
      payload: data.details,
    });
  } catch (error) {
    dispatch({
      type: GET_POST_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

export const fetchApprovedPosts = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_APPROVED_POSTS_REQUEST });

    // Make an API call to fetch approved posts
    const { data } = await axios.get(`${baseURL}/approve/p`);

    dispatch({
      type: FETCH_APPROVED_POSTS_SUCCESS,
      payload: data.details || [], // Assuming the approved posts are in `data.data`
    });
  } catch (error) {
    dispatch({
      type: FETCH_APPROVED_POSTS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getUserPost = (userId) => async (dispatch) => {
  try {
    dispatch({ type: GET_POST_USER_REQUEST });

    const { data } = await axios.get(`${baseURL}p/user/${userId}`);

    dispatch({
      type: GET_POST_USER_SUCCESS,
      payload: data.details,
    });
  } catch (error) {
    dispatch({
      type: GET_POST_USER_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

export const updatePost = (id, postData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_POST_REQUEST });

    // Create FormData object
    const formData = new FormData();
    formData.append("content", postData.content);
    formData.append("author", postData.author);

    // Append images to FormData
    postData.images.forEach((image, index) => {
      formData.append("image", {
        uri: image, // URI of the image
        type: "image/jpeg", // You can adjust this based on your file type
        name: `image_${index + 1}.jpg`, // Provide a unique name for each file
      });
    });

    // Send FormData to server
    const { data } = await axios.put(`${baseURL}p/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Required for FormData
      },
    });

    dispatch({
      type: UPDATE_POST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_POST_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    dispatch({ type: POST_DELETE_REQUEST });

    await axios.delete(`${baseURL}p/${id}`);

    dispatch({ type: POST_DELETE_SUCCESS, payload: id });
    return Promise.resolve(); // Indicate success
  } catch (error) {
    dispatch({
      type: POST_DELETE_FAIL,
      payload: error.response?.data || error.message,
    });
    return Promise.reject(error); // Indicate failure
  }
};

// Redux Action for Soft Delete Post
export const softDeletePost = (id) => async (dispatch) => {
  try {
    dispatch({ type: POST_SOFTDELETE_REQUEST });

    const response = await axios.patch(`${baseURL}p/${id}`);

    dispatch({
      type: POST_SOFTDELETE_SUCCESS,
      payload: id, // The ID of the soft-deleted post
    });
  } catch (error) {
    dispatch({
      type: POST_SOFTDELETE_FAIL,
      payload: error.response ? error.response.data : error.message,
    });
  }
};

export const restorePost = (id) => async (dispatch) => {
  try {
    dispatch({ type: POST_RESTORE_REQUEST });

    const response = await axios.patch(`${baseURL}restore/p/${id}`);

    dispatch({
      type: POST_RESTORE_SUCCESS,
      payload: id, // The ID of the restored post
    });
  } catch (error) {
    dispatch({
      type: POST_RESTORE_FAIL,
      payload: error.response ? error.response.data : error.message,
    });
  }
};

export const likePost = (id, userId) => async (dispatch) => {
  try {
    dispatch({ type: POST_LIKE_REQUEST });

    // Ensure the correct backend endpoint
    const response = await axios.post(`${baseURL}p/like/${id}`, { user: userId });

    dispatch({
      type: POST_LIKE_SUCCESS,
      payload: response.data, // Backend should return updated post data
    });
  } catch (error) {
    dispatch({
      type: POST_LIKE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Action to approve the post
export const approvePost = (id) => async (dispatch) => {
  try {
    dispatch({ type: POST_APPROVE_REQUEST });

    const response = await axios.put(`${baseURL}p/approve/${id}`, {
      status: "approved",
    });
    dispatch({ type: POST_APPROVE_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: POST_APPROVE_FAILURE,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// ADD COMMENT
export const addComment = (comment, token) => async (dispatch) => {
  console.log("Comment function triggered. Data:", comment);
  
  try {
    dispatch({ type: ADD_COMMENT_REQUEST });

    const commentData = {
      user: comment.user,
      post: comment.post,
      comment: comment.comment,
    };

    console.log("Sending commentData:", commentData);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(`${baseURL}post/comment`, commentData, config);

    console.log("Response received:", data);

    if (data.success) {
      dispatch({
        type: ADD_COMMENT_SUCCESS,
        payload: data.details,
      });
      return { success: true, comment: data.details };
    } else {
      dispatch({
        type: ADD_COMMENT_FAIL,
        payload: data.message,
      });
    }

  } catch (error) {
    console.error("Error submitting comment:", error.response?.data || error.message);
    dispatch({
      type: ADD_COMMENT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// GET COMMENTS
export const getComments = (postId) => async (dispatch) => {
  try {
    dispatch({ type: GET_COMMENTS_REQUEST });

    const { data } = await axios.get(`${baseURL}post/${postId}`);

    dispatch({ type: GET_COMMENTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_COMMENTS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const imagePostDel = (postId, imageId) => async (dispatch) => {
  try {
    dispatch({ type: POST_IMAGE_DELETE_REQUEST });

    const { data } = await axios.put(`${baseURL}p/image/${postId}/${imageId}`);
    
    dispatch({ 
      type: POST_IMAGE_DELETE_SUCCESS,
      payload: data 
    });
  } catch (error) {
    dispatch({
      type: POST_IMAGE_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
