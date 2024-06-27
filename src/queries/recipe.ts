import {ipcMain} from "electron";
import {database} from "../index";
import { RawReturn, prettyRecipe } from "../util/pretty-recipe";
import { setQueryBuilder } from "../util/set-query-builder";

// Might not be necessary? But just in case I want to use this elsewhere.
export const recipeQuery = (id: number): string => `
  select r.id, description, notes, name, instructions,
  ig.id as groupId, groupName, i.id as ingredientId, measurement, item from recipe r
  left join ingredientGroup ig on r.id=ig.recipeId
  left join ingredient i on i.ingredientGroupId=ig.id
  where r.id = ${id}
`;

ipcMain.on("get-recipe", (event, arg: number) => {
  const sql = recipeQuery(arg);
  database.all(sql, (err: Error, rows: RawReturn[]) => {
    console.log("hey", rows);
    const recipe = prettyRecipe(rows);
    event.reply("recipe-retrieved", (err && err.message) || recipe);
  });
});

export interface IngredientUpdates {
  id: number;
  item?: string;
  measurement?: string;
}

ipcMain.on("update-ingredient", (event, arg: IngredientUpdates) => {
  const {id, item, measurement} = arg;
  const keyValues = {item, measurement};
  const setQuery = setQueryBuilder(keyValues);
  if (!setQuery) return event.reply("update-ingredient-return", "No update made");
  const sql = `
    update ingredient
    set ${setQuery}
    where id = ${id};
  `;
  database.all(sql, (err: Error, rows) => {
    event.reply("update-ingredient-return", (err && err.message) || rows);
  });
});
