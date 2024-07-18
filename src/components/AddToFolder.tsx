import { Button, CloseButton, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {ReactElement, useContext} from "react";
import { FolderContext } from "../context/FolderContext";
import { PiFolderFill } from "react-icons/pi";
import { getRequest } from "../messaging/send";
import { RecipeContext } from "../context/RecipeContext";
import { Folder } from "../models/recipe";

const AddToFolder = (): ReactElement => {
  const {recipe: {id: recipeId}, setFolders} = useContext(RecipeContext);
  const {folders} = useContext(FolderContext);

  const sendToFolder = (folder: Folder): void => {
    getRequest<boolean, {recipeId: number, folderId: number}>("add-to-folder", "add-to-folder-return", {recipeId, folderId: folder.id})
    .then(res => {
      if (!res) return;
      setFolders(prev => [...prev, folder]);
    });
  };
  return (<>
    <Popover>
      <PopoverButton className="btn-primary">
        <PiFolderFill /> Add To Folder
      </PopoverButton>
      <PopoverPanel
        transition
        anchor="bottom end"
        className="py-2 divide-y divide-white/5 rounded-xl w-48 shadow-md bg-white text-sm duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
      >
        {folders.map(f =>
          <CloseButton
            as="div"
            key={f.id}
            className="cursor-pointer hover:bg-purple-200 px-4"
            onClick={() => sendToFolder(f)}
          >
            {f.name}
          </CloseButton>
        )}
      </PopoverPanel>
    </Popover>
  </>
  );
};

export {AddToFolder};
