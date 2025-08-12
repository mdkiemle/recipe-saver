import { BrowserWindow, dialog, ipcMain } from "electron";
import { updateDatabase } from "../service/database";


ipcMain.on("create-new-database", (event, arg) => {
  dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
    properties: ["createDirectory"],
    filters: [{name: "Sqlite Database", extensions: ["sqlite3", "db", "sqlite", "db3"]}],
  }).then(result => {
    if(result.canceled) return;
    updateDatabase(result.filePath, event, "new-database-created", "success");
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