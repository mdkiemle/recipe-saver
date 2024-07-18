import {Button} from "@headlessui/react";
import { ReactElement, useContext, useEffect, useState } from "react";
import {TextInput} from "../../components/text-input";
import {getRequest } from "../../messaging/send";
import { useNavigate } from "react-router";
import { IdName } from "../../models/generic";
import { FolderContext } from "../../context/FolderContext";
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
  const {folders} = useContext(FolderContext);
  const [selected, setSelected] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    if (folderId !== selected) setSelected(folderId);
  }, [folderId]);

  console.log("what is selected", selected, "folderId?", folderId);

  const handleCreate = (): void => {
    setIsLoading(true);
    getRequest<IdName, string>("create-recipe", "create-recipe-return", name).then(result => {
      console.log("what is this result?", result);
      setIsLoading(false);
      nav("/recipe", {state: result.id});
    }).catch(err => {
      console.error("something happened: ", err);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Recipe">
      <TextInput value={name} onChange={setName} id="recipe-name-input" label="Recipe Name"/>
      <FolderSelect selected={selected} setSelected={setSelected} />
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


