import React, {ReactElement, useContext, useState} from "react";
import { SearchInput } from "./SearchInput";
import { DashboardContext } from "../context/DashboardContext";

export interface SearchProps {
  handleSearch: (value: string) => void;
  handleReset: () => void;
  resultCount?: number;
}

const Search = ({handleSearch, handleReset, resultCount}: SearchProps): ReactElement => {
  const {search, setSearch, activeSearch} = useContext(DashboardContext);

  const resetSearch = (): void => {
    setSearch("");
    handleReset();
  };

  return (
    <div>
      <SearchInput onEnter={handleSearch} search={search} setSearch={setSearch}/>
      <div className="container h-8 flex gap-2 items-center">
      {resultCount >= 0 && activeSearch && 
        <>
          <span className="text-orange-800">Showing {resultCount} results for &quot;{search}&quot;</span>
          <button onClick={resetSearch} className="link">Clear results</button>
        </>
      }
      </div>
    </div>
  );
};

export {Search};
