import {Dialog, DialogPanel, DialogTitle, DialogBackdrop, Button} from "@headlessui/react";
import { ReactElement, useContext, useState } from "react";
import {TextInput} from "../../components/text-input";
import {getRequest } from "../../messaging/send";
import { useNavigate } from "react-router";
import { IdName } from "../../models/generic";
import { FolderContext } from "../../context/FolderContext";

export interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateFolderModal = ({isOpen, onClose}: CreateFolderModalProps): ReactElement => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const {dispatch} = useContext(FolderContext);

  const handleCreate = (): void => {
    setIsLoading(true);
    getRequest<IdName, string>("create-folder", "create-folder-return", name).then(result => {
      console.log("what is this result?", result);
      setIsLoading(false);
      dispatch({type: "ADD_FOLDER", payload: result})
      onClose();
    }).catch(err => {
      console.error("something happened: ", err);
    });;
  };

  return (
    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
      <DialogBackdrop className="fixed inset-0 bg-black/30"/>
        <div className="flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-gray-100/80 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
          <DialogTitle as="h3" className="text-base/7 font-medium mb-4" >
            Create Folder
          </DialogTitle>
          <TextInput value={name} onChange={setName} id="folder-name-input" label="Folder Name"/>
          <div className="mt-4 flex justify-end gap-2">
            <Button className="btn-secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button className="btn-primary" disabled={!name || isLoading} onClick={handleCreate}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export {CreateFolderModal};


