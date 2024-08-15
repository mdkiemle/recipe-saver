import {ipcMain} from "electron";
import {database} from "../index";
import { RecipeReturn } from "../views/dashboard";
import { IdName } from "../models/generic";

ipcMain.on("get-all-folders", (event, arg) => {
	const sql = `select * from folder`;
	database.all(sql, (err: Error, rows) => {
		event.reply("folders-get", (err && err.message) || rows);
	});
});

ipcMain.on("get-recipes-by-folderId", (event, arg: number) => {
  const sql = `
    select r.id as id, r.name as name, description from folderRecipe fr
    join recipe r on r.id = fr.recipeId
    join folder f on f.id = fr.folderId
    where fr.folderId = ${arg}
  `;
  database.all(sql, (err, rows: RecipeReturn[]) => {
    event.reply("get-recipes-by-folderId-return", (err && err.message) || rows);
  });
});

ipcMain.on("create-folder", (event, arg: string) => {
  const createSql = `
    INSERT into folder (name)
    values ("${arg}")
    returning *;
  `;
  database.get(createSql, (err, row) => {
    event.reply("create-folder-return", (err && err.message) || row);
  });
});

ipcMain.on("add-to-folder", (event, {recipeId, folderId}) => {
  const createSql = `
    insert into folderRecipe (recipeId, folderId)
    values (${recipeId}, ${folderId});
  `;
  database.exec(createSql, (err) => {
    event.reply("add-to-folder-return", (err && err?.message) || true);
  });
});

ipcMain.on("remove-from-folder", (event, {recipeId, folderId}) => {
  const deleteSql = `
    delete from folderRecipe
    where recipeId = ${recipeId} and folderId = ${folderId}
  `;
  database.exec(deleteSql, (err) => {
    event.reply("remove-from-folder-return", (err && err?.message) || true);
  });
});

ipcMain.on("get-folders-for-recipe", (event, arg: number) => {
  const createSql = `
    select f.id as id, f.name as name from folderRecipe fr
    left join folder f on f.id = fr.folderId
    left join recipe r on r.id = fr.recipeId
    where r.id = ${arg};
  `;
  database.all(createSql, (err: Error, rows: IdName) => {
    event.reply("get-folders-for-recipe-return", (err && err.message) || rows);
  });
});

