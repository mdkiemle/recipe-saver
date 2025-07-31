import { ReactElement, useContext, useEffect, useState } from "react";
import { Modal } from "./";
import { TextInput } from "../components/text-input";
import { Button, Checkbox } from "@headlessui/react";
import { getRequest } from "../messaging/send";
import { CopyRecipeVars } from "../models/recipe";
import { RecipeContext } from "../context/RecipeContext";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router/dist";
import { toast } from "react-toastify";
import { StandardToast } from "../components/toasts/StandardToast";

export interface CopyRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CopyRecipeModal = ({isOpen, onClose}: CopyRecipeModalProps): ReactElement => {
  const {recipe, folders} = useContext(RecipeContext);
  const [name, setName] = useState(recipe.name ?? "");
  const [navToCreated, setNavToCreated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    setName(recipe.name + " (Copy)");
  }, [recipe.name])

  const handleCopy = (): void => {
      setIsLoading(true);
      getRequest<number, CopyRecipeVars>("copy-full-recipe", "copy-recipe-return", {name, recipe, folderIds: folders.map(folder => folder.id)})
      .then(res => {
        setIsLoading(false);
        onClose();
        toast(StandardToast, {
          data: {content: "Copied recipe"},
          theme: "dark",
        });
        if (navToCreated) nav(`/recipe/${res}`);
      });
    };
  return <Modal isOpen={isOpen} onClose={onClose} title="Copy Recipe">
    <TextInput value={name} onChange={setName} id="copy-name-input" label="Recipe Name"/>
    <div className="flex gap-2 py-4">
      <Checkbox
        checked={navToCreated} 
        onChange={setNavToCreated}
        className="cursor-pointer group size-6 rounded-md bg-white p-1 ring-1 ring-white/15 ring-inset data-[checked]:bg-white"
      >
        <FaCheck className="hidden size-4 fill-black group-data-[checked]:block"/>
      </Checkbox>
      <span>Navigate to created recipe</span>
    </div>
    <div className="mt-4 flex justify-end gap-2">
      <Button className="btn-secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
      <Button className="btn-primary" disabled={!name || isLoading} onClick={handleCopy}>
        {isLoading ? "Creating..." : "Create"}
      </Button>
    </div>
  </Modal>
};

export {CopyRecipeModal};
