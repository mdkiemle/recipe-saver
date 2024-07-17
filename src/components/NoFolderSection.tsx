/**
 * We want to show recipes that have no folders associated with them still.
 * In case a user forgets to assign a folder or something else happens.
 * 
 * This way of doing it is likely not how I'd do it in a full application, although it isn't
 * the worst way of doing things.
 */

import {ReactElement, useState} from "react";
import {useMount} from "../hooks/useMount";
import {getRequest} from "../messaging/send";
import {RecipeCard} from "./RecipeCard";
import {SearchRecipe} from "../models/recipe";

export interface NoFolderSectionProps {
  show: boolean;
}

const NoFolderSection = ({show}: NoFolderSectionProps): ReactElement | undefined => {
  const [recipe, setRecipe] = useState<SearchRecipe[]>([]);
  useMount(() => {
    getRequest<SearchRecipe[], undefined>("get-recipes-no-folder", "get-recipes-no-folder-return", undefined)
    .then(res => {
      setRecipe(res);
    });
  });

  
  return (
    <>
    {show && recipe?.map(r => <RecipeCard key={r.id} recipe={r}/>)}
    </>
  );
};

export {NoFolderSection}
