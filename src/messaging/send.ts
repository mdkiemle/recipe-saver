import {ipcRenderer} from "electron";

export const send = (message: string): Promise<any> => {
  return new Promise((resolve => {
    ipcRenderer.once("async-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send("async-message", message);
  }));
}