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
}

export const prettyRecipe = (tableReturn: RawReturn[], timers: Timer[]): Recipe => {
  const uniqueGroups = groupBy(tableReturn, "groupId");
  // const uniqueTimers = groupBy(tableReturn, "timerId");
  const keys = Object.keys(uniqueGroups);
  // const timerKeys = Object.keys(uniqueTimers);
  const ingGroups: IngredientGroup[] = [];
  console.log("keys of groups", keys, "uniqueGroups", uniqueGroups);
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
  // console.log("keys of timers", timerKeys, "uniqueTimers", uniqueTimers);
  // const timers: Timer[] = [];
  // for (const key of timerKeys) {
  //   if (uniqueTimers[key][0].timerId) {
  //     timers.push({
  //       id: uniqueTimers[key][0].timerId,
  //       name: uniqueTimers[key][0].timerName,
  //       minTime: uniqueTimers[key][0].minTime,
  //       maxTime: uniqueTimers[key][0].maxTime,
  //       measurement: uniqueTimers[key][0].timeMeasurement,
  //     });
  //   }
  // }

  // console.log("what is going on here", ingGroups, timers);

  const recipe: Recipe = {
    id: tableReturn[0]?.id,
    instructions: tableReturn[0]?.instructions,
    name: tableReturn[0]?.name,
    description: tableReturn[0]?.description,
    notes: tableReturn[0]?.notes,
    ingredientGroups: ingGroups,
    timers,
  };
  return recipe;
};
