import {Button} from "@headlessui/react";
import { ReactElement, useEffect, useState } from "react";
import {TextInput} from "../../components/text-input";
import {getRequest } from "../../messaging/send";
import { useNavigate } from "react-router";
import { IdName } from "../../models/generic";
import { FolderSelect } from "../../components/FolderSelect";
import { Modal } from "../Modal";

export interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: number;
}

const CreateRecipeModal = ({isOpen, onClose, folderId = 0}: CreateRecipeModalProps): ReactElement => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    if (folderId !== selected) setSelected(folderId);
  }, [folderId]);

  const handleCreate = (): void => {
    setIsLoading(true);
    getRequest<IdName, {name: string, folderId: number}>("create-recipe", "create-recipe-return", {name, folderId: selected})
    .then(result => {
      setIsLoading(false);
      nav("/recipe", {state: result.id});
    }).catch(err => {
      console.error("something happened: ", err);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Recipe">
      <div className="flex flex-col gap-4">
        <TextInput value={name} onChange={setName} id="recipe-name-input" label="Recipe Name"/>
        <span className="text-md">Folder</span>
        <FolderSelect selected={selected} setSelected={setSelected} />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button className="btn-secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button className="btn-primary" disabled={!name || isLoading} onClick={handleCreate}>
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </div>
    </Modal>
  );
};

export {CreateRecipeModal};


