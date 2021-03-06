import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RecipesService} from '../services/recipes.service';
import {Recipe} from '../recipes/recipe.model';
import { map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient,
              private recipeService: RecipesService) {
  }

  storeRecipe(): void {
    const recipes = this.recipeService.getRecipes();
    /*this.http
      .put('https://angular-course-project-76922-default-rtdb.firebaseio.com/recipes.json',
        recipes).subscribe(response => {
      console.log(response);
    });*/
  }

  fetchRecipe(): Observable<Recipe[]> {
      return  this.http
        .get<Recipe[]>('https://angular-course-project-76922-default-rtdb.firebaseio.com/recipes.json').pipe(map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      }));
  }
}
