import React, {ReactElement, useContext, useEffect, useState} from "react";
import { SearchInput } from "./SearchInput";
import { DashboardContext } from "../context/DashboardContext";
import { useSearchParams } from "react-router-dom";

export interface SearchProps {
  handleSearch: (value: string) => void;
  handleReset: () => void;
  resultCount?: number;
}

const Search = ({handleSearch, handleReset, resultCount}: SearchProps): ReactElement => {
  const {search, setSearch, activeSearch, folder} = useContext(DashboardContext);

  const resetSearch = (): void => {
    setSearch("");
    handleReset();
  };

  console.log("I am inside the search", activeSearch);

  // useEffect(() => {
  //   resetSearch();
  // }, [folder.id]);

  return (
    <div className="flex-1">
      <SearchInput onEnter={handleSearch} search={search} setSearch={setSearch}/>
      <div className="container h-8 flex gap-2 items-center">
      {resultCount >= 0 && activeSearch && 
        <>
          <span className="text-orange-800">Showing {resultCount} results for &quot;{activeSearch}&quot;</span>
          <button onClick={resetSearch} className="link">Clear results</button>
        </>
      }
      </div>
    </div>
  );
};

export {Search};
