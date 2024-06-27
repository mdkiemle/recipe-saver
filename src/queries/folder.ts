import {ipcMain} from "electron";
import {database} from "../index";

ipcMain.on("get-all-folders", (event, arg) => {
	const sql = `select * from folder`;
	database.all(sql, (err: Error, rows) => {
		event.reply("folders-get", (err && err.message) || rows);
	});
});

ipcMain.on("get-recipes-by-folderId", (event, arg: number) => {
  const sql = `
    select r.name as name, r.id as id, description from folder f
    left join recipe r where r.folderId = ${arg}
  `;
  database.all(sql, (err: Error, rows) => {
    event.reply("recipes-in-folder", (err && err.message) || rows);
  });
});
