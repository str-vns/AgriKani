import 
{
    CREATE_TRANSACTION_REQUEST,
    CREATE_TRANSACTION_SUCCESS,
    CREATE_TRANSACTION_FAIL,
    GET_PENDING_TRANSACTIONS_REQUEST,
    GET_PENDING_TRANSACTIONS_SUCCESS,
    GET_PENDING_TRANSACTIONS_FAIL,
    GET_SUCCESS_TRANSACTIONS_REQUEST,
    GET_SUCCESS_TRANSACTIONS_SUCCESS,
    GET_SUCCESS_TRANSACTIONS_FAIL,
    GET_SINGLE_TRANSACTION_REQUEST,
    GET_SINGLE_TRANSACTION_SUCCESS,
    GET_SINGLE_TRANSACTION_FAIL,
    GET_UPDATE_WITHDRAW_REQUEST,
    GET_UPDATE_WITHDRAW_SUCCESS,
    GET_UPDATE_WITHDRAW_FAIL,
    GET_USER_WITHDRAWS_REQUEST,
    GET_USER_WITHDRAWS_SUCCESS,
    GET_USER_WITHDRAWS_FAIL,
} from '../Constants/transactionConstants';
import axios from 'axios';
import baseURL from '@assets/commons/baseurl'

export const createTransaction = (transaction, token) => async (dispatch) =>{
    try {
        dispatch({ type: CREATE_TRANSACTION_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
        }

        const { data } = await axios.post(`${baseURL}/transaction`, transaction, config)

        dispatch({
            type: CREATE_TRANSACTION_SUCCESS,
            payload: data.details
        })

        return true
    } catch (error) {
        dispatch({
            type: CREATE_TRANSACTION_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
        return false
    }
}

export const singleTransaction = (userId, token) => async (dispatch) => {
    console.log(userId)
    try {
        dispatch({ type: GET_SINGLE_TRANSACTION_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
        }

        const { data } = await axios.get(`${baseURL}transaction/user/${userId}`, config)
        console.log("test",data.details)
        dispatch({
            type: GET_SINGLE_TRANSACTION_SUCCESS,
            payload: data.details
        })

        return data.details
    } catch (error) {
        dispatch({
            type: GET_SINGLE_TRANSACTION_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const getPendingTransactions = (token) => async (dispatch) => {
    try {
        dispatch({ type: GET_PENDING_TRANSACTIONS_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
        }

        const { data } = await axios.get(`${baseURL}transaction/pending`, config)

        dispatch({
            type: GET_PENDING_TRANSACTIONS_SUCCESS,
            payload: data.details
        })

        return data.details
    } catch (error) {
        dispatch({
            type: GET_PENDING_TRANSACTIONS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const getSuccessTransactions = (token) => async (dispatch) => {
    try {
        dispatch({ type: GET_SUCCESS_TRANSACTIONS_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
        }

        const { data } = await axios.get(`${baseURL}transaction/success`, config)

        dispatch({
            type: GET_SUCCESS_TRANSACTIONS_SUCCESS,
            payload: data.details
        })

        return data.details
    } catch (error) {
        dispatch({
            type: GET_SUCCESS_TRANSACTIONS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const updateWithdraw = (transactionId,transData, token) => async (dispatch) => {
    try {
        dispatch({ type: GET_UPDATE_WITHDRAW_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
        }

        const { data } = await axios.put(`${baseURL}transaction/${transactionId}`, transData , config)

        dispatch({
            type: GET_UPDATE_WITHDRAW_SUCCESS,
            payload: data.details
        })

        return data.details
    } catch (error) {
        dispatch({
            type: GET_UPDATE_WITHDRAW_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

