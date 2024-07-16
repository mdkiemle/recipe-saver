import {ReactElement, createContext, useState} from "react";
import {Setter} from "../models/setter";

export interface BaseDashboardContext {
  search: string;
  setSearch: Setter<string>;
  folderId: number;
  setFolderId: Setter<number>;
  // Normally might do something like with search query in url, but this feels fine
  activeSearch: boolean;
  setActiveSearch: Setter<boolean>;
}

export interface DashboardContextProps {
  children: React.ReactNode;
}

const DashboardContext = createContext<BaseDashboardContext>({
  search: "",
  setSearch: () => undefined,
  folderId: 0,
  setFolderId: () => undefined,
  activeSearch: false,
  setActiveSearch: () => undefined,
});

const DashboardContextProvider = (props: DashboardContextProps): ReactElement => {
  const [search, setSearch] = useState("");
  const [folderId, setFolderId] = useState(0);
  const [activeSearch, setActiveSearch] = useState(false);
  return (
    <DashboardContext.Provider value={{search, setSearch, folderId, setFolderId, activeSearch, setActiveSearch}}>
      {props.children}
    </DashboardContext.Provider>
  );
};

export {DashboardContextProvider, DashboardContext};
