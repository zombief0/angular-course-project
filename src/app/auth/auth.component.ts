import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthResponseData, AuthService} from './auth.service';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app.reducer';
import {LoginStart, SignupStart} from './store/auth.action';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLogin = true;
  isLoading = false;
  error = null;
  storeSub: Subscription;

  constructor(private authService: AuthService,
              private router: Router, private store: Store<AppState>) {
  }

  ngOnInit(): void {
   this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }


  onSubmit(authForm: NgForm): void {
    if (!authForm.valid) {
      return;
    }
    const email = authForm.value.email;
    const password = authForm.value.password;
    /*let authObs: Observable<AuthResponseData>;
    this.isLoading = true;*/

    if (this.isLogin) {
      // authObs = this.authService.login(email, password);
      this.store.dispatch(new LoginStart({email, password}));
    } else {
      // authObs = this.authService.signUp(email, password);
      this.store.dispatch(new SignupStart({email, password}));
    }
    /* authObs.subscribe(response => {
       this.isLoading = false;
       this.router.navigate(['/recipes']);
     }, errorMessage => {
       this.isLoading = false;
       this.error = errorMessage;
       console.log(errorMessage);
     });*/

    authForm.reset();
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }


}
