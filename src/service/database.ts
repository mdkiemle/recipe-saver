import { app, ipcMain, IpcMainEvent } from "electron";
import path from "path";
import fs from "fs";
import sqlite from "sqlite3";
import { setup } from '../util/db-setupd';

interface UserSettings {
  defaultLocation: string;
}

/**
 * This file will now contain all of the database related stuff, and not the main index.ts file.
 */


const userPath = app.getPath("userData");
const filePath = path.join(userPath, "user-settings.json");
const defaultSettings: UserSettings = {defaultLocation: ""}; // Might not even use this the first time.

export let database: sqlite.Database = undefined; // This is how we're gonna do it from now on.


// Might need to touch this up as we go.

const databaseSetup = (filepath?: string, event?: IpcMainEvent, channel?: string, response?: string): sqlite.Database => new sqlite.Database(filepath ?? `${userPath}/recipes.sqlite3`, (err: any) => {
  if (err) console.error("Database opening error: ", err);
  setup(database);
  if (event && channel && response) {
    event.reply(channel, response);
  }
}).exec("PRAGMA foreign_keys=ON");

export const updateDatabase = (filepath: string, event: Electron.IpcMainEvent, channel: string, response: string): void => {
  database.close();
  database = databaseSetup(filepath, event, channel, response);
};



// We only want to have the app start one time, ya know.
ipcMain.on("app-start", (event, args) => {
  /**
   * The purpose of this call is to determine if we already have default settings, and if we do,
   * we want to load the database from there and return an "all good", basically, and we don't show a landing page.
   * If we do not, it either means the person has a previous version of the app (and therefore already 
   * have a database just didn't pick where it was stored), or this is the first time they've started the app up.
   * Both cases, we want to return with a "nope", essentially, then 
   */
  fs.readFile(filePath, "utf8", (err, data) => {
    // This gets the user settings. If there is an error we want to return.
    if (err)
    {
      if (err.code === "ENOENT") {
        console.log("No such file exists at location specified");
        event.reply("finish-startup", "fail");
      } else {
        console.log("Error reading file: ", err);
      }
    }
    try {
      const userSettings = JSON.parse(data) as UserSettings;
      console.log("File contents: ", userSettings);
      databaseSetup(userSettings.defaultLocation); // This sets our database to where our defaultLocation is. (or should)
    } catch (e) {
      console.log("Error parsing user settings", e);
    }
  });
});

// All this does is return the string of the default location where a database is stored, in case someone has started the app
// before this update.
ipcMain.on("get-default-location", event => {

});
