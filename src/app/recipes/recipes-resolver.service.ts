import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Recipe} from './recipe.model';
import {Observable} from 'rxjs';
import {DataStorageService} from '../shared/data-storage.service';
import {RecipesService} from '../services/recipes.service';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app.reducer';
import {FetchRecipes, SET_RECIPES} from './store/recipes.actions';
import {Actions, ofType} from '@ngrx/effects';
import {take} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private storage: DataStorageService,
              private recipeService: RecipesService,
              private store: Store<AppState>, private action$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
   /* const recipes = this.recipeService.getRecipes();
    if (recipes.length === 0) {
      return this.storage.fetchRecipe();
    } else {
      return recipes;
    }*/

    this.store.dispatch(new FetchRecipes());
    return this.action$.pipe(
      ofType(SET_RECIPES),
      take(1));

  }

}
