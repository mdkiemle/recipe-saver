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

const NoFolderSection = (): ReactElement | undefined => {
  const [recipe, setRecipe] = useState<SearchRecipe[]>([]);
  useMount(() => {
    getRequest<SearchRecipe[], undefined>("get-recipes-no-folder", "get-recipes-no-folder-return", undefined)
    .then(res => {
      setRecipe(res);
    });
  });

  
  return (<>
      <h3 className="text-lg">Unfolder&apos;d</h3>
      <div className="grid grid-cols-3 gap-2 grid-flow-row-dense">
        {recipe?.map(r => <RecipeCard key={r.id} recipe={r}/>)}
      </div>
  </>
  );
};

export {NoFolderSection}
