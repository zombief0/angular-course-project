import {Action} from '@ngrx/store';
import {UserModel} from '../user.model';

export const AUTHENTICATE_SUCCESS = '[Auth] LOGIN';
export const LOGOUT = '[Auth] LOGOUT';
export const LOGIN_START = '[Auth] Login Start';
export const SIGNUP_START = '[Auth] Signup Start';
export const AUTHENTICATE_FAILED = '[Auth] Login Failed';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

  constructor(public payload: UserModel, public redirect: boolean) {
  }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string, password: string }) {
  }
}

export class AuthenticateFailed implements Action {
  readonly type = AUTHENTICATE_FAILED;

  constructor(public payload: string) {
  }
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload: { email: string, password: string }) {
  }
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;

}

export type AuthActions = AuthenticateSuccess
  | Logout | LoginStart | AuthenticateFailed | SignupStart | AutoLogin;
