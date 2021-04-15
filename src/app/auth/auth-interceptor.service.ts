import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {exhaustMap, map, take} from 'rxjs/operators';
import {AppState} from '../store/app.reducer';
import {Store} from '@ngrx/store';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
  constructor(private authService: AuthService, private store: Store<AppState>) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(take(1),
      map( authState => {
        return authState.user;
      }),
      exhaustMap(user => {
      if (!user){
        return next.handle(req);
      }
      const modifiedReq = req.clone({params: new HttpParams().set('auth', user.tokenV)});
      return next.handle(modifiedReq);
    }));
  }

}
