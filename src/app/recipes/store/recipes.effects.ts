import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import {FETCH_RECIPES, FetchRecipes, SetRecipes} from './recipes.actions';
import {map, switchMap} from 'rxjs/operators';
import {Recipe} from '../recipe.model';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class RecipesEffects {
  fetchRecipeEffect = createEffect(() => {
    return this.action$.pipe(
      ofType(FETCH_RECIPES),
      switchMap(() => {
        return this.http
          .get<Recipe[]>('https://angular-course-project-76922-default-rtdb.firebaseio.com/recipes.json');
      }), map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }), map((recipes) => {
        return new SetRecipes(recipes);
      })
    );
});

  constructor(private action$: Actions, private http: HttpClient) {
  }
}
