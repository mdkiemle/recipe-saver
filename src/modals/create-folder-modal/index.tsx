import {Button} from "@headlessui/react";
import { ReactElement, useContext, useState } from "react";
import {TextInput} from "../../components/text-input";
import {getRequest } from "../../messaging/send";
import { IdName } from "../../models/generic";
import { FolderContext } from "../../context/FolderContext";
import { Modal } from "../Modal";

export interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateFolderModal = ({isOpen, onClose}: CreateFolderModalProps): ReactElement => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {dispatch} = useContext(FolderContext);

  const handleCreate = (): void => {
    setIsLoading(true);
    getRequest<IdName, string>("create-folder", "create-folder-return", name).then(result => {
      setIsLoading(false);
      dispatch({type: "ADD_FOLDER", payload: result})
      onClose();
    }).catch(err => {
      console.error("something happened: ", err);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Folder">
      <TextInput value={name} onChange={setName} id="folder-name-input" label="Folder Name"/>
      <div className="mt-4 flex justify-end gap-2">
        <Button className="btn-secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button className="btn-primary" disabled={!name || isLoading} onClick={handleCreate}>
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </div>
    </Modal>
  );
};

export {CreateFolderModal};


