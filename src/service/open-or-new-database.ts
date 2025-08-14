import { BrowserWindow, dialog, ipcMain } from "electron";
import { updateDatabase, updateSettings } from "../service/database";
import { FileOptions } from "../messaging/send";


ipcMain.on("create-new-database", (event, arg: FileOptions) => {
  dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
    properties: ["createDirectory"],
    filters: [{name: "Sqlite Database", extensions: ["sqlite3", "db", "sqlite", "db3"]}],
  }).then(result => {
    if(result.canceled) return;
    updateDatabase(result.filePath, event, "new-database-created", "success");
    if (arg?.saveAsDefault) {
      updateSettings(result.filePath);
    }
  });
});

ipcMain.on("load-new-database", (event, arg: FileOptions) => {
  dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
    properties: ["openFile"],
    defaultPath: arg?.path,
    filters: [{name: "Sqlite Database", extensions: ["sqlite3", "db", "sqlite", "db3"]}],
  }).then(result => {
    if(result.canceled) return;
    updateDatabase(result.filePaths[0], event, "database-loaded", "success");
    if (arg?.saveAsDefault) {
      updateSettings(result.filePaths[0]);
    }
  });
});