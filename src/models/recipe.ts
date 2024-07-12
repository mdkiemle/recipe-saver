import { KeysOfObj } from "../util/set-query-builder";

export interface Ingredient {
  id: number;
  item: string;
  measurement: string;
}

export interface RawIngredientGroup {
  id: number;
  groupName: string;
}

export interface IngredientGroup extends RawIngredientGroup {
  ingredients: Ingredient[];
}

export interface BaseRecipe {
  id: number;
  name: string;
  instructions?: string;
  notes?: string;
  description?: string;
}

export interface Recipe extends BaseRecipe {
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

// export interface RecipeUpdates {
//   id: number;
//   name?: string;
//   instructions?: string;
//   notes?: string;
//   description?: string; 
// }

export interface RecipeUpdateVars {
  name: string;
  instructions: string;
  notes: string;
  description: string; 
}

export interface RecipeUpdates {
  id: number;
  updates: Partial<KeysOfObj<RecipeUpdateVars>>;
};

export interface IngredientUpdates {
  id: number;
  updates: Partial<KeysOfObj<IngredientUpdateVars>>;
}

export type RecipeUpdateReturn = {id: number} & Partial<RecipeUpdateVars>

export interface IngredientUpdateVars {
  item: string;
  measurement: string;
}

export interface RecipeTextUpdate {
  id: number;
  text: string;
}

export interface AddIngredientGroup {
  recipeId: number;
  groupName: string;
}

export interface AddIngredientVars {
  item: string;
  measurement: string;
  ingredientGroupId: number;
}

export interface AddIngredientReturn extends Ingredient {
  ingredientGroupId: number;
}

export type DeleteIngredientReturn = Pick<AddIngredientReturn, "id" | "ingredientGroupId">;

export type DeleteGroupReturn = Pick<IngredientGroup, "id">
