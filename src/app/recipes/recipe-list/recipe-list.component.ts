import {Component,  OnDestroy, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipesService} from '../../services/recipes.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(private recipesService: RecipesService) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.recipesService.recipesChanged.subscribe(
      recipes => {
        this.recipes = recipes;
      }
    );
    this.recipes = this.recipesService.getRecipes();
  }
}
