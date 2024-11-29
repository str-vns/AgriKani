import { TYPE_LIST_FAIL, TYPE_LIST_REQUEST, TYPE_LIST_SUCCESS } from "../Constants/typeConstants";

export const typeListReducer = (state = { types: [] }, action) => {
    switch (action.type) {
        case TYPE_LIST_REQUEST:
            return { typeLoading: true, types: [] };
        case TYPE_LIST_SUCCESS:
            return { typeLoading: false, types: action.payload };
        case TYPE_LIST_FAIL:
            return { typeLoading: false, TypeError: action.payload };
        default:
            return state;
    }
}