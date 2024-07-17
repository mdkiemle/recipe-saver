import React, {ReactElement, useContext} from "react";
import { Folder } from "../models/recipe";
import { PiArrowArcLeft, PiFolderOpen } from "react-icons/pi";
import { FaChevronLeft } from "react-icons/fa";
import { DashboardContext } from "../context/DashboardContext";

const FolderNav = (): ReactElement | undefined => {
  const {folder, setFolder} = useContext(DashboardContext);
  if (!folder.id) return undefined;
  return (
    <div className="container flex gap-2 items-center mb-3">
      <FaChevronLeft className="size-4 cursor-pointer" onClick={() => setFolder({id: 0, name: ""})}/>
      <PiFolderOpen className="size-8"/>
      <span className="text-purple-800">{folder.name}</span>
    </div>
  );
};

export {FolderNav};
