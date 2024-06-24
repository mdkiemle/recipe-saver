import {ReactElement, useState} from "react";
import {Recipe} from "../../models/recipe"
import {useLocation} from "react-router";
import {useMount} from "../../hooks/useMount";
import {ipcRenderer} from "electron";

const RecipePage = (): ReactElement => {
  const [recipe, setRecipe] = useState<Recipe>();
  const {state: recipeId} = useLocation();

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
        <div>
          {recipe?.description}
        </div>
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