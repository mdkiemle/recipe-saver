export interface Ingredient {
  amount: string;
  item: string;
}

export interface Instruction {
  value: string;
}

export interface Recipe {
  ingredients: Ingredient[]
  instructions: Instruction;
}

export interface RecipeBook {
  [key: string]: Recipe;
}