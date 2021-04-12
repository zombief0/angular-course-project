import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {RecipesService} from '../../services/recipes.service';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent implements OnInit {
  index: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private activeRoute: ActivatedRoute,
              private recipesService: RecipesService, private router: Router) {
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(
      params => {
        this.index = +params.id;
        this.editMode = params.id != null;
        this.initForm();
      }
    );
  }

  private initForm(): void {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);
    if (this.editMode) {
      const recipe = this.recipesService.getRecipeByIndex(this.index);
      recipeName = recipe.name;
      recipeDescription = recipe.description;
      recipeImagePath = recipe.imagePath;
      if (recipe.ingredients != null) {
        for (const ing of recipe.ingredients) {
          recipeIngredients.push(new FormGroup({
            name: new FormControl(ing.name, Validators.required),
            amount: new FormControl(ing.amount, [Validators.required,
              Validators.min(0)])
          }));
        }
      }
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }

  onSubmit(): void {
    /*let recipe = new Recipe(0,
      this.recipeForm.value.name,
      this.recipeForm.value.description,
      this.recipeForm.value.imagePath,
      this.recipeForm.value.ingredients);*/
    if (this.editMode) {
      this.recipesService.updateRecipe(this.recipeForm.value, this.index);
    } else {
      this.recipesService.addRecipe(this.recipeForm.value);
    }

    this.onCancel();
  }

  getControls(): AbstractControl[] {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  addIngredient(): void {
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required,
          Validators.min(0)])
      })
    );
  }

  onCancel(): void {
    this.router.navigate(['../'], {relativeTo: this.activeRoute});
  }

  onDeleteIngredient(i: number): void {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(i);
  }
}
