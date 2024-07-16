import {ipcMain} from "electron";
import {database} from "../index";
import { prettySearch, SearchRecipeRawReturn } from "../util/pretty-search";

ipcMain.on("search", (event, arg: string) => {
  console.log("we made it into search", arg);
  const sql = `
    select r.id as id, name, item, measurement, description, i.id as ingId from recipe r
    left join ingredientGroup ig on r.id=ig.recipeId
    left join ingredient i on ig.id=i.ingredientGroupId
    where i.item like "%${arg}%";
  `;
  database.all(sql, (err, rows: SearchRecipeRawReturn[]) => {
    console.log("Here ya go!", rows);
    const recipes = prettySearch(rows);
    event.reply("search-return", (err && err.message) || recipes);
  });
});