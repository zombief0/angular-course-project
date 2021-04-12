import {NgModule} from '@angular/core';
import {AuthComponent} from './auth.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [AuthComponent],
  imports: [ReactiveFormsModule, SharedModule, RouterModule.forChild([{path: '', component: AuthComponent}])]
})
export class AuthModule {

}
