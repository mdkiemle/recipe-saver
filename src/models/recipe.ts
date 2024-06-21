export interface Ingredient {
  id: number;
  item: string;
  measurement: string;
}

export interface IngredientGroup {
  id: number;
  groupName: string;
  ingredients: Ingredient[];
}

export interface Recipe {
  id: number;
  name: string;
  instructions: string;
  notes?: string;
  description?: string;
  ingredientGroups: IngredientGroup[];
}

export interface Folder {
  id: number;
  name: string;
  recipes: number[];
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
