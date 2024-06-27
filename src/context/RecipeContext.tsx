import {ReactElement, createContext, useState} from "react";
import {Ingredient, Recipe} from "../models/recipe";
import { updateObject } from "../util/update-object";
import { Setter } from "../models/setter" ;
import { useLocation } from "react-router";
import { useMount } from "../hooks/useMount";
import { ipcRenderer } from "electron";

const baseRecipe: Recipe = {
  id: 0,
  name: "Filler name",
  instructions: "",
  ingredientGroups: [],
  description: "",
  notes: "",
};

export interface BaseRecipeContext {
  recipe: Recipe;
  setRecipe: Setter<Recipe>;
}

export interface RecipeContextProps {
  children: React.ReactNode;
}

const RecipeContext = createContext<BaseRecipeContext>({
  recipe: baseRecipe,
  setRecipe: () => undefined,
});

const RecipeContextProvider = (props: RecipeContextProps): ReactElement => {
  const {state: id} = useLocation();
  const [recipe, setRecipe] = useState(baseRecipe);
  useMount(() => {
    if (!id) return;
    ipcRenderer.once("recipe-retrieved", (e, args: Recipe) => {
      setRecipe(args);
    });
    ipcRenderer.send("get-recipe", id);
  });

  const updateIngredient = (ing: Ingredient, ingIdx: number, groupIdx: number): void => {
    const currentIngredient = recipe.ingredientGroups[groupIdx].ingredients[ingIdx];
    // setRecipe(prev => ({...prev, ingredientGroups: }));
    const updatedIng = updateObject(currentIngredient, {
      id: currentIngredient.id,
      ...ing,
    });
  };
  return (
    <RecipeContext.Provider value={{recipe, setRecipe}}>
      {props.children}
    </RecipeContext.Provider>
  );
};

export {RecipeContextProvider, RecipeContext};
