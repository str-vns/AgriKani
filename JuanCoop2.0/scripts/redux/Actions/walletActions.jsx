import axios from 'axios';
import {
    CREATE_WALLET_REQUEST,
    CREATE_WALLET_SUCCESS,
    CREATE_WALLET_FAIL,
    GET_WALLET_REQUEST,
    GET_WALLET_SUCCESS,
    GET_WALLET_FAIL,
 } from '../Constants/walletConstants';
import baseURL from '@assets/commons/baseurl';

export const getWallet = (userId,  token) => async (dispatch) => {
    try {
        dispatch({ type: GET_WALLET_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
        }

        const { data } = await axios.get(`${baseURL}wallet/${userId}`, config)

        dispatch({
            type: GET_WALLET_SUCCESS,
            payload: data.details
        })

        return data.details
    } catch (error) {
        dispatch({
            type: GET_WALLET_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}