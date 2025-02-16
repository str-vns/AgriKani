import {
    CREATE_CANCELLED_REQUEST,
    CREATE_CANCELLED_SUCCESS,
    CREATE_CANCELLED_FAIL,
    CANCELLED_ORDER_REQUEST,
    CANCELLED_ORDER_SUCCESS,
    CANCELLED_ORDER_FAIL,
  } from "../Constants/cancelledConstants";

export const cancelledReducerApi = (state = [], action) => {
    switch (action.type ) {
        case CREATE_CANCELLED_REQUEST:
                    return { loading: true };
        case CREATE_CANCELLED_SUCCESS:
                    return { loading: false, response: action.payload };
        case CREATE_CANCELLED_FAIL:
                    return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export const cancelledReducer = (state = [], action) => {
    switch (action.type ) {
        case CANCELLED_ORDER_REQUEST:
            return { loading: true };
        case CANCELLED_ORDER_SUCCESS:
            return { loading: false, response: action.payload };
        case CANCELLED_ORDER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
