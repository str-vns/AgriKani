import {
  COOP_REGISTER_FAIL,
  COOP_REGISTER_REQUEST,
  COOP_REGISTER_SUCCESS,
  COOP_IMAGE_DELETE_FAIL,
  COOP_IMAGE_DELETE_REQUEST,
  COOP_IMAGE_DELETE_SUCCESS,
  COOP_UPDATE_FAIL,
  COOP_UPDATE_REQUEST,
  COOP_UPDATE_SUCCESS,
  COOP_ALL_FAIL,
  COOP_ALL_REQUEST,
  COOP_ALL_SUCCESS,
  COOP_ALL_ORDERS_FAIL,
  COOP_ALL_ORDERS_REQUEST,
  COOP_ALL_ORDERS_SUCCESS,
  COOP_UPDATE_ORDERS_FAIL,
  COOP_UPDATE_ORDERS_REQUEST,
  COOP_UPDATE_ORDERS_SUCCESS,
  COOP_SINGLE_FAIL,
  COOP_SINGLE_REQUEST,
  COOP_SINGLE_SUCCESS,
  COOP_MATCH_FAIL,
  COOP_MATCH_REQUEST,
  COOP_MATCH_SUCCESS,
  INACTIVE_COOP_FAIL,
  INACTIVE_COOP_REQUEST,
  INACTIVE_COOP_SUCCESS,
  COOP_ACTIVE_FAIL,
  COOP_ACTIVE_REQUEST,
  COOP_ACTIVE_SUCCESS,
  COOP_DELETE_FAIL,
  COOP_DELETE_REQUEST,
  COOP_DELETE_SUCCESS,
} from "../Constants/coopConstants";
import axios from "axios";
import baseURL from "@assets/commons/baseurl";
import mime from "mime";

export const registerCoop = (coop, token) => async (dispatch) => {
  console.log("coop", coop);
  try {
    dispatch({ type: COOP_REGISTER_REQUEST });
    const newBusi = "file:///" + coop?.businessPermit.split("file:/").join("");
    const newCorCDA = "file:///" + coop?.corCDA.split("file:/").join("");
    const newOrg = "file:///" + coop?.orgStructures.split("file:/").join("");
    const formData = new FormData();

    formData.append("farmName", coop?.farmName);
    formData.append("address", coop?.address);
    formData.append("barangay", coop?.barangay);
    formData.append("city", coop?.city);
    formData.append("postalCode", coop?.postalCode);
    formData.append("latitude", coop?.latitude);
    formData.append("longitude", coop?.longitude);
    formData.append("user", coop?.user);
    formData.append("tinNumber", coop?.tinNumber);
    coop?.image.forEach((imageUri) => {
      const newImageUri = "file:///" + imageUri.split("file:/").join("");
      formData.append("image", {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split("/").pop(),
      });
    });

    formData.append("businessPermit", {
      uri: newBusi,
      type: mime.getType(newBusi),
      name: newBusi.split("/").pop(),
    });

    formData.append("corCDA", {
      uri: newCorCDA,
      type: mime.getType(newCorCDA),
      name: newCorCDA.split("/").pop(),
    });

    formData.append("orgStructure", {
      uri: newOrg,
      type: mime.getType(newOrg),
      name: newOrg.split("/").pop(),
    });
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${baseURL}farm`, formData, config);

    dispatch({ type: COOP_REGISTER_SUCCESS, payload: data.details });
  } catch (error) {
    dispatch({
      type: COOP_REGISTER_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const UpdateCoop = (coop, token) => async (dispatch) => {
  console.log("coop", coop);

  try {
    dispatch({ type: COOP_UPDATE_REQUEST });

    const formData = new FormData();
    formData.append("farmName", coop?.farmName);
    formData.append("address", coop?.address);
    formData.append("barangay", coop?.barangay);
    formData.append("city", coop?.city);
    formData.append("postalCode", coop?.postalCode);
    formData.append("latitude", coop?.latitude);
    formData.append("longitude", coop?.longitude);

    if (coop?.image?.length) {
      coop?.image.forEach((imageUri) => {
        const newImageUri = "file:///" + imageUri.split("file:/").join("");
        formData.append("image", {
          uri: newImageUri,
          type: mime.getType(newImageUri),
          name: newImageUri.split("/").pop(),
        });
      });
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    };

    const { data } = await axios.put(
      `${baseURL}farm/${coop.id}`,
      formData,
      config
    );

    dispatch({ type: COOP_UPDATE_SUCCESS, payload: data.details });
  } catch (error) {
    dispatch({
      type: COOP_UPDATE_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const deleteCoopImage = (farmId, imageId, token) => async (dispatch) => {
  try {
    dispatch({ type: COOP_IMAGE_DELETE_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Assuming you are updating something on the server to mark the image as deleted
    const { data } = await axios.put(
      `${baseURL}farm/image/${farmId}/${imageId}`,
      {},
      config
    );

    dispatch({ type: COOP_IMAGE_DELETE_SUCCESS, payload: data.details });
  } catch (error) {
    dispatch({
      type: COOP_IMAGE_DELETE_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const allCoops = (token) => async (dispatch) => {
  try {
    dispatch({ type: COOP_ALL_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${baseURL}farm`, config);

    dispatch({ type: COOP_ALL_SUCCESS, payload: data.details });
  } catch (error) {
    dispatch({
      type: COOP_ALL_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const allCoopOrders = (coopId, token) => async (dispatch) => {
  try {
    dispatch({ type: COOP_ALL_ORDERS_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${baseURL}coop/orders/${coopId}`, config);

    dispatch({ type: COOP_ALL_ORDERS_SUCCESS, payload: data.details });
  } catch (error) {
    dispatch({
      type: COOP_ALL_ORDERS_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const updateCoopOrders = (orderId, prod, token) => async (dispatch) => {
  console.log("prod", prod);
  try {
    dispatch({ type: COOP_UPDATE_ORDERS_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    };

    const { data } = await axios.patch(
      `${baseURL}coop/orders/edit/${orderId}`,
      prod,
      config
    );

    dispatch({ type: COOP_UPDATE_ORDERS_SUCCESS, payload: data.details });
  } catch (error) {
    dispatch({
      type: COOP_UPDATE_ORDERS_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const singleCooperative = (coopId, token) => async (dispatch) => {
  try {
    dispatch({ type: COOP_SINGLE_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${baseURL}coop/${coopId}`, config);

    dispatch({ type: COOP_SINGLE_SUCCESS, payload: data.details });
  } catch (error) {
    dispatch({
      type: COOP_SINGLE_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const matchCooperative = (token) => async (dispatch) => {
  try {
    dispatch({ type: COOP_MATCH_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${baseURL}coop`, config);

    dispatch({ type: COOP_MATCH_SUCCESS, payload: data.details });
  } catch (error) {
    dispatch({
      type: COOP_MATCH_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const inactiveCooperative = (token) => async (dispatch) => {
  try {
    dispatch({ type: INACTIVE_COOP_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${baseURL}no-approve/coop`, config);

    dispatch({ type: INACTIVE_COOP_SUCCESS, payload: data.details });
  } catch (error) {
    dispatch({
      type: INACTIVE_COOP_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const activeCooperative =
  (coopId, userId, token) => async (dispatch) => {
    try {
      dispatch({ type: COOP_ACTIVE_REQUEST });

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const payload = { userId };

      const { data } = await axios.patch(
        `${baseURL}yes-approve/coop/${coopId}`,
        payload,
        config
      );

      dispatch({ type: COOP_ACTIVE_SUCCESS, payload: data.details });
    } catch (error) {
      dispatch({
        type: COOP_ACTIVE_FAIL,
        payload: error.response ? error.response.data.message : error.message,
      });
    }
  };

export const deleteCooperative = (coopId, token) => async (dispatch) => {
  try {
    dispatch({ type: COOP_DELETE_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(
      `${baseURL}disapprove/coop/${coopId}`,
      config
    );

    dispatch({ type: COOP_DELETE_SUCCESS, payload: data.details });
  } catch (error) {
    dispatch({
      type: COOP_DELETE_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};
