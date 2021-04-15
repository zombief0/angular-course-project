import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {AddIngredient, DeleteIngredient, StopEdit, UpdateIngredient} from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('nameInput', {static: false}) nameInput: ElementRef;
  @ViewChild('amountInput', {static: false}) amountInput: ElementRef;
  shoppingForm: FormGroup;
  ingredient: Ingredient = new Ingredient(null, 0);
  selectedIngSub: Subscription;
  editMode = false;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.selectedIngSub = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.ingredient = {...stateData.editedIngredient};
      } else {
        this.editMode = false;
      }
      this.initForm();
    });
    this.initForm();
    /*this.selectedIngSub = this.shoppingListService.selectedIngredientIndex.subscribe(
      selectedIngredientIndex => {
        this.index = selectedIngredientIndex;
        this.ingredient = this.shoppingListService.getSoloIngredient(selectedIngredientIndex);
        this.initForm();
        this.editMode = true;
      }
    );

    this.initForm();*/

  }

  initForm(): void {
    this.shoppingForm = new FormGroup({
      shoppingName: new FormControl(this.ingredient.name, Validators.required),
      amount: new FormControl(this.ingredient.amount, [Validators.required, Validators.min(0)])
    });
  }

  addShopping(): void {
    this.ingredient.amount = this.shoppingForm.value.amount;
    this.ingredient.name = this.shoppingForm.value.shoppingName;
    if (!this.editMode) {

      // this.shoppingListService.addIngredient(this.ingredient);
      this.store.dispatch(new AddIngredient(this.ingredient));
    } else {
      // this.shoppingListService.editIngredient(this.ingredient, this.index);
      this.store.dispatch(new UpdateIngredient(this.ingredient));
    }

    this.reset();
  }

  reset(): void {
    this.shoppingForm.reset({shoppingName: null, amount: 0});
    this.ingredient = new Ingredient('', 0);
    this.editMode = false;
    this.store.dispatch(new StopEdit());
  }

  ngOnDestroy(): void {
    this.selectedIngSub.unsubscribe();
    this.store.dispatch(new StopEdit());
  }

  delete(): void {
    // this.shoppingListService.deleteIngredient(this.index);
    this.store.dispatch(new DeleteIngredient());
    this.reset();
  }
}
