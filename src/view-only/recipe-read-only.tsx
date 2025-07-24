import { ReactElement, useState } from "react";
import { ipcRenderer } from "electron";
import { Recipe } from "../../src/models/recipe";
import { PrintColumnView } from "../../src/components/PrintColumnView";


// ipcRenderer.once("recipe-retrieved", (e, args: Recipe) => {
//   console.log("Inside the recipe-retrieved listener", args);
// });

const RecipeViewOnly = (): ReactElement => {
  const [recipe, setRecipe] = useState<Recipe>();

  // I am not HUGE fan of this, but it's currently what I got.
  ipcRenderer.once("recipe-retrieved", (e, args: Recipe) => {
    console.log("Inside the recipe-retrieved listener", args);
    setRecipe(args);
  });
  return (
    <div className="container flex flex-col">
      {recipe ? <PrintColumnView recipe={recipe} /> : <div>Loading the thing</div>}
    </div>
  )
};

export {RecipeViewOnly};