import {ipcMain} from "electron";
import {database} from "../index";
import {RawReturn, prettyRecipe} from "../util/pretty-recipe";
import {setQueryBuilder} from "../util/set-query-builder";
import {RecipeTextUpdate, IngredientUpdates, AddIngredientGroup, AddIngredientVars, RecipeUpdates, TimerUpdates, Timer, AddTimerVars, DeleteGroupReturn, DeleteIngredientReturn, Folder, RecipeLink, AddRecipeLinkVars, Ingredient, IngredientGroup, DeleteLinkVars, DeleteTimerReturn, Recipe, TimerUpdateVars, RecipeUpdateVars, CopyRecipeVars} from "../models/recipe";
import { returnValues } from "../util/sql-returning";
import { RecipeReturn } from "../types";
import { addQueryBuilder } from "../util/add-query-builder";
import { buildFolders, buildIngredientList } from "../util/multiple-line-transactions";


// Might not be necessary? But just in case I want to use this elsewhere.
export const recipeQuery = (id: number): string => `
  select r.id, description, notes, r.name as name, instructions,
  ig.id as groupId, groupName, i.id as ingredientId, i.measurement as measurement,
  item, totalTime from recipe r
  left join ingredientGroup ig on r.id=ig.recipeId
  left join ingredient i on i.ingredientGroupId=ig.id
  where r.id = ${id}
  order by ig.id, i.id;
`;

export const timerQuery = (id: number): string => `
  select id, name, minTime, maxTime, measurement from timer where recipeId = ${id};
`;

export const recipeToRecipe = (id: number): string => `
  select r2.id as id, r2.name as name, label from recipeToRecipe rtr
  left join recipe r1 on r1.id = rtr.recipeParentId
  left join recipe r2 on r2.id = rtr.recipeChildId
  where rtr.recipeParentId = ${id};
`;

export const recipeLinkFromIds = (parentId: number, childId: number) => `
  select r2.id as id, r2.name as name, label from recipeToRecipe rtr
  left join recipe r1 on r1.id = rtr.recipeParentId
  left join recipe r2 on r2.id = rtr.recipeChildId
  where rtr.recipeParentId = ${parentId} AND rtr.recipeChildId = ${childId};
`;

/**
 * select instructions, folder.name as folderName
from folder_recipe fr
join recipe on recipe.id = fr.recipeId
join folder on folder.id = fr.folderId
where fr.folderId = 3;
 */

ipcMain.on("get-recipes", (event) => {
  const sql = "select id, name from recipe";
  database.all(sql, (err: Error, rows: RecipeReturn) => {
    event.reply("get-recipes-return", (err && err.message) || rows);
  });
});

ipcMain.on("get-recipes-no-folder", (event) => {
  const sql = "select id, name, description from recipe r left join folderRecipe fr on fr.recipeId = r.id where fr.recipeId is null"
  database.all(sql, (err: { message: any; }, rows: any) => {
    event.reply("get-recipes-no-folder-return", (err && err.message) || rows);
  });
});

ipcMain.on("get-recipe", (event, arg: number) => {
  const sql = recipeQuery(arg);
  database.all(sql, (err: Error, rows: RawReturn[]) => {
    if (err) return event.reply("recipe-retrieved", err.message);
    database.all(timerQuery(arg),(err: { message: any; }, timers: Timer[]) => {
      if (err) return event.reply("recipe-retrieved", err.message);
      const recipe = prettyRecipe(rows, timers);
      event.reply("recipe-retrieved", recipe);
    });
  });
});

ipcMain.on("get-recipe-links", (event, arg: number) => {
  const sql = recipeToRecipe(arg);
  database.all(sql, (err: Error, rows: RecipeLink[]) => {
    event.reply("get-recipe-links-return", (err && err.message) || rows)    
  });
});

ipcMain.on("create-recipe-link", (event, {recipeChildId, recipeParentId, label}: AddRecipeLinkVars) => {
  const sql = `
    insert into recipeToRecipe (recipeParentId, recipeChildId, label)
    values (${recipeParentId}, ${recipeChildId}, "${label}");
  `;
  database.exec(sql, (err: { message: any; }) => {
    if (err && err.message) return event.reply("create-recipe-link-return", err.message);
    database.get(recipeLinkFromIds(recipeParentId, recipeChildId), (err: { message: any; }, row: RecipeLink) => {
      event.reply("create-recipe-link-return", (err && err.message) || row);
    });
  });
});

ipcMain.on("update-recipe", (event, {id, updates}: RecipeUpdates) => {
  const setQuery = setQueryBuilder(updates);
  const returning = returnValues(updates);
  if (!(setQuery && returning)) return event.reply("update-recipe-return", "No update made");
  const sql = `
    update recipe
    set ${setQuery}
    where id = ${id}
    returning id, ${returning};
  `;
  database.get(sql, (err: { message: any; }, row: any) => {
    event.reply("update-recipe-return", (err && err.message) || row);
  });
});

ipcMain.on("update-totalTime", (event, id: number) => {
  const sql = `
    update recipe
    set totalTime = (
      select sum (maxTime)
      from timer
      where timer.recipeId = ${id}
    )
    where id = ${id}
    returning id, totalTime;
  `;
  database.get(sql, (err: { message: any; }, row: any) => {
    event.reply("update-totalTime-return", (err && err.message) || row);
  });
});

ipcMain.on("add-timer", (event, newTimer: AddTimerVars) => {
  const [values, keys] = addQueryBuilder(newTimer);
  const sql = `
    insert into timer (${keys})
    values (${values})
    returning id, name, minTime, maxTime, measurement;
  `;
  database.get(sql, (err: { message: any; }, row: any) => {
    event.reply("add-timer-return", (err && err.message) || row);
  });
});

ipcMain.on("update-timer", (event, {id, updates}: TimerUpdates) => {
  const setQuery = setQueryBuilder(updates);
  const returning = returnValues(updates);
  if (!(setQuery && returning)) return event.reply("update-timer-return", "No update made");
  const sql = `
    update timer
    set ${setQuery}
    where id = ${id}
    returning id, ${returning};
  `;

  database.get(sql, (err: { message: any; }, row: any) => {
    event.reply("update-timer-return", (err && err.message) || row);
  });
});

ipcMain.on("update-folder", (event, {id, name}: Folder) => {
  const sql = `
    update folder
    set name = "${name}"
    where id = ${id}
    returning *;
  `;
  database.get(sql, (err, row) => {
    event.reply("update-folder-return", (err && err.message) || row);
  });
});

ipcMain.on("copyGroupsWithIngs", (event, arg: {parentId: number, childId: number}) => {
  const getGroups = `
    select id from ingredientGroup where recipeId = ${arg.childId}
  `;
  const copy = `
    insert into ingredientGroup (groupName, recipeId)
    select groupName, "${arg.parentId}" from ingredientGroup where recipeId = ${arg.childId}
    returning id, groupName;
  `;
  // Need to do a few things in order so best to serialize it
  database.serialize(() => {
    const originalGroupIds: number[] = [];
    database.each(getGroups, (err, row: {id: number}) => {
      if (err && err.message) return event.reply("copyGroupsWithIngs-return", err.message);
      originalGroupIds.push(row.id);
    });
    // Copy original ingredient groups into our current recipe
    database.all(copy, (err, rows: IngredientGroup[]) => {
      if (err && err.message) return event.reply("copyGroupsWithIngs-return", err.message);
      // event.reply("copyGroupsWithIngs-return", (err && err.message) || rows);
      //@ts-ignore
      const copiedGroups: IngredientGroup[] | [] = rows.map(row => ({...row, ingredients: []}));
      originalGroupIds.forEach((id, idx) => {
        database.all(`
          insert into ingredient (item, measurement, ingredientGroupId)
          select item, measurement, "${copiedGroups[idx].id}" from ingredient where ingredientGroupId = ${id}
          returning id, item, measurement;
        `, (err: { message: any; }, rows: (Ingredient & {ingredientGroupId: number})[]) => {
          if (err && err.message) return event.reply("copyGroupsWithIngs-return", err.message);
          copiedGroups[idx].ingredients.push(...rows);
          if (idx === originalGroupIds.length - 1 ) {
            event.reply("copyGroupsWithIngs-return", copiedGroups);
          }
        });
      });
    });
  });
});


// We will need the full recipe in order to copy everything.
// Maybe we could instead just send the current recipe instead of querying for it?
ipcMain.on("copy-full-recipe", (event, {recipe, name, folderIds}: CopyRecipeVars): void => {
  database.serialize(() => {
    let recipeId = -1;
    database.get(`insert into recipe (name) values ("${name}") returning id;`, (err, row: {id: number}) => {
      if (err) return event.reply("copy-error", err?.message);
      recipeId = row.id;
      if (folderIds.length > 0) {
        const folderSql = buildFolders(folderIds, recipeId);
        database.exec(folderSql, (err: any) => {if (err && err.message) return event.reply("copy-error", err.message)});
      }
      // Create the "updates" portion so we can build the query for updating the recipe with values
      const recipeUpdates: Partial<RecipeUpdateVars> = {
          description: recipe.description,
          instructions: recipe.instructions,
          notes: recipe.notes,
          totalTime: recipe.totalTime,
        };
      const setQuery = setQueryBuilder(recipeUpdates);
      if (!setQuery) return event.reply("copy-error", "Error copying main values");
      const updateSql = `
        update recipe
        set ${setQuery}
        where id = ${recipeId};
      `;

      database.exec(updateSql, err => {if (err !== null) event.reply("copy-error", err.message)})
      // Timer time. (heh)
      recipe.timers.forEach((timer, idx) => {
        const addTimerVars = {name: timer.name, recipeId, minTime: timer.minTime, maxTime: timer.maxTime, measurement: timer.measurement}
        const [values, keys] = addQueryBuilder(addTimerVars);
        const sql = `
          insert into timer (${keys})
          values (${values});
        `;
        database.exec(sql, err => {if (err && err.message) return event.reply("copy-error", err.message)});
      });
      // Timers done, now ingredients / ingredient groups
      recipe.ingredientGroups.forEach(ingGroup => {
        const ingGroupSql = `
          insert into ingredientGroup (groupName, recipeId)
          values ("${ingGroup.groupName}", "${recipeId}")
          returning id;
        `;
        database.serialize(() => {
          database.get(ingGroupSql, (err, row: {id: number}) => {
            const groupId = row?.id;
            const ingSql = buildIngredientList(ingGroup.ingredients, groupId);
            database.exec(ingSql, err => {
              if (err !== null) event.reply("copy-error", err);
            });
          });
        });
      });
      // Finally, link to the old recipe and return when finished.
      database.exec(`
          insert into recipeToRecipe (recipeParentId, recipeChildId, label)
          values (${recipeId}, ${recipe.id}, "Original recipe");
        `, err => {
          if (err && err.message) return event.reply("copy-error", err.message);
          event.reply("copy-recipe-return", recipeId);
        });
    });
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
  database.get(sql, (err: Error, row: any) => {
    event.reply("update-ingredient-return", (err && err.message) || row);
  });
});

ipcMain.on("create-recipe", (event, {name, folderId}: {name: string, folderId: number}) => {
  const createSql = `insert into recipe (name) values ("${name}") returning id, name;`
  database.get(createSql, (err: { message: any; }, row: {id: number, name: string}) => {
    if (err) return event.reply("create-error", err?.message);
    if (folderId !== 0) {
      database.exec(`
        insert into folderRecipe (recipeId, folderId)
        values (${row.id}, ${folderId});
      `, (err: any) => console.log("err?", err));
    }
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
  database.get(updateSql, (err: { message: any; }, row: any) => {
    event.reply("update-groupName-return", (err && err.message) || row);
  });
});

ipcMain.on("add-ingGroup", (event, {recipeId, groupName}: AddIngredientGroup) => {
  const updateSql = `
    insert into ingredientGroup (groupName, recipeId)
    values ("${groupName}", ${recipeId})
    returning groupName, id;
  `;
  database.get(updateSql, (err: { message: any; }, row: any) => {
    event.reply("add-ingGroup-return", (err && err.message) || row);
  });
});

ipcMain.on("add-ingredient", (event, {ingredientGroupId, item, measurement}: AddIngredientVars) => {
  const addSql = `
    insert into ingredient (item, measurement, ingredientGroupId)
    values ("${item}", "${measurement}", ${ingredientGroupId})
    returning *;
  `;
  database.get(addSql, (err: { message: any; }, row: any) => {
    event.reply("add-ingredient-return", (err && err.message) || row);
  });
});

ipcMain.on("delete-recipe", (event, id: number) => {
  const deleteSql = `
    delete from recipe
    where id = ${id}
    returning id;
  `;
  database.get(deleteSql, (err: { message: any; }, row: any) => {
    event.reply("delete-recipe-return", (err && err.message) || row);
  });
});

ipcMain.on("delete-ingredient", (event, id: number) => {
  const deleteSql = `
    delete from ingredient
    where id = ${id}
    returning id, ingredientGroupId;
  `;
  database.get(deleteSql, (err: { message: any; }, row: DeleteIngredientReturn) => {
    event.reply("delete-ingredient-return", (err && err.message) || row);
  });
});

ipcMain.on("delete-ingredientGroup", (event, id: number) => {
  const deleteSql = `
    delete from ingredientGroup
    where id = ${id}
    returning id;
  `;
  database.get(deleteSql, (err: { message: any; }, row: DeleteGroupReturn) => {
    event.reply("delete-ingredientGroup-return", (err && err.message) || row);
  });
});

ipcMain.on("delete-recipe-link", (event, {recipeParentId, recipeChildId}: DeleteLinkVars) => {
  const deleteSql = `
    delete from recipeToRecipe
    where recipeParentId = ${recipeParentId} and recipeChildId = ${recipeChildId}
    returning recipeChildId;
  `;
  database.get(deleteSql, (err: { message: any; }, row: {recipeChildId: number}) => {
    event.reply("delete-recipe-link-return", (err && err.message) || row.recipeChildId);
  });
});

ipcMain.on("delete-timer", (event, id: number) => {
  const sql = `
    delete from timer where id = ${id}
    returning id;
  `;
  database.get(sql, (err: { message: any; }, row: DeleteTimerReturn) => {
    event.reply("delete-timer-return", (err && err.message) || row.id);
  });
});
