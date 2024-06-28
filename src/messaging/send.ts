import {ipcRenderer} from "electron";

export const send = (reqName: string, message: string): Promise<any> => {
  return new Promise((resolve => {
    ipcRenderer.once("async-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send(reqName, message);
  }));
}