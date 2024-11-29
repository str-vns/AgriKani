import {
    MESSAGE_LIST_FAIL,
    MESSAGE_LIST_REQUEST,
    MESSAGE_LIST_SUCCESS,
    SEND_MESSAGE_FAIL,
    SEND_MESSAGE_REQUEST,
    SEND_MESSAGE_SUCCESS,
  } from "../Constants/messageConstants";
  
  export const messageListReducer = (state = { messages: [] }, action) => {
    switch (action.type) {
      case MESSAGE_LIST_REQUEST:
        return { loading: true, messages: [] };
      case MESSAGE_LIST_SUCCESS:
        return { loading: false, messages: action.payload };
      case MESSAGE_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const sendMessageReducer = (state = { messages: [], loading: false, error: null }, action) => {
    switch (action.type) {
      case SEND_MESSAGE_REQUEST:
        return {
          ...state,
          loading: true,
        };
      
      case SEND_MESSAGE_SUCCESS:
        if (action.payload) {
          return {
            ...state,
            messages: [...state.messages, action.payload], 
            loading: false, 
          };
        }
        return state;
      
      case SEND_MESSAGE_FAIL:
        return {
          ...state,
          error: action.payload, 
          loading: false, 
        };
      
      default:
        return state;
    }
  };
  