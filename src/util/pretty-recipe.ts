// Better typing coming soon

import {groupBy} from "lodash";
import {IngredientGroup, Recipe} from "../models/recipe";


// Types file?
export interface RawReturn {
  id: number;
  description?: string;
  notes?: string;
  name: string;
  instructions: string;
  groupName: string;
  groupId: number;
  ingredientId: number;
  measurement: string;
  item: string;
}

export const prettyRecipe = (tableReturn: RawReturn[]): Recipe => {
  const uniqueGroups = groupBy(tableReturn, "groupName");
  const keys = Object.keys(uniqueGroups);
  const ingGroups: IngredientGroup[] = [];
  for (const key of keys) {
    const groups = {
      id: uniqueGroups[key][0].groupId,
      groupName: uniqueGroups[key][0].groupName,
      ingredients: uniqueGroups[key].map(g => ({
        id: g.ingredientId,
        measurement: g.measurement,
        item: g.item,
      })).sort((a, b) => a.id - b.id),
    };
    ingGroups.push(groups);
  }
  const recipe: Recipe = {
    id: tableReturn[0].id,
    instructions: tableReturn[0].instructions,
    name: tableReturn[0].name,
    description: tableReturn[0].description,
    notes: tableReturn[0].notes,
    ingredientGroups: ingGroups,
  };
  return recipe;
};