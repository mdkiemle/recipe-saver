import {Description, Dialog, DialogPanel, DialogTitle, Menu, MenuButton, MenuItem, MenuItems, DialogBackdrop, Button} from "@headlessui/react";
import { ReactElement, useState } from "react";
import {TextInput} from "../../components/text-input";
import { createRecipe } from "../../messaging/send";
import { useNavigate } from "react-router";

export interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRecipeModal = ({isOpen, onClose}: CreateRecipeModalProps): ReactElement => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  const handleCreate = (): void => {
    setIsLoading(true);
    createRecipe(name).then(result => {
      console.log("what is this result?", result);
      setIsLoading(false);
      nav("/recipe", {state: result.id});
    }).catch(err => {
      console.error("something happened: ", err);
    });
  }

  return (
    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
      <DialogBackdrop className="fixed inset-0 bg-black/30"/>
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-gray-100/80 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
          <DialogTitle as="h3" className="text-base/7 font-medium mb-4" >
            Create Recipe
          </DialogTitle>
          <TextInput value={name} onChange={setName} id="recipe-name-input" label="Recipe Name"/>
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

export {CreateRecipeModal};


