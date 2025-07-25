import React, {ReactElement, useContext, useEffect, useState} from "react";
import { SearchInput } from "./SearchInput";
import { DashboardContext } from "../context/DashboardContext";
import { useSearchParams } from "react-router-dom";

export interface SearchProps {
  handleSearch: (value: string) => void;
}

const Search = ({handleSearch}: SearchProps): ReactElement => {
  const {search, setSearch} = useContext(DashboardContext);
  return (
    <div className="flex-1">
      <SearchInput onEnter={handleSearch} search={search} setSearch={setSearch}/>
    </div>
  );
};

export {Search};
