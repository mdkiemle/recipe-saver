import React, {ReactElement, useEffect, useState} from "react";
import {clsx} from "clsx";
import { Input } from "@headlessui/react";

export interface ToggleInputProps {
  id: string;
  isEditing: boolean;
  value?: string;
  className?: string;
  editingStyle?: string;
  onBlur?: (newValue: string) => void;
  maxLength?: number;
  validate?: boolean;
  autoFocus?: boolean;
}

const ToggleInput = ({id, isEditing, value, onBlur, className, editingStyle, maxLength, validate = false, autoFocus = false}: ToggleInputProps): ReactElement => {
  const [text, setText] = useState(value ?? "");

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    if (!isEditing || value === e.target.value) return;
    if (validate && e.target.value === "") {
      return setText(value);
    }
    onBlur?.(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => setText(e.target.value);
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    e.target.select();
  };

  useEffect(() => {
    if (value !== text) setText(value);
  }, [value]);
  return (<>
    {
      isEditing ? <Input
        id={id}
        value={text}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={handleChange}
        className={clsx("rounded-md px-4 py-2", className, editingStyle || "border-2 border-gray-400 cursor-auto")}
        readOnly={!isEditing}
        maxLength={maxLength}
        autoFocus={autoFocus}
      /> : <span className={clsx(className)}>{text}</span>
    }
    </>
  );
};

export {ToggleInput};
