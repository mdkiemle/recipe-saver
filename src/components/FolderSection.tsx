import {ReactElement, useContext} from "react";
import { RecipeContext } from "../context/RecipeContext";
import { Pill } from "./Pill";
import {PiFolderFill, PiPrinter, PiX } from "react-icons/pi";
import { FaChevronLeft, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router";
import { AddToFolder } from "./AddToFolder";
import { getRequest } from "../messaging/send";
import { DashboardContext } from "../context/DashboardContext";
import { Folder } from "../models/recipe";

const FolderSection = (): ReactElement => {
  const {setFolder} = useContext(DashboardContext);
  const {folders, setFolders, isEditing, recipe: {id: recipeId}} = useContext(RecipeContext);
  const nav = useNavigate();

  const removeFromFolder = (id: number): void => {
    getRequest<boolean, {recipeId: number, folderId: number}>("remove-from-folder", "remove-from-folder-return", {recipeId, folderId: id})
    .then(res => {
      if (!res) return;
      setFolders(prev => prev.filter(folder => folder.id !== id));
    });
  };

  const handleClick = (folder: Folder): void => {
    setFolder(folder);
    nav("/");
  };

  const handleHome = (): void => {
    setFolder({id: 0, name: ""}); // Resets Folder in case there is one set
    nav("/");
  };

  const handlePrint = (): void => nav(`/print/${recipeId}`);

  return (
    <div className="container flex flex-wrap gap-2">
			<FaChevronLeft className="size-5 cursor-pointer self-center" onClick={() => nav(-1)}/>  
      <FaHome className="size-5 cursor-pointer self-center" onClick={handleHome}/>
      <div className="flex flex-1 gap-2 flex-wrap">
        {folders.length > 0 && folders.map(f =>
          <Pill key={f.id} icon={<PiFolderFill className="size-5 cursor-pointer" onClick={() => handleClick(f)}/>}>
            {f.name} {isEditing && <PiX onClick={() => removeFromFolder(f.id)} className="cursor-pointer"/>}
          </Pill>
        )}
      </div>
      <PiPrinter className="w-6 h-6 self-center cursor-pointer" onClick={handlePrint}/>
      <AddToFolder />
    </div>
  );
};

export {FolderSection};
