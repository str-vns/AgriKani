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
  SINGLE_INVENTORY_FAIL,
  SINGLE_INVENTORY_REQUEST,
  SINGLE_INVENTORY_SUCCESS,
  INVENTORY_PRODUCTS_REQUEST,
  INVENTORY_PRODUCTS_SUCCESS,
  INVENTORY_PRODUCTS_FAIL,
  INVENTORY_DASHBOARD_REQUEST,
  INVENTORY_DASHBOARD_SUCCESS,
  INVENTORY_DASHBOARD_FAIL,
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
};

export const singleInventoryReducer = (state = {}, action) => {
  switch (action.type) {
    case SINGLE_INVENTORY_REQUEST:
    case INVENTORY_PRODUCTS_REQUEST:
      return { Invloading: true };

    case SINGLE_INVENTORY_SUCCESS:
    case INVENTORY_PRODUCTS_SUCCESS:
      return { Invloading: false, Invsuccess: action.payload };

    case SINGLE_INVENTORY_FAIL:
    case INVENTORY_PRODUCTS_FAIL:
      return { Invloading: false, Inverror: action.payload };

    default:
      return state;
  }
};

export const inventoryDashboardReducer = (state = {}, action) => {
  switch (action.type) {
    case INVENTORY_DASHBOARD_REQUEST:
      return { InvDloading: true };

    case INVENTORY_DASHBOARD_SUCCESS:
      return { InvDloading: false, InvDash: action.payload };

    case INVENTORY_DASHBOARD_FAIL:
      return { InvDloading: false, InvDError: action.payload };

    default:
      return state;
  }
};
