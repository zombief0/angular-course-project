import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  AUTHENTICATE_SUCCESS,
  AuthenticateSuccess,
  LOGIN_START,
  AuthenticateFailed,
  LoginStart,
  SignupStart,
  SIGNUP_START, LOGOUT, AUTO_LOGIN
} from './auth.action';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {UserModel} from '../user.model';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (expiresIn: number, localId: string, email: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new UserModel(email, localId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthenticateSuccess(new UserModel(email,
    localId,
    token,
    expirationDate),
    true
  );
};
const handleError = (err) => {
  let errorMessage = 'An unknown error occured';
  if (!err.error || !err.error.error) {
    return of(new AuthenticateFailed(errorMessage));
  }
  switch (err.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already exists';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'The password is invalid';
      break;

  }
  return of(new AuthenticateFailed(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignUp = this.action$.pipe(
    ofType(SIGNUP_START),
    switchMap((signUpAction: SignupStart) => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKEY
        , {
          email: signUpAction.payload.email,
          password: signUpAction.payload.password,
          returnSecureToken: true
        }).pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
        map(
          resData => {
            return handleAuthentication(+resData.expiresIn, resData.localId, resData.email, resData.idToken);
          }
        ),
        catchError(err => {
          return handleError(err);
        }));
    })
  );

  @Effect()
  authLogin = this.action$.pipe(
    ofType(LOGIN_START),
    switchMap((authData: LoginStart) => {
      return this.http
        .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKEY
          , {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }).pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(
            resData => {
              return handleAuthentication(+resData.expiresIn, resData.localId, resData.email, resData.idToken);

            }
          ),
          catchError(err => {
            return handleError(err);
          }));

    })
  );

  @Effect({dispatch: false})
  authRedirect = this.action$.pipe(
    ofType(AUTHENTICATE_SUCCESS), tap((actionSuccess: AuthenticateSuccess) => {
      if (actionSuccess.redirect){
        this.router.navigate(['/']);

      }
    }));


  @Effect({dispatch: false})
  authLogout = this.action$.pipe(
    ofType(LOGOUT), tap(() => {
      localStorage.removeItem('userData');
      this.authService.clearLogoutTimer();
      this.router.navigate(['/auth']);
    })
  );

  @Effect()
  autoLogin = this.action$.pipe(
    ofType(AUTO_LOGIN),
    map(() => {
      const user: { email: string, id: string, token: string, tokenExpirationDate: string } = JSON.parse(localStorage.getItem('userData'));
      if (!user) {
         return {type: 'DUMMY'};
      } else {
        const loadedUser = new UserModel(user.email, user.id, user.token, new Date(user.tokenExpirationDate));
        if (loadedUser.tokenV) {
          // this.userObject.next(loadedUser);
          const expirationDuration = new Date(user.tokenExpirationDate).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          return new AuthenticateSuccess(
            loadedUser, false);
          // const expirationDuration = new Date(user.tokenExpirationDate).getTime() - new Date().getTime();
          // this.autoLogout(expirationDuration);
        }

        return {type: 'DUMMY'};
      }
    })
  );

  constructor(private action$: Actions,
              private http: HttpClient, private router: Router,
              private authService: AuthService) {
  }
}
