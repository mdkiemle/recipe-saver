import {ReactElement} from "react";
import { Modal } from "./Modal";
import { Button } from "@headlessui/react";

export interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  createCallback: () => void;
  loadCallback: () => void;
}

const DatabaseModal = ({isOpen, onClose, createCallback, loadCallback}: DatabaseModalProps): ReactElement => (
  <Modal isOpen={isOpen} onClose={onClose} title="Open/Create Database">
    <div>Create a new database from start or load a new one</div>
    <div className="flex gap-2 justify-center pt-4">
      <Button className="btn-primary" onClick={createCallback}>Create New</Button>
      <Button className="btn-secondary" onClick={loadCallback}>Load Database</Button>
    </div>
  </Modal>
);

export {DatabaseModal};