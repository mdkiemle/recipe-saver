import { Input } from "@headlessui/react";
import {clsx} from "clsx";
import React, {ReactElement, useEffect, useState} from "react";

export interface ToggleNumberInputProps {
  id: string;
  isEditing: boolean;
  value?: number;
  className?: string;
  editingStyle?: string;
  onBlur?: (newValue: number) => void;
  maxLength?: number;
  validate?: boolean;
  autoFocus?: boolean;
}

const ToggleNumberInput = ({id, isEditing, value, onBlur, className, editingStyle, maxLength, validate = false, autoFocus = false}: ToggleNumberInputProps): ReactElement => {
  const [number, setNumber] = useState(Number(value) ?? 0)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => setNumber(Number(e.target.value));
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    if(!isEditing || Number(value) === Number(e.target.value)) return;
    onBlur?.(Number(e.target.value));
  };
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    e.target.select();
  };

  // For when the measurement changes in TimerItem
  useEffect(() => {
    if (value !== number) setNumber(value);
  }, [value])
  return (
    <>
      {isEditing ? <Input
        id={id}
        type="number"
        value={number}
        onChange={handleChange}
        className={clsx("rounded-md px-4 py-2", className, editingStyle || "border-2 border-gray-400 cursor-auto")}
        readOnly={!isEditing}
        maxLength={maxLength}
        autoFocus={autoFocus}
        onFocus={handleFocus}
        onBlur={handleBlur}
        draggable="false"
      /> : <span className={clsx(className)}>{number}</span> }
    </>
  );
};

export {ToggleNumberInput};
