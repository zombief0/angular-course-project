import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app.reducer';
import {map} from 'rxjs/operators';
import {Logout} from '../auth/store/auth.action';
import {FetchRecipes} from '../recipes/store/recipes.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  show = false;
  collapsed = true;
  @Output() menuEvent = new EventEmitter<number>();
  @Input() menuNum: number;
  userSub: Subscription;
  isAuthenticated = false;

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService, private store: Store<AppState>) {
  }

  onSaveData(): void {
    this.dataStorageService.storeRecipe();
  }

  onFetchData(): void {
    // this.dataStorageService.fetchRecipe().subscribe();
    this.store.dispatch(new FetchRecipes());
  }

  ngOnInit(): void {
    this.userSub = this.store.select('auth')
      .pipe(map(authState => {
        return authState.user;
      }))
      .subscribe(user => {
        this.isAuthenticated = !!user;
      });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogout(): void {
    // this.authService.logout();
    this.store.dispatch(new Logout());
  }
}
