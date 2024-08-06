import React, {ReactElement, useEffect, useMemo, useRef, useState} from "react";
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
  type?: keyof React.ReactHTML;
}

const ToggleInput = ({id, isEditing, value, onBlur, className, editingStyle, maxLength, validate = false, autoFocus = false, type = "span"}: ToggleInputProps): ReactElement => {
  const [text, setText] = useState(value ?? "");
  const ref = useRef<HTMLInputElement>(null)

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && ref.current) ref.current.blur();
  };
  
  const el = useMemo(() => React.createElement(type, {className: clsx(className)}, text), [text, className]);

  useEffect(() => {
    if (value !== text) setText(value);
  }, [value]);
  return (<>
    {
      isEditing ? <Input
        ref={ref}
        id={id}
        value={text}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        className={clsx("rounded-md px-4 py-2", className, editingStyle || "border-2 border-gray-400 cursor-auto")}
        readOnly={!isEditing}
        maxLength={maxLength}
        autoFocus={autoFocus}
      /> : el
    }
    </>
  );
};

export {ToggleInput};
