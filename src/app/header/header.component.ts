import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
  show = false;
  collapsed = true;
  @Output() menuEvent = new EventEmitter<number>();
  @Input() menuNum: number;
  userSub: Subscription;
  isAuthenticated = false;

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  constructor(private dataStorageService: DataStorageService, private authService: AuthService) {
  }

  onSaveData(): void {
    this.dataStorageService.storeRecipe();
  }

  onFetchData(): void {
    this.dataStorageService.fetchRecipe().subscribe();
  }

  ngOnInit(): void {
    this.userSub = this.authService.userObject.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
