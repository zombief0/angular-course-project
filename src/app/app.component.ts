import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Store} from '@ngrx/store';
import {AppState} from './store/app.reducer';
import {AutoLogin} from './auth/store/auth.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private authService: AuthService, private store: Store<AppState>) {
  }
  ngOnInit(): void {
    // this.authService.autoLogin();
    this.store.dispatch(new AutoLogin());
  }
}
