export interface Ingredient {
  id: number;
  measurement: string;
  item: string;
}

export interface Measurement {
  id: number;
  value: string;
}

export interface Recipe {
  id: number;
  name: string;
  instructions: string; // might change
  description?: string;
  notes?: string;
}

export interface Folder {
  id: number;
  name: string;
  recipes: number[];
}

export interface IngredientGroup {
  id: number;
  name: string;
  recipeId: number;
}

export interface RawJoinRecipe {
  id: number;
  name: string;
  groupName: string;
  ingredientGroupId: number;
  instructions: string;
  item: string;
  measurement: string;
  notes: string;
  recipeId: number;
}

export interface IngredientMerged {
  id: number;
  recipeId: number;
  ingredientGroupId: number;
  measurement: number;
  item: string;
  groupName?: string;
}

export interface IIngredient {
  [key: string]: {
   id: number;
   recipeId: number;
   ingredientGroupId: number;
   measurement: number;
   item: string;
   groupName?: string;
  }
}
