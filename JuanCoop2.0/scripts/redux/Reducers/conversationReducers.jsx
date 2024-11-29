import { 
    CONVERSATION_LIST_FAIL, 
    CONVERSATION_LIST_SUCCESS, 
    CONVERSATION_LIST_REQUEST,
    NEW_CONVETION_REQUEST,  
    NEW_CONVETION_SUCCESS,
    NEW_CONVETION_FAIL,
 } from "../Constants/conversationConstants";

export const conversationListReducer = (state = { conversations: [] }, action) => {
    switch (action.type) {
        case CONVERSATION_LIST_REQUEST:
            return { loading: true, conversations: [] };
        case CONVERSATION_LIST_SUCCESS:
            return { loading: false, conversations: action.payload };
        case CONVERSATION_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export const conversationCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case NEW_CONVETION_REQUEST:
            return { loading: true };
        case NEW_CONVETION_SUCCESS:
            return { loading: false, success: action.payload };
        case NEW_CONVETION_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}