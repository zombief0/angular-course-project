import { Injectable} from '@angular/core';
import {Recipe} from '../recipes/recipe.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  recipesChanged = new Subject<Recipe[]>();
  /*private recipes: Recipe[] = [
    new Recipe(1,
      'A test Recipe',
      'This is a test',
      'https://live.staticflickr.com/4891/45165261135_69cb589907_b.jpg',
      [
        new Ingredient('Meat', 20),
        new Ingredient('French Fries', 60)
      ]),
    new Recipe(2,
      'Another test Recipe',
      'This is a test',
      'https://www.recipetineats.com/wp-content/uploads/2020/02/Honey-Garlic-Chicken-Breast_5-SQ.jpg',
      [
        new Ingredient('Bread', 30),
        new Ingredient('Chicken', 5)
      ])
  ];*/
  private recipes: Recipe[] = [];

  constructor() {
  }

  getRecipes(): Recipe[]{
    return this.recipes.slice();
  }

  getRecipeByIndex(index: number): Recipe{
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe): void{
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(recipe: Recipe, index: number): void{
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number): void{
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  setRecipes(recipes: Recipe[]): void{
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }
}
