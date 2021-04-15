import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Recipe} from '../recipe.model';
import {ActivatedRoute, Router} from '@angular/router';
import {RecipesService} from '../../services/recipes.service';
import {Store} from '@ngrx/store';
import {Ingredient} from '../../shared/ingredient.model';
import {AddIngredients} from '../../shopping-list/store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import {map} from 'rxjs/operators';

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
              private activeRoute: ActivatedRoute,
              private recipesService: RecipesService,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(
      params => {
        this.index = params.id;
        // this.selectedRecipe = this.recipesService.getRecipeByIndex(this.index);
        this.store.select('recipes').pipe(map((recipeState) => {
          return recipeState.recipes.find((recipe, index) => {
            return index === +this.index;
          });
        })).subscribe(recipe => {
          this.selectedRecipe = recipe;
        });
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
    this.store.dispatch(new AddIngredients(selectedRecipe.ingredients));
  }

  onDelete(): void {
    this.recipesService.deleteRecipe(this.index);
    this.router.navigate(['/recipes']);
  }
}
