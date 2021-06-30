import {AuthComponent} from '../auth/auth.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ShoppingListComponent} from './shopping-list.component';
import {ShoppingListService} from '../services/shopping-list.service';
import {Ingredient} from '../shared/ingredient.model';
import {Subject} from 'rxjs';

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;
  let shoppingService: Partial<ShoppingListService>;
  const ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Tomato', 6)
  ];

  const ingredientChanged = new Subject<Ingredient[]>();
  beforeEach(async () => {
    shoppingService = {
      getIngredients(): Ingredient[] {
        return ingredients;
      },
      ingredientsChanged: ingredientChanged
    };
    await TestBed.configureTestingModule({
      declarations: [ShoppingListComponent],
      providers: [{provide: ShoppingListService, useValue: shoppingService}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    // shoppingService = TestBed.inject(ShoppingListService); might not always work
    shoppingService = TestBed.inject(ShoppingListService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain div', () => {
    fixture.detectChanges();
    const natElement = fixture.debugElement.nativeElement;
    expect(natElement.querySelector('div')).toBeTruthy();
  });

  it('Testing service ngOnit not yet fired', () => {
    expect(component.ingredients).toBeFalsy();
  });

  it('Testing service ngOnnit fired', () => {
    fixture.detectChanges();
    expect(component.ingredients).toEqual(shoppingService.getIngredients());
  });
});
