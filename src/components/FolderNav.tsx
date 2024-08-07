import React, {ReactElement, useContext, useState} from "react";
import { Folder } from "../models/recipe";
import { PiFolderOpen, PiPen } from "react-icons/pi";
import { FaChevronLeft, FaCross } from "react-icons/fa";
import { DashboardContext } from "../context/DashboardContext";
import { ToggleInput } from "./ToggleInput";
import { getRequest } from "../messaging/send";
import { FolderContext } from "../context/FolderContext";

const FolderNav = (): ReactElement | undefined => {
  const {dispatch} = useContext(FolderContext);
  const {folder, setFolder, setActiveSearch} = useContext(DashboardContext);
  const [editFolder, setEditFolder] = useState(false);
  const handleBack = (): void => {
    setFolder({id: 0, name: ""});
    setEditFolder(false);
    setActiveSearch("");
  };

  const toggleEdit = (): void => setEditFolder(prev => !prev);

  const handleInput = (value: string): void => {
    setEditFolder(false);
    if (value === folder.name) return;
    getRequest<Folder, Folder>("update-folder", "update-folder-return", {id: folder.id, name: value})
    .then(res => {
      dispatch({type: "UPDATE_FOLDER", payload: res});
    });
  };

  if (!folder.id) return undefined;
  return (
    <div className="container flex gap-2 items-center mb-3">
      <FaChevronLeft className="size-4 cursor-pointer" onClick={handleBack}/>
      <PiFolderOpen className="size-8"/>
      <ToggleInput
        id="folder-name-toggle"
        isEditing={editFolder}
        autoFocus
        className="text-purple-800 text-xl"
        type="h2"
        value={folder.name}
        onBlur={handleInput}
        validate
      />
      {!editFolder && <PiPen onClick={toggleEdit} className="cursor-pointer"/> }
    </div>
  );
};

export {FolderNav};
