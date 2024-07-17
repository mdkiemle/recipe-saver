import {ReactElement, createContext, useState} from "react";
import {Setter} from "../models/setter";
import { Folder } from "../models/recipe";

export interface BaseDashboardContext {
  search: string;
  setSearch: Setter<string>;
  folder: Folder;
  setFolder: Setter<Folder>;
  // Normally might do something like with search query in url, but this feels fine
  activeSearch: string;
  setActiveSearch: Setter<string>;
}

export interface DashboardContextProps {
  children: React.ReactNode;
}

const DashboardContext = createContext<BaseDashboardContext>({
  search: "",
  setSearch: () => undefined,
  folder: {id: 0, name: ""},
  setFolder: () => undefined,
  activeSearch: "",
  setActiveSearch: () => undefined,
});

const DashboardContextProvider = (props: DashboardContextProps): ReactElement => {
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState<Folder>({id: 0, name: ""});
  const [activeSearch, setActiveSearch] = useState("");
  return (
    <DashboardContext.Provider value={{search, setSearch, folder, setFolder, activeSearch, setActiveSearch}}>
      {props.children}
    </DashboardContext.Provider>
  );
};

export {DashboardContextProvider, DashboardContext};
