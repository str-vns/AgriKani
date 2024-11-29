import { COMMENT_CREATE_FAIL, COMMENT_CREATE_REQUEST, COMMENT_CREATE_SUCCESS  } from "../Constants/commentConstants";

export const commentcreateReducers = (state = {}, action) =>   {
    switch (action.type) {
        case COMMENT_CREATE_REQUEST:
            return { loading: true };
        case COMMENT_CREATE_SUCCESS:
            return { loading: false, success: action.payload };
        case COMMENT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}