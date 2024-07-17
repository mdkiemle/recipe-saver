import React, {ReactElement} from "react";
import { Folder } from "../models/recipe";
import { PiFolder, PiFolderFill, PiFolderOpenFill } from "react-icons/pi";

export interface FolderProps {
  folder: Folder;
  onClick: (folder: Folder) => void;
};

const FolderItem = ({folder, onClick}: FolderProps): ReactElement => (
  <div className="flex items-center" >
    <PiFolder className="w-8 h-8 cursor-pointer" onClick={() => onClick(folder)}/>
    {/* <PiFolderFill className="w-8 h-8 fill-purple-500 stroke-slate-300" />
    <PiFolderOpenFill className="w-8 h-8 fill-purple-500 stroke-slate-300" /> */}
    <span className="cursor-pointer" onClick={() => onClick(folder)}>{folder.name}</span>
  </div>
);

export {FolderItem};
