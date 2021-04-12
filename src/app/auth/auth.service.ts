import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable,  throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {UserModel} from './user.model';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

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
  userObject = new BehaviorSubject<UserModel>(null);
  timer: any;

  constructor(private http: HttpClient, private router: Router) {
  }

  signUp(email: string, password: string): Observable<AuthResponseData> {
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
  }

  logout(): void {
    this.userObject.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = null;
  }

  autoLogout(expirationDuration: number): void {
    this.timer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  autoLogin(): void {
    const user: { email: string, id: string, token: string, tokenExpirationDate: string } = JSON.parse(localStorage.getItem('userData'));
    if (!user) {
      return;
    } else {
      const loadedUser = new UserModel(user.email, user.id, user.token, new Date(user.tokenExpirationDate));
      if (loadedUser.tokenV) {
        this.userObject.next(loadedUser);
        const expirationDuration = new Date(user.tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
      }
    }
  }

  private handleAuth(email: string, token: string, expiresIn: number, userId: string): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new UserModel(email,
      userId, token, expirationDate);
    this.userObject.next(user);
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
  }
}
