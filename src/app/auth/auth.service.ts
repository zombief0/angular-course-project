import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserModel} from './user.model';
import {Router} from '@angular/router';
import * as fromApp from '../store/app.reducer';
import {Store} from '@ngrx/store';
import {AuthenticateSuccess, Logout} from './store/auth.action';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  // userObject = new BehaviorSubject<UserModel>(null);
  timer: any;

  constructor(private http: HttpClient,
              private router: Router, private store: Store<fromApp.AppState>) {
  }

  /*signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKEY
        , {email, password, returnSecureToken: true}).pipe(catchError(this.handleError),
        tap(responseData => {
          this.handleAuth(responseData.email, responseData.idToken, +responseData.expiresIn, responseData.localId);
        }));
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKEY
        , {email, password, returnSecureToken: true})
      .pipe(catchError(this.handleError), tap(responseData => {
        console.log(responseData);
        this.handleAuth(responseData.email, responseData.idToken, +responseData.expiresIn, responseData.localId);
      }));
  }*/

  logout(): void {
    // this.userObject.next(null);
    this.store.dispatch(new Logout());
    localStorage.removeItem('userData');
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = null;
  }

  setLogoutTimer(expirationDuration: number): void {
    this.timer = setTimeout(() => {
      // this.logout();
      this.store.dispatch(new Logout());
    }, expirationDuration);
  }

  clearLogoutTimer(): void{
    if (this.timer){
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  autoLogin(): void {
    const user: { email: string, id: string, token: string, tokenExpirationDate: string } = JSON.parse(localStorage.getItem('userData'));
    if (!user) {
      return;
    } else {
      const loadedUser = new UserModel(user.email, user.id, user.token, new Date(user.tokenExpirationDate));
      if (loadedUser.tokenV) {
        // this.userObject.next(loadedUser);
        this.store.dispatch(new AuthenticateSuccess(loadedUser, false));
        const expirationDuration = new Date(user.tokenExpirationDate).getTime() - new Date().getTime();
        this.setLogoutTimer(expirationDuration);
      }
    }
  }

  /*private handleAuth(email: string, token: string, expiresIn: number, userId: string): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new UserModel(email,
      userId, token, expirationDate);
    // this.userObject.next(user);
    this.store.dispatch(new AuthenticateSuccess(user));
    console.log(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
    console.log(JSON.parse(localStorage.getItem('userData')));
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occured';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }
    switch (errorResponse.error.error.message) {
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
    return throwError(errorMessage);
  }*/
}
