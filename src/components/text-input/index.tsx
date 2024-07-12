import React, {ReactElement} from "react";
import { Setter } from "../../models/setter";
import { Field, Input, Label, _internal_ComponentInput } from "@headlessui/react";


export interface TextInputProps {
  id: string;
  value: string;
  onChange: Setter<string>;
  label?: string;
}

const TextInput = ({id, value, onChange, label}: TextInputProps): ReactElement => (
  <Field className="grid grid-rows-2 max-w-md">
    {label && <Label htmlFor={id}>{label}</Label>}
    <Input
      id={id}
      value={value}
      className="px-4 py-2 rounded-md"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    />
  </Field>
);

export {TextInput};
