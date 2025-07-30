import {ReactElement, useContext, useEffect, useState} from "react";
import { RecipeContext } from "../context/RecipeContext";
import { getRequest, newWindowViewOnly } from "../messaging/send";
import { Card } from "./Card";
import { Button } from "@headlessui/react";
import { FaLink } from "react-icons/fa";
import { useMount } from "../hooks/useMount";
import { DeleteLinkVars, RecipeLink } from "../models/recipe";
import { Link, useHref, useLocation } from "react-router-dom";
import React from "react";
import { PiTrash } from "react-icons/pi";

export interface RecipeLinksProps {
  openModal: () => void;
}

const RecipeLinks = ({openModal}: RecipeLinksProps): ReactElement | undefined => {
  const {recipe: {id, recipeLinks}, isEditing, dispatch} = useContext(RecipeContext);
  const [loading, setLoading] = useState(false);
  const [showing, setShowing] = useState(false);
  const handleShowRecipeLink = (): void => setShowing(true);
  
  useMount(() => {
    setLoading(true);
    getRequest<RecipeLink[], number>("get-recipe-links", "get-recipe-links-return", id).then(res => {
      dispatch({type: "ADD_LINKS", payload: res});
      setLoading(false);
    }).catch(err => console.log("Error returning links: ", err));
  });

  const handleDelete = (recipeChildId: number): void => {
    getRequest<number, DeleteLinkVars>("delete-recipe-link", "delete-recipe-link-return", {recipeParentId: id, recipeChildId})
    .then(res => {
      dispatch({type: "DELETE_LINK", payload: res});
    })
  };

  const handleViewRecipe = (recipeId: number, recipeName: string): void => {
    newWindowViewOnly({id: recipeId, name: recipeName});
  }

  useEffect(() => {
    if (!isEditing && !loading && recipeLinks.length === 0) setShowing(false);
  }, [isEditing, loading]);

  if (loading && recipeLinks.length === 0) {
    return <Card>
      Getting links to other recipes...
    </Card>
  }
  if (!loading && recipeLinks.length === 0 && !isEditing) return undefined;
  if (!loading && recipeLinks.length === 0 && isEditing && !showing) {
    return <Button className="btn-primary self-start" onClick={handleShowRecipeLink}>
      <FaLink /> Add Recipe Links
    </Button>
  }
    return (
    <Card>
      <h2 className="text-xl mb-4">Recipe Links</h2>
      <div className="flex flex-col gap-2 mb-4">
        {recipeLinks.map(link => <div key={link.id} className="flex items-center gap-2">{link.label ?
          <span className="w-auto" key={link.id}>{link.label}: <span className="font-semibold">{link.name}</span></span>
          : <span key={link.id} className="font-semibold w-auto">{link.name}</span>}
          {!isEditing && <Button className="btn-secondary" onClick={() => handleViewRecipe(link.id, link.name)}>View Recipe</Button>}
          {isEditing && <PiTrash onClick={() => handleDelete(link.id)} className="fill-red-500 cursor-pointer" />}
          </div>
        )}
      </div>
      {isEditing && <Button className="btn-primary" onClick={openModal}><FaLink /> Add Recipe Link</Button>}
    </Card>
  );
};

export {RecipeLinks};
