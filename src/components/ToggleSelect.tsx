import React, {ReactElement, useState} from "react";
import { IdName } from "../models/generic";
import { Select } from "@headlessui/react";
import clsx from "clsx";
import { FaChevronDown } from "react-icons/fa";

export interface ToggleSelectProps {
  value?: string;
  options: string[];
  handleSelect: (value: string) => void;
  isEditing: boolean;
}

const ToggleSelect = ({value, options, handleSelect, isEditing}: ToggleSelectProps): ReactElement => {
  const [selected, setSelected] = useState(value);
  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelected(e.target.value);
    handleSelect(e.target.value);
  };

  return (<> 
      {isEditing ? <div className="relative">
        <Select value={selected} onChange={handleOnChange}
          className={clsx(
            " w-full appearance-none rounded-lg border-none py-1.5 px-3 text-mds",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:ring-2",
            // Make the text of each option black on Windows
            "*:text-black")}
        >
          {options.map(option =>
            <option key={option} value={option}>{option}</option>
          )}
        </Select>
        <FaChevronDown className="group pointer-events-none absolute top-2.5 right-0 size-4 fill-black" aria-hidden="true"/>
      </div> : <span>{selected}</span>}
    </>
  );
};

export {ToggleSelect};
