import { Input } from "@headlessui/react";
import React, {ReactElement, useState} from "react";
import { PiMagnifyingGlass } from "react-icons/pi";
import { Setter } from "../models/setter";

export interface SearchInputProps {
  search: string;
  setSearch: Setter<string>
  onEnter: (value: string) => void;
}

const SearchInput = ({search, setSearch, onEnter}: SearchInputProps): ReactElement => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && e.currentTarget.value !== "") onEnter(e.currentTarget.value);
  };
  
  return (
    <div className="flex relative bg-white max-w-sm justify-center items-center px-5 py-2 rounded-md gap-2 focus-within:ring-2 ring-orange-500">
      <PiMagnifyingGlass className="w-5 h-5"/>
      <Input
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full focus:outline-none appearance-none"
        placeholder="Search recipes by ingredients..."
      />
    </div>
  );
};

export {SearchInput}
