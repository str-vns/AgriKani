import {
  CREATE_NOTIFICATION_REQUEST,
  CREATE_NOTIFICATION_FAIL,
  CREATE_NOTIFICATION_SUCCESS,
  SINGLE_NOTIFICATION_FAIL,
  SINGLE_NOTIFICATION_REQUEST,
  SINGLE_NOTIFICATION_SUCCESS,
  NOTIFICATION_ALL_READ_FAIL,
  NOTIFICATION_ALL_READ_REQUEST,
  NOTIFICATION_ALL_READ_SUCCESS,
  NOTIFICATION_READ_FAIL,
  NOTIFICATION_READ_REQUEST,
  NOTIFICATION_READ_SUCCESS,
} from "../Constants/notificationConstants";

export const sendNotificationReducers = (
  state = { navigation: [] },
  action
) => {
  switch (action.type) {
    case CREATE_NOTIFICATION_REQUEST:
      return { ...state, loading: true, notification: [] };

    case CREATE_NOTIFICATION_SUCCESS:
      return { ...state, loading: false, notification: action.payload };

    case CREATE_NOTIFICATION_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const getNotificationReducers = (
  state = { notification: [] },
  action
) => {
  switch (action.type) {
    case SINGLE_NOTIFICATION_REQUEST:
      return { ...state, notifloading: true, notification: [] };

    case SINGLE_NOTIFICATION_SUCCESS:
      return { ...state, notifloading: false, notification: action.payload };

    case SINGLE_NOTIFICATION_FAIL:
      return { ...state, notifloading: false, notiferror: action.payload };

    default:
      return state;
  }
};

export const readNotificationReducers = (
  state = { notification: [] },
  action
) => {
  switch (action.type) {
    case NOTIFICATION_READ_REQUEST:
        case NOTIFICATION_ALL_READ_REQUEST:
      return { ...state, readloading: true, notification: [] };

    case NOTIFICATION_READ_SUCCESS:
        case NOTIFICATION_ALL_READ_SUCCESS:
      return { ...state, readloading: false, notification: action.payload };

    case NOTIFICATION_READ_FAIL:
        case NOTIFICATION_ALL_READ_FAIL:
      return { ...state, readloading: false, readerror: action.payload };

    default:
      return state;
  }
};
