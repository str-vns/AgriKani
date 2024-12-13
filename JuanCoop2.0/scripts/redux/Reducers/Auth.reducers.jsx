import { SET_CURRENT_USER, SET_LOGOUT_USER } from "../Actions/Auth.actions"
import isEmpty from "@assets/commons/is-empty"

export default function (state, action) {
    switch (action.type) {
        case SET_CURRENT_USER: 
          case SET_LOGOUT_USER:
        return {
            ...state,
            isAuthenticated: !isEmpty(action.payload),
            user: action.payload,
            userProfile: action.userProfile,
            isLoginUser: action.isLoginUser,
            isguest: action.isguest,
            isLoading: false,
        };
        default:
            return state;
    }
}