export interface Ingredient {
  id: number;
  recipeId: number;
  measurement: string;
  item: string;
}

export interface Recipe {
  id: number;
  name: string;
  ingredients: number[];
  instructions: string; // might change
  description?: string;
  notes?: string;
}
