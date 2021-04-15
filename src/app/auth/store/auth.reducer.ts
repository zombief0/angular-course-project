import {UserModel} from '../user.model';
import {AuthActions, AUTHENTICATE_FAILED, AUTHENTICATE_SUCCESS, LOGIN_START, LOGOUT, SIGNUP_START} from './auth.action';

export interface State {
  user: UserModel;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(state = initialState, action: AuthActions): State {
  switch (action.type) {
    case AUTHENTICATE_SUCCESS:
      const user = action.payload;
      return {
        ...state,
        authError: null,
        user,
        loading: false
      };
    case LOGOUT:
      return {
        ...state,
        user: null
      };
    case LOGIN_START:
    case SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true
      };
    case AUTHENTICATE_FAILED:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false
      };
    default:
      return state;

  }
}
