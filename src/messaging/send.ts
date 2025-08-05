import {ipcRenderer} from "electron";
import { IdName } from "../models/generic";

export const send = (reqName: string, message: string): Promise<any> => {
  return new Promise((resolve => {
    ipcRenderer.once("async-reply", (_, arg) => {
      resolve(arg);
    });
    ipcRenderer.send(reqName, message);
  }));
};

export const getRequest = <T, K>(reqName: string, resName: string, input: K): Promise<T> => {
  return new Promise((resolve, reject) => {
    ipcRenderer.once(resName, (e, args: T | string) => {
      if (typeof args === "string") {
        reject(args);
      } else {
        resolve(args);
      }
    });
    ipcRenderer.send(reqName, input)
  });
};

export const printPrevew = (url: string) => {
  ipcRenderer.send("previewComponent", url);
};

export const newWindowViewOnly = (input: IdName) => {
  ipcRenderer.send("viewOnlyWindow", input);
};

export const createNewDatabase = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    ipcRenderer.once("new-database-created", (e, args: string) => {
      if (args === "success") {
        resolve(args);
      } else {
        reject(args);
      }
    });
    ipcRenderer.send("create-new-database");
  });
};

export const loadNewDatabase = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    ipcRenderer.once("database-loaded", (e, args: string) => {
      if (args === "success") {
        resolve(args);
      } else {
        reject(args);
      }
    });
    ipcRenderer.send("load-new-database");
  });
};
