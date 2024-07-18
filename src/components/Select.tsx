import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import clsx from "clsx";
import React, {ReactElement, useMemo} from "react";
import { IdName } from "../models/generic";
import { Setter } from "../models/setter";
import { FaChevronDown } from "react-icons/fa";

export interface SelectProps<T> {
  selected: number;
  setSelected: Setter<number>
  options: T[];
}

const Select = <T extends IdName>({selected, setSelected, options}: SelectProps<T>): ReactElement => (
  <Listbox value={selected} onChange={setSelected}>
    <ListboxButton
        className={clsx(
          'relative block w-full rounded-lg bg-white py-2 pr-8 pl-4 text-left text-black text-md',
          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
        )}
      >
        {options.find(option => option.id === selected)?.name}
        {/* <ChevronDownIcon
          className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
          aria-hidden="true"
        /> */}
        <FaChevronDown
          className="group pointer-events-none absolute top-3 right-2.5 size-4 fill-black/60"
          aria-hidden="true"
        />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom start"
        transition
        className={clsx(
          'w-[var(--button-width)] z-50 rounded-xl border border-white bg-white p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none',
          'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
        )}
      >
        {options.map((option) => (
          <ListboxOption
            key={option.id}
            value={option.id}
            className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-blue-500/10 hover:bg-blue-500"
          >
            <div className="text-sm/6 text-black">{option.name}</div>
          </ListboxOption>
        ))}
      </ListboxOptions>
  </Listbox>
);

export {Select}
