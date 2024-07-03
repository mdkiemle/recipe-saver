import {ipcRenderer } from "electron";
import {ReactElement, useEffect, useState} from "react";
import {Recipe} from "../../../src/models/recipe";
import {useMount} from "../../../src/hooks/useMount";
import { Link, NavLink } from "react-router-dom";
import { CreateRecipeModal } from "../../modals/create-recipe-modal";

export interface RecipeReturn {
  id: number;
  name: string;
}


const DashboardPage = (): ReactElement => {
  const [recipe, setRecipe] = useState<RecipeReturn[]>([])

  useMount(() => {
    ipcRenderer.once("async-reply", (event, args: RecipeReturn[] | null) => {
      if (args) setRecipe(args);
    });
    ipcRenderer.send("async-message", "SELECT id, name FROM recipe")
  });

  useMount(() => {
    ipcRenderer.once("folders-get", (event, arg) => {
      console.log("folders get", arg);
    });
    ipcRenderer.send("get-all-folders");
  });

  const create = (): void => {
    console.log("hey", recipe.length);
    ipcRenderer.once("create-recipe-return", (e, args: RecipeReturn | string) => {
      if (typeof args !== "string") {
        console.log("and this?", [...recipe, args]);
        setRecipe(prev => [...prev, args]);
      }
    });
    ipcRenderer.send("create-recipe", "Hey Final test");
  };

  return (
    <div className="container md:mx-auto">
      Dashboard

      <div className="flex flex-col">
        {recipe.length && recipe.map(r => (
            <Link key={r.id} to="recipe" state={r.id} className="link">{r.name}</Link>
        ))}
      </div>
      <button onClick={create}>Create Recipe</button>
      <CreateRecipeModal isOpen onClose={(): void => undefined}/>
    </div>
  );
};

export {DashboardPage};
