import {ipcMain} from "electron";
import {database} from "../index";
import {RawReturn, prettyRecipe} from "../util/pretty-recipe";
import {setQueryBuilder} from "../util/set-query-builder";
import {RecipeTextUpdate, IngredientUpdates, AddIngredientGroup, AddIngredientVars, RecipeUpdates} from "../models/recipe";
import { returnValues } from "../util/sql-returning";


// Might not be necessary? But just in case I want to use this elsewhere.
export const recipeQuery = (id: number): string => `
  select r.id, description, notes, name, instructions,
  ig.id as groupId, groupName, i.id as ingredientId, measurement, item from recipe r
  left join ingredientGroup ig on r.id=ig.recipeId
  left join ingredient i on i.ingredientGroupId=ig.id
  where r.id = ${id}
  order by ig.id, i.id;
`;

/**
 * select instructions, folder.name as folderName
from folder_recipe fr
join recipe on recipe.id = fr.recipeId
join folder on folder.id = fr.folderId
where fr.folderId = 3;
 */

ipcMain.on("get-recipes", (event) => {
  const sql = "select id, name, description from recipe";
  database.all(sql, (err: Error, rows: RecipeReturn) => {
    event.reply("get-recipes-return", (err && err.message) || rows);
  });
});

ipcMain.on("get-recipe", (event, arg: number) => {
  const sql = recipeQuery(arg);
  database.all(sql, (err: Error, rows: RawReturn[]) => {
    const recipe = prettyRecipe(rows);
    event.reply("recipe-retrieved", (err && err.message) || recipe);
  });
});

ipcMain.on("update-recipe", (event, {id, updates}: RecipeUpdates) => {
  console.log("what this", updates);
  const setQuery = setQueryBuilder(updates);
  const returning = returnValues(updates);
  console.log("update recipe stuff", setQuery, returning);
  if (!(setQuery && returning)) return event.reply("update-recipe-return", "No update made");
  const sql = `
    update recipe
    set ${setQuery}
    where id = ${id}
    returning id, ${returning};
  `;
  database.get(sql, (err, row) => {
    event.reply("update-recipe-return", (err && err.message) || row);
  });
});

ipcMain.on("update-ingredient", (event, {id, updates}: IngredientUpdates) => {
  const setQuery = setQueryBuilder(updates);
  const returning = returnValues(updates);
  if (!(setQuery && returning)) return event.reply("update-ingredient-return", "No update made");
  const sql = `
    update ingredient
    set ${setQuery}
    where id = ${id}
    returning id, ingredientGroupId, ${returning};
  `;
  database.get(sql, (err: Error, row) => {
    event.reply("update-ingredient-return", (err && err.message) || row);
  });
});

ipcMain.on("create-recipe", (event, arg: string) => {
  const createSql = `insert into recipe (name) values ("${arg}") returning id, name;`
  database.get(createSql, (err, row: {id: number, name: string}) => {
    if (err) return event.reply("create-error", err?.message);
    event.reply("create-recipe-return", (err && err.message) || row);
  });
});

ipcMain.on("update-groupName", (event, {id, text}: RecipeTextUpdate) => {
  const updateSql = `
    update ingredientGroup
    set groupName = "${text}"
    where id = ${id}
    returning id, groupName;
  `;
  database.get(updateSql, (err, row) => {
    event.reply("update-groupName-return", (err && err.message) || row);
  });
});

ipcMain.on("add-ingGroup", (event, {recipeId, groupName}: AddIngredientGroup) => {
  console.log("we are here?", groupName, recipeId);
  const updateSql = `
    insert into ingredientGroup (groupName, recipeId)
    values ("${groupName}", ${recipeId})
    returning groupName, id;
  `;
  database.get(updateSql, (err, row) => {
    console.log("the new group?", row);
    event.reply("add-ingGroup-return", (err && err.message) || row);
  });
});

ipcMain.on("add-ingredient", (event, {ingredientGroupId, item, measurement}: AddIngredientVars) => {
  console.log("we are adding ing", item, measurement);
  const addSql = `
    insert into ingredient (item, measurement, ingredientGroupId)
    values ("${item}", "${measurement}", ${ingredientGroupId})
    returning *;
  `;
  database.get(addSql, (err, row) => {
    event.reply("add-ingredient-return", (err && err.message) || row);
  });
});

ipcMain.on("delete-recipe", (event, id: number) => {
  const deleteSql = `
    delete from recipe
    where id =${id}
    returning id;
  `;
  database.get(deleteSql, (err, row) => {
    event.reply("delete-recipe-return");
  });
});

ipcMain.on("delete-ingredient", (event, id: number) => {
  const deleteSql = `
    delete from ingredient
    where id = ${id}
    returning id, ingredientGroupId;
  `;
  database.get(deleteSql, (err, row) => {
    console.log("huh", row);
    event.reply("delete-ingredient-return", (err && err.message) || row);
  });
});

ipcMain.on("delete-ingredientGroup", (event, id: number) => {
  console.log("what's going on here", id);
  const deleteSql = `
    delete from ingredientGroup
    where id = ${id}
    returning id;
  `;
  database.get(deleteSql, (err, row) => {
    console.log("deleted ingGroup id", row);
    event.reply("delete-ingredientGroup-return", (err && err.message) || row);
  });
});
