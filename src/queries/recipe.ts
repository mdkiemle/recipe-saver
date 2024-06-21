import {ipcMain} from "electron";
import {database} from "../index";
import { RawReturn, prettyRecipe } from "../util/pretty-recipe";

ipcMain.on("get-recipe", (event, arg: number) => {
  const sql = `
    select r.id, description, notes, name, instructions,
    ig.id as groupId, groupName, i.id as ingredientId, measurement, item from recipe r
    left join ingredientGroup ig on r.id=ig.recipeId
    left join ingredient i on i.ingredientGroupId=ig.id
    where recipeId = ${arg}
    `;
  database.all(sql, (err: Error, rows: RawReturn[]) => {
    const recipe = prettyRecipe(rows);
    event.reply("recipe-retrieved", (err && err.message) || recipe);
  });
});
