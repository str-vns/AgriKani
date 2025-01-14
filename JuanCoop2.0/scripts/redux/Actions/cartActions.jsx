import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    CLEAR_CART,
    UPDATE_CART_QUANTITY, 
    SET_CART_ITEMS
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
    return async (dispatch, getState) => {
  
      const storedCart = await AsyncStorage.getItem('cartItems');
      let cartItems = storedCart ? JSON.parse(storedCart) : []; 
      
      const existingItem = cartItems.find(item => item.inventoryId === payload.inventoryId);
      if (existingItem) {
        cartItems = cartItems.map(item =>
          item.inventoryId === payload.inventoryId
            ? { ...item, quantity: item.quantity + payload.quantity }
            : item
        );
      } else {
        cartItems.push(payload);
      }

      await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      dispatch({
        type: ADD_TO_CART,
        payload: cartItems,
      });
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