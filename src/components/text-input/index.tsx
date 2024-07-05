import {ReactElement} from "react";
import { Setter } from "../../models/setter";


export interface TextInputProps {
  id: string;
  value: string;
  onChange: Setter<string>;
  label?: string;
}

const TextInput = ({id, value, onChange, label}: TextInputProps): ReactElement => (
  <div className="container flex flex-col">
    {label && <label htmlFor={id}>{label}</label>}
    <input
      id={id}
      value={value}
      className="px-4 py-2 rounded-md"
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export {TextInput};
