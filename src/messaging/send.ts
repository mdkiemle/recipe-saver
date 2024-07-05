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

export const createRecipe = (name: string): Promise<IdName> => {
  return new Promise((resolve, reject) => {
    ipcRenderer.once("create-recipe-return", (e, args: IdName | string) => {
      if (typeof args === "string") {
        reject(args);
      } else {
        resolve(args);
      }
    });
    ipcRenderer.send("create-recipe", name);
  });
}