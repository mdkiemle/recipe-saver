// import { ipcMain } from "electron";
// import sqlite from "sqlite3";

// const database = new sqlite.Database("./public/db.sqlite3", err => {
//   if (err) console.error("Database opening error: ", err);
// });

// ipcMain.on("async-message", (event, arg) => {
//   const sql = arg;
//   database.all(sql, (err, rows) => {
//     event.reply("async-reply", (err && err.message) || rows);
//   });
// });