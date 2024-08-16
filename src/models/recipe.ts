import { KeysOfObj } from "../util/set-query-builder";
import { IdName } from "./generic";

export interface Ingredient {
  id: number;
  item: string;
  measurement: string;
}

export type TimerMeasure = "seconds" | "minutes" | "hours";

export interface Timer {
  id: number;
  name: string;
  // recipeId: number;
  minTime?: number;
  maxTime?: number;
  measurement?: TimerMeasure;
}

export interface RawIngredientGroup {
  id: number;
  groupName: string;
}

export interface IngredientGroup extends RawIngredientGroup {
  ingredients: Ingredient[];
}

/**
 * Returns the id and name of the recipe, and includes the item
 * and measurements of the ingredient
 */
export interface SearchReturn {
  id: number;
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
  timers: Timer[];
  totalTime: number;
  recipeLinks: RecipeLink[];
}

export interface SearchRecipe extends BaseRecipe {
  ingredients: Ingredient[];
}

export interface Folder {
  id: number;
  name: string;
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

export interface RecipeUpdateVars {
  name: string;
  instructions: string;
  notes: string;
  description: string; 
  totalTime: number;
}

export interface RecipeUpdates {
  id: number;
  updates: Partial<RecipeUpdateVars>;
};

export interface IngredientUpdates {
  id: number;
  updates: Partial<IngredientUpdateVars>;
}

export type RecipeLink = IdName & {label?: string};

export interface TimerUpdates {
  id: number;
  updates: Partial<TimerUpdateVars>;
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

export interface AddRecipeLinkVars {
  recipeParentId: number;
  recipeChildId: number;
  label?: string;
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

export interface AddTimerVars {
  name: string
  recipeId: number;
  minTime?: number;
  maxTime?: number;
}

export interface AddTimerReturn {
  id: number;
  name: string;
  minTime?: number;
  maxTime?: number;
  measurement?: TimerMeasure;
}

export interface TimerUpdateVars {
  name?: string;
  minTime?: number;
  maxTime?: number;
  measurement?: TimerMeasure;
}

export interface DeleteLinkVars {
  recipeParentId: number;
  recipeChildId: number;
}

export type DeleteTimerReturn = Pick<Timer, "id">;

export type DeleteIngredientReturn = Pick<AddIngredientReturn, "id" | "ingredientGroupId">;

export type DeleteGroupReturn = Pick<IngredientGroup, "id">
