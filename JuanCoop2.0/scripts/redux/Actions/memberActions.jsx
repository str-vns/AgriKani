import {
    MEMBER_LIST_REQUEST,
    MEMBER_LIST_SUCCESS,
    MEMBER_LIST_FAIL,
    MEMBER_DETAILS_REQUEST,
    MEMBER_DETAILS_SUCCESS,
    MEMBER_DETAILS_FAIL,
    MEMBER_APPROVE_REQUEST,
    MEMBER_APPROVE_SUCCESS,
    MEMBER_APPROVE_FAIL,
    MEMBER_REJECT_REQUEST,
    MEMBER_REJECT_SUCCESS,
    MEMBER_REJECT_FAIL,
    MEMBER_CREATE_REQUEST,
    MEMBER_CREATE_SUCCESS,
    MEMBER_CREATE_FAIL,
    MEMBER_ALL_REQUEST,
    MEMBER_ALL_SUCCESS,
    MEMBER_ALL_FAIL,
    MEMBER_INACTIVE_FAIL,
    MEMBER_INACTIVE_REQUEST,
    MEMBER_INACTIVE_SUCCESS,
    MEMBER_REMOVE_REQUEST,
    MEMBER_REMOVE_SUCCESS,
    MEMBER_REMOVE_FAIL,
    CLEAR_ERRORS
} from '@redux/Constants/memberConstants'
import axios from 'axios'
import baseURL from '@assets/commons/baseurl'
import mime from 'mime'


export const createMember = (member, token) => async (dispatch) => {
    console.log(member, "member")
    try {
        dispatch({ type: MEMBER_CREATE_REQUEST });

        const barangayClearance = "file:///" + member?.barangayClearance.split("file:/").join("");
        const validId = "file:///" + member?.validId.split("file:/").join("");
        const formData = new FormData();
        
        formData.append('userId', member?.userId);
        formData.append('coopId', member?.coopId);
        formData.append('address', member?.address);
        formData.append('barangay', member?.barangay);
        formData.append('city', member?.city);
        formData.append("barangayClearance",
            {
                uri: barangayClearance,
                type: mime.getType(barangayClearance),
                name: barangayClearance.split("/").pop()
            })
        formData.append("validId",
            {
                uri: validId,
                type: mime.getType(validId),
                name: validId.split("/").pop()
            })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.post(`${baseURL}member`, formData, config);

        dispatch({ type: MEMBER_CREATE_SUCCESS, payload: data.details });
    } catch (error) {
        dispatch({
            type: MEMBER_CREATE_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
}
                   
export const memberList = (coopId ,token) => async (dispatch) => {
    try {
        dispatch({ type: MEMBER_LIST_REQUEST });

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.get(`${baseURL}memberlist/${coopId}`, config);

        dispatch({ type: MEMBER_LIST_SUCCESS, payload: data.details });
    } catch (error) {
        dispatch({
            type: MEMBER_LIST_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
}

export const memberDetails = (memberId, token) => async (dispatch) => {
    try {
        dispatch({ type: MEMBER_DETAILS_REQUEST });

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.get(`${baseURL}member/${memberId}`, config);

        dispatch({ type: MEMBER_DETAILS_SUCCESS, payload: data.details });
    } catch (error) {
        dispatch({
            type: MEMBER_DETAILS_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
}

export const approveMember = (memberId, userId, token) => async (dispatch) => {
    try {
        dispatch({ type: MEMBER_APPROVE_REQUEST });

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const payload = { userId };
        const { data } = await axios.patch(`${baseURL}member/approved/${memberId}`, payload, config);

        dispatch({ type: MEMBER_APPROVE_SUCCESS, payload: data.details });
    } catch (error) {
        dispatch({
            type: MEMBER_APPROVE_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
}

export const rejectMember = (memberId, token) => async (dispatch) => {
    try {
        dispatch({ type: MEMBER_REJECT_REQUEST });

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.patch(`${baseURL}member/disapproved/${memberId}`, {}, config);

        dispatch({ type: MEMBER_REJECT_SUCCESS, payload: data.details });
    } catch (error) {
        dispatch({
            type: MEMBER_REJECT_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
}

export const memberAllList = (token) => async (dispatch) => {
    try {
        dispatch({ type: MEMBER_ALL_REQUEST });

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.get(`${baseURL}member`, config);

        dispatch({ type: MEMBER_ALL_SUCCESS, payload: data.details });
    } catch (error) {
        dispatch({
            type: MEMBER_ALL_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
}

export const memberInactive = (coopId, token) => async (dispatch) => {
   
    try {
        dispatch({ type: MEMBER_INACTIVE_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.get(`${baseURL}member/inactive/${coopId}`, config);

        dispatch({ type: MEMBER_INACTIVE_SUCCESS, payload: data.details });
    } catch (error) {
        dispatch({
            type: MEMBER_INACTIVE_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
}

export const memberRemove = (memberId, token) => async (dispatch) => {
    try {
        dispatch({ type: MEMBER_REMOVE_REQUEST });

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const { data } = await axios.delete(`${baseURL}member/${memberId}`, config);

        dispatch({ type: MEMBER_REMOVE_SUCCESS, payload: data.details });
    } catch (error) {
        dispatch({
            type: MEMBER_REMOVE_FAIL,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
}