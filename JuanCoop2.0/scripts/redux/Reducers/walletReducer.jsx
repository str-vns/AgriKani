import {
    CREATE_WALLET_REQUEST,
    CREATE_WALLET_SUCCESS,
    CREATE_WALLET_FAIL,
    GET_WALLET_REQUEST,
    GET_WALLET_SUCCESS,
    GET_WALLET_FAIL,
 } from '../Constants/walletConstants';

 export const walletReducer = (state = { wallet: {} }, action) => {
    switch (action.type) {
        case GET_WALLET_REQUEST:
            return { loading: true }
        case GET_WALLET_SUCCESS:
            return { loading: false, wallet: action.payload }
        case GET_WALLET_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
 }