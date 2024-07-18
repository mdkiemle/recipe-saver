import {ipcMain} from "electron";
import {database} from "../index";
import { prettySearch, SearchRecipeRawReturn } from "../util/pretty-search";

// Not the best way to do this I'm sure, but it's fine I promise.

const noFolderSearch = (search: string): string => `
  select r.id as id, name, item, measurement, description, i.id as ingId from recipe r
  left join ingredientGroup ig on r.id=ig.recipeId
  left join ingredient i on ig.id=i.ingredientGroupId
  where i.item like "%${search}%";
`;

const withFolderSearch = (search: string, id: number): string => `
  select r.id as id, r.name as name, item, measurement, description, i.id as ingId from folderRecipe fr
  left join recipe r on r.id = fr.recipeId
  left join folder f on f.id = fr.folderId
  left join ingredientGroup ig on r.id = ig.recipeId
  left join ingredient i on i.ingredientGroupId = ig.id
  where i.item like "%${search}%" and fr.folderId = ${id};
`;

ipcMain.on("search", (event, arg: [string, number?]) => {
  const [searchVal, folderId] = arg;
  const sql = folderId ? withFolderSearch(searchVal, folderId) : noFolderSearch(searchVal)
  database.all(sql, (err, rows: SearchRecipeRawReturn[]) => {
    const recipes = prettySearch(rows);
    event.reply("search-return", (err && err.message) || recipes);
  });
});