import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {ShoppingListService} from '../../services/shopping-list.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

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
  index: number;

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit(): void {
    this.selectedIngSub = this.shoppingListService.selectedIngredientIndex.subscribe(
      selectedIngredientIndex => {
        this.index = selectedIngredientIndex;
        this.ingredient = this.shoppingListService.getSoloIngredient(selectedIngredientIndex);
        this.initForm();
        this.editMode = true;
      }
    );

    this.initForm();

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

      this.shoppingListService.addIngredient(this.ingredient);
    } else {
      this.shoppingListService.editIngredient(this.ingredient, this.index);

    }

    this.reset();
    this.ingredient = new Ingredient('', 0);
  }

  reset(): void {
    this.shoppingForm.reset({shoppingName: null, amount: 0});
    this.index = null;
    this.editMode = false;
  }

  ngOnDestroy(): void {
    this.selectedIngSub.unsubscribe();
  }

  delete(): void {
    this.shoppingListService.deleteIngredient(this.index);
    this.reset();
  }
}
