import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Recipe} from '../recipe.model';
import {ShoppingListService} from '../../services/shopping-list.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RecipesService} from '../../services/recipes.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  selectedRecipe: Recipe;
  @ViewChild('menu') menuElRef: ElementRef;
  b = false;
  index: number;
  constructor(private renderer: Renderer2,
              private shoppingListService: ShoppingListService,
              private activeRoute: ActivatedRoute,
              private recipesService: RecipesService, private router: Router) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(
      params => {
        this.index = params.id;
        this.selectedRecipe = this.recipesService.getRecipeByIndex(this.index);
      }
    );
  }

  showM(): void {
    this.b = !this.b;
    if (this.b){
      this.renderer.addClass(this.menuElRef.nativeElement, 'show');
    }else {
      this.closeDropdown();
    }
  }

  closeDropdown(): void {
    this.b = false;
    this.renderer.removeClass(this.menuElRef.nativeElement, 'show');
  }


  addToShoppingList(selectedRecipe: Recipe): void {
    for (const ingredient of selectedRecipe.ingredients){
      this.shoppingListService.addIngredient(ingredient);
      this.shoppingListService.ingredientsChanged.next(this.shoppingListService.getIngredients());
    }
  }

  onDelete(): void {
    this.recipesService.deleteRecipe(this.index);
    this.router.navigate(['/recipes']);
  }
}
