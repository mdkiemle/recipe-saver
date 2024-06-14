import {ReactElement, useState} from "react";
import {ipcRenderer} from "electron";
import {Recipe, RecipeBook} from "../../models/recipe"

const RecipePage = (): ReactElement => {
  const [recipe, setRecipe] = useState<Recipe>();
  const handleLoad = (): void => {
    ipcRenderer.send("load-recipe");
  };
  ipcRenderer.on("load-success", (e, fileRead: RecipeBook) => {
    console.log("it succeeded", e, fileRead);
    const keys = Object.keys(fileRead);
    setRecipe(fileRead[keys[0]]);
  });

  console.log("recipe", recipe);
  return (
    <div>
      <h1>Recipe</h1>
      <button onClick={handleLoad}>Load</button>
      {recipe?.ingredients?.map(ingredient => <span key={ingredient.item}>
        {ingredient.amount} {ingredient.item}
      </span>)}
      <span>{recipe?.instructions?.value}</span>
    </div>
  );
};

export {RecipePage};