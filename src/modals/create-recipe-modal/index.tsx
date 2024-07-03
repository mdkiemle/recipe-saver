import {Description, Dialog, DialogPanel, DialogTitle, Menu, MenuButton, MenuItem, MenuItems, DialogBackdrop} from "@headlessui/react";
import { ReactElement, useState } from "react";

export interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRecipeModal = ({isOpen, onClose}: CreateRecipeModalProps): ReactElement => {
  const [name, setName] = useState("");

  return (
    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
      <DialogBackdrop className="fixed inset-0 bg-black/30"/>
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-green-500 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
          <DialogTitle as="h3" className="text-base/7 font-medium text-orange-500 bg-green-500/100" >
            Payment successful
          </DialogTitle>
          <p className="mt-2 text-sm/6 text-white/50">
            Your payment has been successfully submitted. We’ve sent you an email with all of the details of your
            order.
          </p>
          <div className="mt-4">
            <button
              className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
              onClick={onClose}
            >
              Got it, thanks!
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export {CreateRecipeModal};


