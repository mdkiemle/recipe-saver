import React, {ReactElement, useContext} from "react";
import { Ingredient } from "../models/recipe";
import { IngredientItem } from "./IngredientItem";
import { RecipeContext } from "../context/RecipeContext";
import { PiGraduationCapDuotone } from "react-icons/pi";

export interface IngredientListProps {
  ingredients: Ingredient[];
}

const IngredientList = ({ingredients}: IngredientListProps): ReactElement => {
  const {isEditing} = useContext(RecipeContext);
  console.log("what is happening", ingredients);
  return (
    <ul className="list-image-none flex flex-col gap-2 my-4">
      {ingredients.map(ing => <IngredientItem key={ing.id} ingredient={ing} isEditing={isEditing}/>)}
    </ul>
  );
};

export {IngredientList};
