import {ipcMain} from "electron";
import {database} from "../index";

ipcMain.on("get-all-folders", (event, arg) => {
	const sql = `select * from folder`;
	database.all(sql, (err: Error, rows) => {
		event.reply("folders-get", (err && err.message) || rows);
	});
});