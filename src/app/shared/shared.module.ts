import {NgModule} from '@angular/core';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {DropdownDirective} from './dropdown.directive';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [LoadingSpinnerComponent, DropdownDirective],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [LoadingSpinnerComponent, DropdownDirective, CommonModule, ReactiveFormsModule, FormsModule]
})
export class SharedModule {

}
