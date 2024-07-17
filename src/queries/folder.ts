import {ipcMain} from "electron";
import {database} from "../index";
import { RecipeReturn } from "../views/dashboard";

ipcMain.on("get-all-folders", (event, arg) => {
	const sql = `select * from folder`;
	database.all(sql, (err: Error, rows) => {
		event.reply("folders-get", (err && err.message) || rows);
	});
});

// ipcMain.on("get-recipes-by-folderId", (event, arg: number) => {
//   const sql = `
//     select r.name as name, r.id as id, description from folder f
//     left join recipe r where r.folderId = ${arg}
//   `;
//   database.all(sql, (err: Error, rows) => {
//     event.reply("recipes-in-folder", (err && err.message) || rows);
//   });
  
// });

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
  `;
  const querySql = "select * from folder";
  console.log("are we here?", createSql);
  database.serialize(() => {
    database.run(createSql, (err) => {
      console.log("we ran this shit", err);
      if (err) event.reply("create-folder-error", err.message);
    });
    database.all(querySql, (err, rows) => {
      event.reply("folders-get", (err && err.message) || rows);
    });
  });
});
