import {ReactElement, useContext, useState} from "react";
import {Recipe} from "../../models/recipe"
import {useLocation} from "react-router";
import {useMount} from "../../hooks/useMount";
import {ipcRenderer} from "electron";
import { RecipeContext } from "../../context/RecipeContext";

const RecipePage = (): ReactElement => {
  const {recipe} = useContext(RecipeContext);

  const doAnUpdate = (): void => {
    ipcRenderer.once("update-ingredient-return", (e, args) => {
      console.log("wow what happen", args, e);
    });
    ipcRenderer.send("update-ingredient", {id: 1, measurement: "8oz", item: "Macaroni"});
  };

  return (
    <div>
      <button onClick={doAnUpdate}>Click me for a surprise</button>
      {recipe && <>
        <h2>{recipe.name}</h2>
        <div>
          {recipe?.description}
        </div>
        {recipe.ingredientGroups.map(ig => <section key={ig.id}>
          <h3>{ig.groupName}</h3>
          <ul>
            {ig.ingredients.map((ing, idx) => 
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