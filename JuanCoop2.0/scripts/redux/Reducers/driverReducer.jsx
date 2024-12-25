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
    CLEAR_ERRORS,
} from "../Constants/driverConstants";

export const driverApiReducer = (state = { drivers: [] }, action) => {
    switch( action.type ) {
        case CREATE_DRIVER_REQUEST:
        case DRIVER_APPROVED_REQUEST:
        case DRIVER_REJECTED_REQUEST:
        case DELETE_DRIVER_REQUEST:
            return { ...state, loading: true };
        case CREATE_DRIVER_SUCCESS:
        case DRIVER_APPROVED_SUCCESS:
        case DRIVER_REJECTED_SUCCESS:
        case DELETE_DRIVER_SUCCESS:
            return { loading: false, success: action.payload };
        case CREATE_DRIVER_FAIL:
        case DRIVER_APPROVED_FAIL:
        case DRIVER_REJECTED_FAIL:
        case DELETE_DRIVER_FAIL:
            return { loading: false, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }   
}

export const driverListReducer = (state = { drivers: [] }, action) => {
    switch( action.type ) {
        case DRIVER_LIST_REQUEST:
        case DRIVER_LIST_DISAPPROVED_REQUEST:
        case SINGLE_DRIVER_REQUEST:
            return { loading: true, drivers: [] };
        case DRIVER_LIST_SUCCESS:
        case DRIVER_LIST_DISAPPROVED_SUCCESS:
        case SINGLE_DRIVER_SUCCESS:
            return { loading: false, drivers: action.payload };
        case DRIVER_LIST_FAIL:
        case DRIVER_LIST_DISAPPROVED_FAIL:
        case SINGLE_DRIVER_FAIL:
            return { loading: false, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
}
