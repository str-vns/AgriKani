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
    REFUND_PENDING_REQUEST,
    REFUND_PENDING_SUCCESS,
    REFUND_PENDING_FAIL,
    REFUND_SUCCESS_REQUEST,
    REFUND_SUCCESS_SUCCESS,
    REFUND_SUCCESS_FAIL,
} from '../Constants/transactionConstants';

export const transactionAPIReducer = (state = { transactions: [] }, action) => {
    switch(action.type) {
       case CREATE_TRANSACTION_REQUEST:
        case GET_UPDATE_WITHDRAW_REQUEST:
            return { withLoading: true }
        case CREATE_TRANSACTION_SUCCESS:
            case GET_UPDATE_WITHDRAW_SUCCESS:
            return { withLoading: false, transactions: action.payload }
        case CREATE_TRANSACTION_FAIL:
            case GET_UPDATE_WITHDRAW_FAIL:
            return { withLoading: false, error: action.payload }
         default:
                return state
    }
}

export const transactionReducer = (state = { transactions: [] }, action) => {

    switch(action.type) {
        case GET_PENDING_TRANSACTIONS_REQUEST:
            case GET_SUCCESS_TRANSACTIONS_REQUEST:
                case GET_USER_WITHDRAWS_REQUEST:
                    case GET_SINGLE_TRANSACTION_REQUEST:
            return { withdrawloading: true }
        case GET_PENDING_TRANSACTIONS_SUCCESS:
            case GET_SUCCESS_TRANSACTIONS_SUCCESS:
                case GET_USER_WITHDRAWS_SUCCESS:
                    case GET_SINGLE_TRANSACTION_SUCCESS:
            return { withdrawloading: false, withdraw: action.payload }
        case GET_PENDING_TRANSACTIONS_FAIL:
            case GET_SUCCESS_TRANSACTIONS_FAIL:
                case GET_USER_WITHDRAWS_FAIL:
                    case GET_SINGLE_TRANSACTION_FAIL:
            return { withdrawloading: false, withdrawerror: action.payload }
        default:
            return state
    }
}

export const refundReducer = (state = { transactions: [] }, action) => {
    switch(action.type) {
        case REFUND_PENDING_REQUEST:
            case REFUND_SUCCESS_REQUEST:
            return { refundloading: true }
        case REFUND_PENDING_SUCCESS:
            case REFUND_SUCCESS_SUCCESS:
            return { refundloading: false, refund: action.payload }
        case REFUND_PENDING_FAIL:
            case REFUND_SUCCESS_FAIL:
            return { refundloading: false, refunderror: action.payload }
        default:
            return state
    }
}