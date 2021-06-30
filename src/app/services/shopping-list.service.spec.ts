import {TestBed} from '@angular/core/testing';

import {ShoppingListService} from './shopping-list.service';
import {Ingredient} from '../shared/ingredient.model';

describe('ShoppingListService', () => {
  let service: ShoppingListService;
  let ingredients: Ingredient[];
  beforeEach(() => {
    /*TestBed.configureTestingModule({
      providers: [ShoppingListService]
    });
    // service = new ShoppingListService();
    ingredients = [
      new Ingredient('Apple', 5),
      new Ingredient('Tomato', 6)
    ];
    service = TestBed.inject(ShoppingListService);*/

    service = new ShoppingListService();
  });

  it('should have ingredients', () => {
    // expect(service).toBeTruthy();
    // service = new ShoppingListService();
    ingredients = service.getIngredients();
    expect(ingredients).toHaveSize(2);
    /*expect(service.getIngredients()).toEqual(ingredients);
    expect(service.getIngredients()).toHaveSize(2);
    expect(service.getIngredients().length).toEqual(2);*/
  });
});
