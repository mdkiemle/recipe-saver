import {groupBy} from "lodash";
import { Ingredient, Recipe } from "../models/recipe";

export interface SearchRecipeRawReturn {
  id: number;
  name: string;
  item: string;
  ingId: number;
  measurement: string;
  description?: string;
}

export const prettySearch = (tableReturn: SearchRecipeRawReturn[]): Recipe[] | any => {
  const uniqueGroups = groupBy(tableReturn, "id");
  const keys = Object.keys(uniqueGroups);

  const recipes: Recipe[] = [];

  for (const key of keys) {
    const ingredients = uniqueGroups[key].map(g => ({
      id: g.ingId,
      measurement: g.measurement,
      item: g.item,
    }));
    const thisRecipe = {
      id: uniqueGroups[key][0].id,
      description: uniqueGroups[key][0].description,
      name: uniqueGroups[key][0].name,
      ingredientGroups: [] as [],
      ingredients: ingredients,
    };
    recipes.push(thisRecipe);
  }
  return recipes;
};