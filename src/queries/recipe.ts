import {ipcMain} from "electron";
import {database} from "../index";
import {RawReturn, prettyRecipe} from "../util/pretty-recipe";
import {setQueryBuilder} from "../util/set-query-builder";
import {RecipeReturn} from "../views/dashboard";
import {RecipeTextUpdate, IngredientUpdates, AddIngredientGroup, AddIngredientVars} from "../models/recipe";


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

ipcMain.on("get-recipe", (event, arg: number) => {
  const sql = recipeQuery(arg);
  database.all(sql, (err: Error, rows: RawReturn[]) => {
    const recipe = prettyRecipe(rows);
    event.reply("recipe-retrieved", (err && err.message) || recipe);
  });
});



ipcMain.on("update-ingredient", (event, {id, item, measurement}: IngredientUpdates) => {
  const keyValues = {item, measurement};
  const setQuery = setQueryBuilder(keyValues);
  if (!setQuery) return event.reply("update-ingredient-return", "No update made");
  const sql = `
    update ingredient
    set ${setQuery}
    where id = ${id}
    returning *;
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

ipcMain.on("update-description", (event, {id, text}: RecipeTextUpdate) => {
  const updateSql = `
    update recipe
    set description = "${text}"
    where id = ${id}
    returning id, description;
  `;
  database.get(updateSql, (err, row) => {
    console.log("testing", row);
    event.reply("update-description-return", (err && err.message) || row);
  });
});

ipcMain.on("update-instructions", (event, {id, text}: RecipeTextUpdate) => {
  const updateSql = `
    update recipe
    set instructions = "${text}"
    where id = ${id}
    returning id, instructions;
  `;
  database.get(updateSql, (err, row) => {
    event.reply("update-instructions-return", (err && err.message) || row);
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
    console.log("new ingredient?", row);
    event.reply("add-ingredient-return", (err && err.message) || row);
  });
});
