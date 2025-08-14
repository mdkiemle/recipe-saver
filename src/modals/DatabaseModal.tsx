import {ReactElement} from "react";
import { Modal } from "./Modal";
import { Button, Checkbox, Field, Label, Switch } from "@headlessui/react";
import { ToggleInput } from "../components/ToggleInput";
import { Setter } from "../models/setter";
import { FaCheck } from "react-icons/fa";

export interface DatabaseModalProps {
  isOpen: boolean;
  isDefault: boolean;
  setIsDefault: Setter<boolean>;
  onClose: () => void;
  createCallback: () => void;
  loadCallback: () => void;
}

const DatabaseModal = ({isOpen, isDefault, setIsDefault, onClose, createCallback, loadCallback}: DatabaseModalProps): ReactElement => (
  <Modal isOpen={isOpen} onClose={onClose} title="Open/Create Database">
    <div>Create a new database from start or load a new one</div>
    <div className="flex gap-2 justify-center pt-4">
      <Button className="btn-primary" onClick={createCallback}>Create New</Button>
      <Button className="btn-secondary" onClick={loadCallback}>Load Database</Button>
    </div>
    <div className="flex gap-2 py-4">
      <span>Set as default location</span>
      <Checkbox
        checked={isDefault} 
        onChange={setIsDefault}
        className="cursor-pointer group size-6 rounded-md bg-white p-1 ring-1 ring-white/15 ring-inset data-[checked]:bg-white"
      >
        <FaCheck className="hidden size-4 fill-black group-data-[checked]:block"/>
      </Checkbox>
    </div>
    {/* <Field className="pt-4 flex flex-row content-center ml-auto gap-2">
      <Label htmlFor="set-editting">Set as default loaded</Label>
      <Switch
        // checked={isEditing}
        // onChange={handleSetEditing}
        className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-purple-700 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-purple-700"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-orange-700 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
        />
      </Switch>
    </Field> */}
  </Modal>
);

export {DatabaseModal};