import {ReactElement, useState} from "react";
import { Setter } from "../models/setter";
import { IdName } from "../models/generic";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import clsx from "clsx";
import { FaChevronDown } from "react-icons/fa";

export interface FilterSelectProps<T> {
  selected: T;
  setSelected: Setter<T>
  options: T[];
}

const FilterSelect = <T extends IdName>({selected, setSelected, options}: FilterSelectProps<T>): ReactElement => {
  const [filter, setFilter] = useState("");

  const filtered = filter === "" ? options : options.filter(option => option.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));

  return (
    <Combobox value={selected} onChange={setSelected} onClose={() => setFilter("")}>
      <div className="relative">
        <ComboboxInput
          className={clsx(
            'relative block w-full rounded-lg bg-white py-2 pr-8 pl-4 text-left text-black text-md',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )}
          displayValue={(option: T) => option?.name}  
          onChange={event => setFilter(event.target.value)}
          placeholder="Choose Recipe..."
        />
        <ComboboxButton className="group absolute inset-y-0 right-0 px-4"
        >
          <FaChevronDown
            className="group pointer-events-none absolute top-3 right-2.5 size-4 fill-black/60"
            aria-hidden="true"
          />
        </ComboboxButton>
      
      <ComboboxOptions
        // anchor="bottom"
        transition
        className={clsx(
          'w-[var(--input-width)] z-50 absolute top-10 rounded-xl border max-h-40 overflow-y-scroll border-white bg-white p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none',
          'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
        )}
      >
        {filtered.map(option => (
          <ComboboxOption key={option.id} value={option} className="data-[focus]:bg-purple-100">
            <div className="text-sm/6 text-black cursor-pointer">{option.name}</div>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
      </div>
    </Combobox>
  );
};

export {FilterSelect};
