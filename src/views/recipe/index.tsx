import {ReactElement, useEffect, useState} from "react";
import {Recipe} from "../../models/recipe"
import { useLocation } from "react-router";
import { useMount } from "../../hooks/useMount";
import { ipcRenderer } from "electron";
import {Dictionary, groupBy, uniqBy} from "lodash";
import { RawReturn } from "../../util/pretty-recipe";

const RecipePage = (): ReactElement => {
  const [recipe, setRecipe] = useState<Recipe>();
  const {state: recipeId} = useLocation();
  const [value, setValue] = useState([]);

  useMount(() => {
    if (recipeId) {
      ipcRenderer.once("recipe-retrieved", (e, args: Recipe) => {
        console.log("wow, reply?", args);
        setRecipe(args);
      });
      ipcRenderer.send("get-recipe", recipeId);
    }
  });

  return (
    <div>
      {recipe && <>
        <h2>{recipe.name}</h2>
        {recipe.ingredientGroups.map(ig => <section key={ig.id}>
          <h3>{ig.groupName}</h3>
          <ul>
            {ig.ingredients.map(ing => 
              <li key={ing.id}>
                {ing.measurement} {ing.item}
              </li>
            )}
          </ul>
        </section>)}
        <div>{recipe.instructions}</div>
        </>
      }
    </div>
  );
};

export {RecipePage};