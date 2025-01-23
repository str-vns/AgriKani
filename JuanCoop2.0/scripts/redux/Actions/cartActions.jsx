import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    CLEAR_CART,
    UPDATE_CART_QUANTITY, 
    SET_CART_ITEMS,
    UPDATE_CART_INV
  } from '../Constants/cartConstants';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  const persistCartToStorage = async (cartItems) => {
    console.log('cartItems', cartItems);
  try {
    await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error persisting cart to AsyncStorage', error);
  }
  };

  export const addToCart = (payload) => {
    return async (dispatch) => {
      try {

        const storedCartItems = await AsyncStorage.getItem('cartItems');;
        let cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
  
        if (!Array.isArray(cartItems)) {
          console.warn("cartItems is not an array, resetting to an empty array.");
          cartItems = [];
        }

        const existingCartItem = cartItems.find(item => item.inventoryId === payload.inventoryId);
  
        if (existingCartItem) {
          const newQuantity = existingCartItem.quantity + payload.quantity;
  
          if (newQuantity <= existingCartItem.maxQuantity) {
            cartItems = cartItems.map(item =>
              item.inventoryId === payload.inventoryId
                ? { ...item, quantity: newQuantity }
                : item
            );
          } else {
            const allowedQuantity = existingCartItem.maxQuantity - existingCartItem.quantity;
            if (allowedQuantity > 0) {
              cartItems = cartItems.map(item =>
                item.inventoryId === payload.inventoryId
                  ? { ...item, quantity: item.quantity + allowedQuantity }
                  : item
              );
            } else {
              console.log("Cannot add more, max quantity reached.");
            }
          }
        } else {
          const allowableQuantity = Math.min(payload.quantity, payload.maxQuantity);
          cartItems.push({ ...payload, quantity: allowableQuantity });
        }
  
        await AsyncStorage.setItem("cartItems", JSON.stringify(cartItems));
  
        dispatch({
          type: ADD_TO_CART,
          payload: cartItems,
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    };
  };
  
  export const removeFromCart = (payload) => {
    return async (dispatch, getState) => {
      dispatch({
        type: REMOVE_FROM_CART,
        payload,
      });
  
     
      const { cartItems } = getState(); 
      await persistCartToStorage(cartItems); 
    };
  };
  
  // Clear cart
  export const clearCart = () => {
    return async (dispatch, getState) => {
      dispatch({
        type: CLEAR_CART,
      });
  
     
      await persistCartToStorage([]); 
    };
  };
  
  
  export const updateCartQuantity = (inventoryId, quantity) => {
    console.log('inventoryId', inventoryId);
    console.log('quantity', quantity);
    return async (dispatch, getState) => {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        payload: { inventoryId, quantity },
      });
  
    
      const { cartItems } = getState();
      await persistCartToStorage(cartItems); 
    };
  };

 export const setCartItems = (cartItems) => {
  return {
    type: SET_CART_ITEMS,
    payload: cartItems,
  };
};

export const updateCartInv = (inventoryId, quantity, maxQuantity) => {

  return async (dispatch, getState) => {
      dispatch({
          type: UPDATE_CART_INV,
          payload: { inventoryId, quantity, maxQuantity },

      })

      const { cartItems } = getState();
      await persistCartToStorage(cartItems);
  }
}