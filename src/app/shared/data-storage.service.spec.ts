import {RecipesService} from '../services/recipes.service';
import {TestBed} from '@angular/core/testing';
import {DataStorageService} from './data-storage.service';
import {Recipe} from '../recipes/recipe.model';
import {Ingredient} from './ingredient.model';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('DataStorageService', () => {
  let dataService: DataStorageService;
  let httpClientSpy: { get: jasmine.Spy };
  let recipeServiceSpy;
  let httpTestingC: HttpTestingController;
  let expectedRecipe: Recipe[];
  beforeEach(() => {
    expectedRecipe = [
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
    ];


    recipeServiceSpy = jasmine.createSpyObj('RecipeService', ['getRecipes']);
    const stubValue: Recipe[] = [];
    recipeServiceSpy.getRecipes.and.returnValue(stubValue);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['put']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DataStorageService
        // {provide: RecipesService, useValue: spy}
      ]
    });
    dataService = TestBed.inject(DataStorageService);
    recipeServiceSpy = TestBed.inject(RecipesService) as jasmine.SpyObj<RecipesService>;
    httpTestingC = TestBed.inject(HttpTestingController);
    // dataService = new DataStorageService(httpClientSpy as any, recipeServiceSpy as any);
  });

  it('should be created', () => {

    // tests without beforeEach
    /*const recipeServiceSp = jasmine.createSpyObj('RecipeService', ['getRecipes']);
    recipeServiceSp.getRecipes.and.returnValue(expectedRecipe);
    const httpClientSp = jasmine.createSpyObj('HttpClient', ['put']);
    dataService = new DataStorageService(httpClientSp, recipeServiceSp);
    dataService.storeRecipe();
    expect(recipeServiceSp.getRecipes).toHaveBeenCalledTimes(1);*/

    dataService.storeRecipe();
    expect(recipeServiceSpy.getRecipes).toHaveBeenCalledTimes(1);
  });

  it('fetch recipes', () => {
    dataService.fetchRecipe().subscribe(
      (recipes) => {
        expect(expectedRecipe.length).toEqual(recipes.length);
      }
    );

    const req = httpTestingC.expectOne('https://angular-course-project-76922-default-rtdb.firebaseio.com/recipes.json');
    expect(req.cancelled).toBeFalsy();
    req.flush(expectedRecipe);
  });
});
