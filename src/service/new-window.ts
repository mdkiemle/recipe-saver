import { BrowserWindow, ipcMain } from "electron";
import path from "path";

ipcMain.on("viewOnlyWindow", (event, arg: {url: string, name: string}) => {
  let win = new BrowserWindow({
    title: arg.name,
    autoHideMenuBar: true,
  });

  console.log("Inside ipcMain function", `${path.join(__dirname, arg.url)}`);
  // win.webContents.on("dom-ready", () => {
  //   win.once("page-title-updated", e => e.preventDefault());
  //   win.show();
  //   win.loadURL(arg.url);
  //   // win.loadURL(path.join(__dirname, arg.url));
  //   // win.loadURL(path.join(arg.url).catch(error => console.log("Error?", error));
  // });
  win.on("closed", () => {
    win = null;
  });
  win.loadURL(arg.url);
  win.webContents.openDevTools();
});