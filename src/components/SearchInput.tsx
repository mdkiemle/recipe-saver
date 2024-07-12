import { Input } from "@headlessui/react";
import React, {ReactElement, useState} from "react";
import { PiMagnifyingGlass } from "react-icons/pi";

export interface SearchInputProps {
  onEnter?: () => void;
}

const SearchInput = ({onEnter}: SearchInputProps): ReactElement => {
  const [search, setSearch] = useState("");
  return (
    <div className="flex relative bg-white max-w-sm justify-center items-center px-2 py-1 rounded-md gap-2 focus-within:ring-2 ring-orange-500">
      <PiMagnifyingGlass />
      <Input
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full focus:outline-none appearance-none"
        placeholder="Search ingredients..."
      />
    </div>
  );
};

export {SearchInput}
