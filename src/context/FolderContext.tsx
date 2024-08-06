import {PropsWithChildren, ReactElement, createContext, useReducer} from "react";
import { Folder } from "../models/recipe";
import { useMount } from "../hooks/useMount";
import { getRequest } from "../messaging/send";

export interface BaseFolderContext {
  folders: Folder[];
  dispatch: React.Dispatch<FolderAction>;
}

const FolderContext = createContext<BaseFolderContext>({
  folders: [],
  dispatch: () => undefined,
});

export type FolderAction = 
  {type: "UPDATE_FOLDERS", payload: Folder[]} |
  {type: "ADD_FOLDER", payload: Folder};

const folderReducer = (state: Folder[], action: FolderAction): Folder[] => {
  switch (action.type) {
    case "UPDATE_FOLDERS":
      return [...action.payload]
    case "ADD_FOLDER":
      return [...state, action.payload];
    default: 
      return state;
  }
};

const FolderContextProvider = ({children}: PropsWithChildren): ReactElement => {
  const [folders, dispatch] = useReducer(folderReducer, []);
  useMount(() => {
    getRequest<Folder[], undefined>("get-all-folders", "folders-get", undefined)
    .then(res => {
      dispatch({type: "UPDATE_FOLDERS", payload: res});
    });
  });
  return <FolderContext.Provider value={{folders, dispatch}}>
    {children}
  </FolderContext.Provider>
};

export {FolderContextProvider, FolderContext}