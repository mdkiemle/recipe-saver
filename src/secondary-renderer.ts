import { ipcRenderer } from "electron";
import "./view-only";
import './index.css';

ipcRenderer.on("load-recipe", (e, data) => {
  ipcRenderer.send("get-recipe", data);
});
