import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    CLEAR_CART,
    UPDATE_CART_QUANTITY, 
  } from '../Constants/cartConstants';
  
  export const addToCart = (payload) => {
    return {
      type: ADD_TO_CART,
      payload
    };
  };
  
  export const removeFromCart = (payload) => {
    return {
      type: REMOVE_FROM_CART,
      payload
    };
  };
  
  export const clearCart = () => {
    return {
      type: CLEAR_CART
    };
  };
  
  export const updateCartQuantity = (id, quantity) => {
    return {
      type: UPDATE_CART_QUANTITY,
      payload: { id, quantity },
    };
  };  