import {ReactElement, useContext} from "react";
import { RecipeContext } from "../context/RecipeContext";
import { Pill } from "./Pill";
import {PiFolderFill, PiX } from "react-icons/pi";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router";
import { AddToFolder } from "./AddToFolder";
import { getRequest } from "../messaging/send";

const FolderSection = (): ReactElement => {
  const {folders, setFolders, recipe: {id: recipeId}} = useContext(RecipeContext);
  const nav = useNavigate();

  const removeFromFolder = (id: number): void => {
    getRequest<boolean, {recipeId: number, folderId: number}>("remove-from-folder", "remove-from-folder-return", {recipeId, folderId: id})
    .then(res => {
      if (!res) return;
      setFolders(prev => prev.filter(folder => folder.id !== id));
    });
  };
  return (
    <div className="container flex flex-wrap">
      <FaChevronLeft className="size-5 cursor-pointer self-center" onClick={() => nav(-1)}/>
      <div className="flex flex-1 gap-2 flex-wrap">
        {folders.length > 0 && folders.map(f =>
          <Pill key={f.id} icon={<PiFolderFill className="size-5"/>}>
            {f.name} <PiX onClick={() => removeFromFolder(f.id)} className="cursor-pointer"/>
          </Pill>
        )}
      </div>
      <AddToFolder />
    </div>
  );
};

export {FolderSection};
