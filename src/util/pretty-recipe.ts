// Better typing coming soon

import {groupBy} from "lodash";
import {Ingredient, IngredientGroup, Recipe, Timer} from "../models/recipe";


// Types file?
export interface RawReturn {
  id: number;
  description?: string;
  notes?: string;
  name: string;
  instructions?: string;
  groupName?: string;
  groupId?: number;
  ingredientId?: number;
  measurement?: string;
  item?: string;
  timerName?: string;
  timerId?: number;
  minTime?: number;
  maxTime?: number;
  timeMeasurement?: "seconds" | "minutes" | "hours";
}

export const prettyRecipe = (tableReturn: RawReturn[]): Recipe => {
  const uniqueGroups = groupBy(tableReturn, "groupId");
  const uniqueTimers = groupBy(tableReturn, "timerId");
  const keys = Object.keys(uniqueGroups);
  const timerKeys = Object.keys(uniqueTimers);
  const ingGroups: IngredientGroup[] = [];
  for (const key of keys) {
    const ingT: Ingredient[] = uniqueGroups[key].flatMap(g => {
      if (g.ingredientId) return {
        id: g.ingredientId,
        measurement: g.measurement,
        item: g.item,
      };
      return [];
    });
    const groups = {
      id: uniqueGroups[key][0].groupId,
      groupName: uniqueGroups[key][0].groupName,
      ingredients: ingT,
    };
    const exists = Boolean(groups.groupName);
    if (exists) ingGroups.push(groups);
  }
  const timers: Timer[] = [];
  for (const key of timerKeys) {
    timers.push({
      id: uniqueTimers[key][0].timerId,
      name: uniqueTimers[key][0].timerName,
      minTime: uniqueTimers[key][0].minTime,
      maxTime: uniqueTimers[key][0].maxTime,
      measurement: uniqueTimers[key][0].timeMeasurement,
    });
  }

  const recipe: Recipe = {
    id: tableReturn[0]?.id,
    instructions: tableReturn[0]?.instructions,
    name: tableReturn[0]?.name,
    description: tableReturn[0]?.description,
    notes: tableReturn[0]?.notes,
    ingredientGroups: ingGroups,
    timers: timers,
  };
  return recipe;
};
