import { CREATE_DELIVERY_REQUEST ,
    CREATE_DELIVERY_FAIL,
    CREATE_DELIVERY_SUCCESS,
    GET_DELIVERY_TRACKING_REQUEST,
    GET_DELIVERY_TRACKING_SUCCESS,
    GET_DELIVERY_TRACKING_FAIL,
    GET_DELIVERY_DRIVER_REQUEST,
    GET_DELIVERY_DRIVER_SUCCESS,
    GET_DELIVERY_DRIVER_FAIL,
    UPDATE_DELIVERY_STATUS_REQUEST,
    UPDATE_DELIVERY_STATUS_SUCCESS,
    UPDATE_DELIVERY_STATUS_FAIL,
    QR_CODE_REQUEST,
    QR_CODE_SUCCESS,
    QR_CODE_FAIL,
    HISTORY_DELIVERY_REQUEST,
    HISTORY_DELIVERY_SUCCESS,
    HISTORY_DELIVERY_FAIL,
    COMPLETED_DELIVERY_REQUEST,
    COMPLETED_DELIVERY_SUCCESS,
    COMPLETED_DELIVERY_FAIL,
    DELIVERY_LIST_FAIL,
    DELIVERY_LIST_REQUEST,
    DELIVERY_LIST_SUCCESS,
    THIS_MONTH_DELIVERY_REQUEST,
    THIS_MONTH_DELIVERY_SUCCESS,
    THIS_MONTH_DELIVERY_FAIL,
    REMOVE_DELIVERY_REQUEST,
    REMOVE_DELIVERY_SUCCESS,
    REMOVE_DELIVERY_FAIL,
    CLEAR_ERRORS
} from "../Constants/deliveryConstants";

export const deliveryListReducer = (state = { deliveries: [] }, action) => {
    switch( action.type ) {
        case GET_DELIVERY_DRIVER_FAIL:
        case GET_DELIVERY_TRACKING_FAIL:
        case DELIVERY_LIST_FAIL:
        case THIS_MONTH_DELIVERY_FAIL:
            return { Deliveryloading: false, Deliveryerror: action.payload, deliveries: [] };
        case GET_DELIVERY_DRIVER_REQUEST:
        case GET_DELIVERY_TRACKING_REQUEST:
        case DELIVERY_LIST_REQUEST:
        case THIS_MONTH_DELIVERY_REQUEST:
            return { Deliveryloading: true, deliveries: [] };
        case GET_DELIVERY_DRIVER_SUCCESS:
        case GET_DELIVERY_TRACKING_SUCCESS:
        case DELIVERY_LIST_SUCCESS:
        case THIS_MONTH_DELIVERY_SUCCESS:
            return { Deliveryloading: false, deliveries: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
}

export const deliveryApiReducer = (state = { delivery: {} }, action) => {
   switch( action.type ) {
    case CREATE_DELIVERY_REQUEST:
    case UPDATE_DELIVERY_STATUS_REQUEST:
    case QR_CODE_REQUEST:
    case REMOVE_DELIVERY_REQUEST:
        return { Deliveryloading: true };
    case CREATE_DELIVERY_SUCCESS:
    case UPDATE_DELIVERY_STATUS_SUCCESS:
    case QR_CODE_SUCCESS:
    case REMOVE_DELIVERY_SUCCESS:
        return { Deliveryloading: false, success: action.payload };
    case CREATE_DELIVERY_FAIL:
    case UPDATE_DELIVERY_STATUS_FAIL:
    case QR_CODE_FAIL:
    case REMOVE_DELIVERY_FAIL:
        return { Deliveryloading: false, Deliveryerror: action.payload };
    case CLEAR_ERRORS:
        return { ...state, error: null };
    default:
        return state;
}
}

export const deliveryCompleteReducer = (state = { delivery: [] }, action) => {  
    switch( action.type ) {
        case COMPLETED_DELIVERY_FAIL:
            return { Deliveryloading: false, Deliveryerror: action.payload };
        case COMPLETED_DELIVERY_REQUEST:
            return { Deliveryloading: true };
        case COMPLETED_DELIVERY_SUCCESS:
            return { Deliveryloading: false, delivery: action.payload };
        default:
            return state;
    }
}

export const deliveryHistoryReducer = (state = { history: [] }, action) => {
    switch( action.type ) {
        case HISTORY_DELIVERY_FAIL:
            return { Deliveryloading: false, Deliveryerror: action.payload };
        case HISTORY_DELIVERY_REQUEST:
            return { Deliveryloading: true };
        case HISTORY_DELIVERY_SUCCESS:
            return { Deliveryloading: false, history: action.payload };
        default:
            return state;
    }
}