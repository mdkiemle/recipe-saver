import React, {ReactElement} from "react";
import { Modal } from "./Modal";
import { Button } from "@headlessui/react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  handleConfirm: () => void;
}

const ConfirmModal = ({isOpen, onClose, children, title, handleConfirm}: ConfirmModalProps): ReactElement => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    {children}
    <div className="mt-4 flex justify-end gap-2">
      <Button className="btn-secondary" onClick={onClose}>No</Button>
      <Button className="btn-primary" onClick={handleConfirm}>
        Yes
      </Button>
    </div>
  </Modal>
);

export {ConfirmModal};
