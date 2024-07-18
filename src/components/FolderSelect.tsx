import {ReactElement, useContext, useMemo} from "react";
import { Setter } from "../models/setter";
import { FolderContext } from "../context/FolderContext";
import { Select } from "./Select";

export interface FolderSelectProps {
  selected: number;
  setSelected: Setter<number>
}

const FolderSelect = ({selected, setSelected}: FolderSelectProps): ReactElement => {
  const {folders} = useContext(FolderContext);
  const options = useMemo(() => ([
    {
      id: 0,
      name: "Select an option...",
    },
    ...folders,
  ]), [folders.length]);

  return (
    <Select selected={selected} setSelected={setSelected} options={options}/>
  );
};

export {FolderSelect};
