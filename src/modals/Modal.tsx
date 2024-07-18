import {ReactElement} from "react";
import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react"

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({isOpen, onClose, title, children}: ModalProps): ReactElement => (
  <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
    <DialogBackdrop className="fixed inset-0 w-screen bg-black/30"/>
    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-md rounded-xl bg-gray-100/80 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
        >
        <DialogTitle as="h3" className="text-base/7 font-medium mb-4" >
          {title}
        </DialogTitle>
        {children}
        </DialogPanel>
      </div>
    </div>
  </Dialog>
);

export {Modal}