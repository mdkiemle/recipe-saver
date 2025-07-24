import { BrowserWindow, ipcMain } from "electron";

let dev = false;
if (
    process.defaultApp ||
    /[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
    /[\\/]electron[\\/]/.test(process.execPath)
) {
  dev = true;
}

declare const SECONDARY_WINDOW_WEBPACK_ENTRY: string;

ipcMain.on("viewOnlyWindow", (event, arg: {id: string, name: string}) => {
  let win = new BrowserWindow({
    height: 800,
    width: 1000,
    title: arg.name,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      additionalArguments: [`--${arg.id}`]
    }
  });
  console.log("What is this value: ", SECONDARY_WINDOW_WEBPACK_ENTRY);
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
  win.webContents.once("dom-ready", () => {
    console.log("HEY!");
    win.webContents.send("load-recipe", arg.id);
  });
  win.loadURL(SECONDARY_WINDOW_WEBPACK_ENTRY);
  if (dev) win.webContents.openDevTools();
});