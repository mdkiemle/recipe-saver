import {ipcMain} from "electron";
import {database} from "../index";
import { prettyRecipe } from "../util/pretty-recipe";

ipcMain.on("get-recipe", (event, arg: number) => {
  console.log("hey there!", arg, event);
  const sql = `select * from recipe r
    left join ingredientGroup ig on r.id=ig.recipeId
    left join ingredient i on i.ingredientGroupId=ig.id
    where ig.recipeId = ${arg}`;
  database.all(sql, (err, rows) => {
    console.log("we made it here", err, rows);
    const recipe = prettyRecipe(rows);
    event.reply("recipe-retrieved", (err && err.message) || recipe);
  });
});
