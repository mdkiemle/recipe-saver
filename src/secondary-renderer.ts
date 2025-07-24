import { ipcRenderer } from "electron";
import "./view-only";
import './index.css';

ipcRenderer.on("load-recipe", (e, data) => {
  console.log("We have received the load-recipe request: ", data, process.execArgv, process.argv);
  ipcRenderer.send("get-recipe", data);
});
