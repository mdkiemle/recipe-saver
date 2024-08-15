import React, {ReactElement, useContext, useEffect, useState} from "react";
import {Modal, ModalProps} from "./Modal";
import {Button, Checkbox} from "@headlessui/react";
import { useMount } from "../hooks/useMount";
import { getRequest } from "../messaging/send";
import { IdName } from "../models/generic";
import { FilterSelect } from "../components/FilterSelect";
import { TextInput } from "../components/text-input";
import { RecipeContext } from "../context/RecipeContext";
import { AddRecipeLinkVars, RecipeLink } from "../models/recipe";
import { FaCheck } from "react-icons/fa";

export type RecipeLinkModalProps = Omit<ModalProps, "title" | "children">

const RecipeLinkModal = ({isOpen, onClose}: RecipeLinkModalProps): ReactElement => {
  const {recipe: {id}, dispatch} = useContext(RecipeContext);
  const [recipes, setRecipes] = useState<IdName[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [label, setLabel] = useState("");
  const [selected, setSelected] = useState<IdName>({id: 0, name: ""});
  const [copyIngs, setCopyIngs] = useState(false);


  const handleImportIngGroups = (parentId: number, childId: number): void => {
    console.log("oh god oh fuck oh god");
    getRequest("copyGroupsWithIngs", "copyGroupsWithIngs-return", {parentId, childId})
    .then(res => {
      console.log("response from copy", res);
      onClose();
    });
  };

  const handleCreateLink = (): void => {
    setCreating(true);
    getRequest<RecipeLink, AddRecipeLinkVars>("create-recipe-link", "create-recipe-link-return", {recipeParentId: id, recipeChildId: selected.id, label})
    .then(res => {
      dispatch({type: "ADD_LINK", payload: res});
      if (copyIngs) return handleImportIngGroups(id, selected.id);
      setCreating(false);
      onClose();
    });
  };

  useMount(() => {
    setLoading(true);
    getRequest<IdName[], undefined>("get-recipes", "get-recipes-return", undefined)
    .then(res => {
      setRecipes(res);
      setLoading(false);
    });
  });

  useEffect(() => {
    if (!isOpen) setSelected({id: 0, name: ""});
  }, [isOpen])
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Link a Recipe">
      {loading ? <span>Recipes are loading...</span>
      : <div className="flex gap-2 flex-col">
        <FilterSelect options={recipes} selected={selected} setSelected={setSelected} />
        <TextInput value={label} onChange={setLabel} id="recipe-link-label-input" label="Label (optional)"/>
        <Checkbox
          checked={copyIngs} 
          onChange={setCopyIngs}
          className="group size-6 rounded-md bg-white/10 p-1 ring-1 ring-white/15 ring-inset data-[checked]:bg-white"
        >
          <FaCheck className="hidden size-4 fill-black group-data-[checked]:block"/>
        </Checkbox>
        <span>hey</span>
      </div>}
      <div className="mt-4 flex justify-end gap-2">
        <Button className="btn-secondary" onClick={onClose}>Cancel</Button>
        <Button className="btn-primary" onClick={handleCreateLink} disabled={!selected || selected.id === 0 || creating}>{creating ? "Creating..." : "Create"}</Button>
      </div>
    </Modal>
  );
};

export {RecipeLinkModal};
