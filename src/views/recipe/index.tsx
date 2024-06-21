import {ReactElement, useEffect, useState} from "react";
import {IIngredient, IngredientMerged, RawJoinRecipe, Recipe} from "../../models/recipe"
import { useLocation } from "react-router";
import { useMount } from "../../hooks/useMount";
import { ipcRenderer } from "electron";
import {Dictionary, groupBy, uniqBy} from "lodash";

const RecipePage = (): ReactElement => {
  const [recipe, setRecipe] = useState<Recipe>();
  const {state: recipeId} = useLocation();
  const [value, setValue] = useState([]);
  const [groups, setGroups] = useState<Dictionary<IngredientMerged[]>>();

  useMount(() => {
    if (recipeId) {
      // ipcRenderer.once("async-reply", (e, args: RawJoinRecipe[] | null) => {
      //   console.log("here is the reply", args);
      //   if (args) {
      //     console.log("what is happening here?", args);
      //     setRecipe(args[0]);
      //   }
      // });
      ipcRenderer.once("recipe-retrieved", (e, args) => {
        console.log("wow, reply?", args);
        setRecipe(args);
      });
      // ipcRenderer.send("async-message", `select * from recipe where id = '${recipeId}'`);
      ipcRenderer.send("get-recipe", recipeId);
    }
  });

  useEffect(() => {
    if (!recipe) return;
    console.log("recipe is defined");
    ipcRenderer.once("async-reply", (_, args: IngredientMerged[]) => {
      console.log("another reply");
      if (args) {
        const sorted = groupBy(args, "groupName");
        console.log("what this look like", sorted);
        setGroups(sorted);
      }
    });
    ipcRenderer.send("async-message",
      `select * from ingredientGroup ig
      left join ingredient i on i.ingredientGroupId=ig.id
      where ig.recipeId = ${recipe.id}`);
  }, [recipe]);

  console.log("value?", value);
  return (
    <div>
      {recipe && groups && <>
        <h2>{recipe.name}</h2>
        {Object.keys(groups).map(key => (
          <ul key={key}>{key}
            {groups[key].map(group => (
              <li key={`${group.id}-${group.item}`}>{group.measurement} {group.item}</li>
            ))}
          </ul>
          ))
        }
        <div>{recipe.instructions}</div>
        </>
      }
    </div>
  );
};

export {RecipePage};