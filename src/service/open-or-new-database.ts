import { BrowserWindow, dialog, ipcMain } from "electron";
import { updateDatabase } from "../index";


ipcMain.on("create-new-database", (event, arg) => {
  dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
    properties: ["createDirectory"],
    filters: [{name: "Sqlite Database", extensions: ["sqlite3", "db", "sqlite", "db3"]}],
  }).then(result => {
    if(result.canceled) return;
    updateDatabase(result.filePath, event, "new-database-created", "success");
    // Set up new database
    // database.close();
    // database = new sqlite.Database(result.filePath, (err: any) => {
    //   if (err) console.error("Database opening error: ", err);
    //   setup(database);
    // }).exec("PRAGMA foreign_keys=ON");
    // ipcMain.emit("loaded-new-db");
  });
});

ipcMain.on("load-new-database", (event, arg) => {
  dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
    properties: ["openFile"],
    filters: [{name: "Sqlite Database", extensions: ["sqlite3", "db", "sqlite", "db3"]}],
  }).then(result => {
    if(result.canceled) return;
    updateDatabase(result.filePaths[0], event, "database-loaded", "success");
  });
});