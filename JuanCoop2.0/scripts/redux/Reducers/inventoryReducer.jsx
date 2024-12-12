import {
    INVENTORY_CREATE_REQUEST,
    INVENTORY_CREATE_SUCCESS,
    INVENTORY_CREATE_FAIL,
    INVENTORY_UPDATE_REQUEST,
    INVENTORY_UPDATE_SUCCESS,
    INVENTORY_UPDATE_FAIL,
    INVENTORY_DELETE_REQUEST,
    INVENTORY_DELETE_SUCCESS,
    INVENTORY_DELETE_FAIL,
    INVENTORY_ACTIVE_REQUEST,
    INVENTORY_ACTIVE_SUCCESS,
    INVENTORY_ACTIVE_FAIL,
} from "@redux/Constants/inventoryConstants";

export const inventoryCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case INVENTORY_CREATE_REQUEST:
            case INVENTORY_UPDATE_REQUEST:
                case INVENTORY_DELETE_REQUEST:
                    case INVENTORY_ACTIVE_REQUEST:
            return { Invloading: true };

        case INVENTORY_CREATE_SUCCESS:
            case INVENTORY_UPDATE_SUCCESS:
                case INVENTORY_DELETE_SUCCESS:
                    case INVENTORY_ACTIVE_SUCCESS:
            return { Invloading: false, Invsuccess: action.payload };

        case INVENTORY_CREATE_FAIL:
            case INVENTORY_UPDATE_FAIL:
                case INVENTORY_DELETE_FAIL: 
                    case INVENTORY_ACTIVE_FAIL:
            return { Invloading: false, Inverror: action.payload };

        default:
            return state;
    }
}