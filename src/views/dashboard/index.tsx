import {ipcRenderer } from "electron";
import {ReactElement, useEffect, useState} from "react";
import {Recipe} from "../../../src/models/recipe";
import {useMount} from "../../../src/hooks/useMount";
import { Link, NavLink } from "react-router-dom";

const DashboardPage = (): ReactElement => {
  const [recipe, setRecipe] = useState<Recipe[]>([])

  useMount(() => {
    ipcRenderer.once("async-reply", (event, args: Recipe[] | null) => {
      if (args) setRecipe(args);
    });
    ipcRenderer.send("async-message", "SELECT * FROM recipe")
  });

  return (
    <div>
      Dashboard
      {recipe.length && recipe.map(r => (
        <div key={r.id}>
          <Link to="recipe" state={r.id}>{r.name}</Link>
        </div>
      ))}
    </div>
  );
};

export {DashboardPage};
