import {ipcRenderer } from "electron";
import {ReactElement, useEffect, useState} from "react";
import {Recipe} from "../../../src/models/recipe";
import {useMount} from "../../../src/hooks/useMount";
import { Link, NavLink } from "react-router-dom";

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
    <div>
      Dashboard
      {recipe.length && recipe.map(r => (
        <div key={r.id}>
          <Link to="recipe" state={r.id}>{r.name}</Link>
        </div>
      ))}
      <button onClick={create}>Create Recipe</button>
    </div>
  );
};

export {DashboardPage};
