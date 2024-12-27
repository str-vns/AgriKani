import {
    CREATE_DRIVER_REQUEST,
    CREATE_DRIVER_SUCCESS,
    CREATE_DRIVER_FAIL,
    DRIVER_APPROVED_REQUEST,
    DRIVER_APPROVED_SUCCESS,
    DRIVER_APPROVED_FAIL,
    DRIVER_REJECTED_REQUEST,
    DRIVER_REJECTED_SUCCESS,
    DRIVER_REJECTED_FAIL,
    DRIVER_LIST_REQUEST,
    DRIVER_LIST_SUCCESS,
    DRIVER_LIST_FAIL,
    DRIVER_LIST_DISAPPROVED_REQUEST,
    DRIVER_LIST_DISAPPROVED_SUCCESS,
    DRIVER_LIST_DISAPPROVED_FAIL,
    SINGLE_DRIVER_REQUEST,
    SINGLE_DRIVER_SUCCESS,
    SINGLE_DRIVER_FAIL,
    DELETE_DRIVER_REQUEST,
    DELETE_DRIVER_SUCCESS,
    DELETE_DRIVER_FAIL,
    ONLY_APPROVED_DRIVER_REQUEST,
    ONLY_APPROVED_DRIVER_SUCCESS,
    ONLY_APPROVED_DRIVER_FAIL,
    CLEAR_ERRORS,
} from "../Constants/driverConstants";
import axios from "axios";
import baseURL from "@assets/commons/baseurl";
import mime from "mime"; 

export const createDriver = (driver, token) => async (dispatch) => {
    console.log(driver.riderRegister, "driver");
    const driverInfo = driver.riderRegister;
    try {
        dispatch({ type: CREATE_DRIVER_REQUEST });
        const newImage = "file:///" + driverInfo?.image.split("file:/").join("");
        const newDriversLicenseImagee = "file:///" + driverInfo?.driversLicenseImage.split("file:/").join("");
        const formData = new FormData();

        formData.append("firstName", driverInfo?.firstName);
        formData.append("lastName", driverInfo?.lastName);
        formData.append("password", driverInfo?.password);
        formData.append("phoneNum", driverInfo?.phoneNum);
        formData.append("email", driverInfo?.email);
        formData.append("gender", driverInfo?.gender);
        formData.append("age", driverInfo?.age);
        formData.append("user", driverInfo?.user);
        formData.append("otp", driver.otp);
        formData.append("image", {
            uri: newImage,
            type: mime.getType(newImage),
            name: newImage.split("/").pop(),
        });
        formData.append("driversLicenseImage", {
            uri: newDriversLicenseImagee,
            type: mime.getType(newDriversLicenseImagee),
            name: newDriversLicenseImagee.split("/").pop(),
        });

        const { data } = await axios.post(`${baseURL}driver`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        dispatch({ type: CREATE_DRIVER_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: CREATE_DRIVER_FAIL,
            payload: error.response ? error.response.data : error.message,
        });
    }
}

export const listDriver  = (token) => async (dispatch) => {
    try {
        dispatch({ type: DRIVER_LIST_REQUEST });
        const { data } = await axios.get(`${baseURL}driver`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({ type: DRIVER_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: DRIVER_LIST_FAIL,
            payload: error.response ? error.response.data : error.message,
        });
    }
}

export const listDriverDisapproved = (token) => async (dispatch) => {
    try {
        dispatch({ type: DRIVER_LIST_DISAPPROVED_REQUEST });
        const { data } = await axios.get(`${baseURL}driver/disapproved`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({ type: DRIVER_LIST_DISAPPROVED_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: DRIVER_LIST_DISAPPROVED_FAIL,
            payload: error.response ? error.response.data : error.message,
        });
    }
}

export const driverApproved = (driverId, token) => async (dispatch) => {
    try {
        dispatch({ type: DRIVER_APPROVED_REQUEST });
        const { data } = await axios.patch(`${baseURL}driver/approved/${driverId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({ type: DRIVER_APPROVED_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: DRIVER_APPROVED_FAIL,
            payload: error.response ? error.response.data : error.message,
        });
    }
}

export const driverRejected = (driverId, token) => async (dispatch) => {
    try {
        dispatch({ type: DRIVER_REJECTED_REQUEST });
        const { data } = await axios.patch(`${baseURL}driver/disapproved/${driverId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({ type: DRIVER_REJECTED_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: DRIVER_REJECTED_FAIL,
            payload: error.response ? error.response.data : error.message,
        });
    }
}

export const removeDriver = (driverId, token) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_DRIVER_REQUEST });
        const { data } = await axios.delete(`${baseURL}driver/${driverId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({ type: DELETE_DRIVER_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: DELETE_DRIVER_FAIL,
            payload: error.response ? error.response.data : error.message,
        });
    }
}

export const singleDriver = (driverId, token) => async (dispatch) => {
    try {
        dispatch({ type: SINGLE_DRIVER_REQUEST });
        const { data } = await axios.get(`${baseURL}driver/${driverId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({ type: SINGLE_DRIVER_SUCCESS, payload: data.details });
    } catch (error) {
        dispatch({
            type: SINGLE_DRIVER_FAIL,
            payload: error.response ? error.response.data : error.message,
        });
    }
}

export const approveDriverOnly = (driverId, token) => async (dispatch) => {
    try {
        dispatch({ type: ONLY_APPROVED_DRIVER_REQUEST });
        const { data } = await axios.get(`${baseURL}driver/coop/approved/${driverId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch({ type: ONLY_APPROVED_DRIVER_SUCCESS, payload: data.details });
    } catch (error) {
        dispatch({
            type: ONLY_APPROVED_DRIVER_FAIL,
            payload: error.response ? error.response.data : error.message,
        });
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS

    })
}