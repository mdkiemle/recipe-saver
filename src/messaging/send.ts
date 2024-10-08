import {ipcRenderer} from "electron";
import { RecipeReturn } from "../views/dashboard";
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
