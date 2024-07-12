import {ipcMain} from "electron";
import {database} from "../index";

ipcMain.on("search", (event, arg: string) => {
  console.log("we made it into search", arg);
  const sql = `
    select r.id as id, name, item, measurement from recipe r
    left join ingredientGroup ig on r.id=ig.recipeId
    left join ingredient i on ig.id=i.ingredientGroupId
    where i.item like "%${arg}%";
  `;
  database.all(sql, (err, rows) => {
    console.log("Here ya go!", rows);
    event.reply("search-return", (err && err.message) || rows);
  });
});