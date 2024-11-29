import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    CLEAR_CART,
    UPDATE_CART_QUANTITY,
  } from '../Constants/cartConstants';
  
  const cartItems = (state = [], action) => {
    switch (action.type) {
      case ADD_TO_CART:
        const existingItem = state.find(item => item.id === action.payload.id);
        if (existingItem) {
          return state.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          );
        } else {
          return [...state, action.payload];
        }
  
      case REMOVE_FROM_CART:
        return state.filter(cartItem => cartItem.id !== action.payload);
  
      case CLEAR_CART:
        return [];
  
      case UPDATE_CART_QUANTITY:
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
  
      default:
        return state;
    }
  };
  
  export default cartItems;