import React, {ReactElement, useContext, useState} from "react";
import { AddIngredientReturn, DeleteIngredientReturn, Ingredient, IngredientUpdates, IngredientUpdateVars } from "../models/recipe";
import { ToggleInput } from "./ToggleInput";
import { PiTrash } from "react-icons/pi";
import { getRequest } from "../messaging/send";
import { RecipeContext } from "../context/RecipeContext";
import { unescape } from "validator";

export interface IngredientItemProps {
  ingredient: Ingredient
  isEditing: boolean;
}

const IngredientItem = ({ingredient, isEditing}: IngredientItemProps): ReactElement => {
  const {dispatch, autoFocus} = useContext(RecipeContext);
  const handleIngUpdate = (updates: Partial<IngredientUpdateVars>): void => {
    getRequest<AddIngredientReturn, IngredientUpdates>("update-ingredient", "update-ingredient-return", {id: ingredient.id, updates})
    .then(res => {
      dispatch({type: "UPDATE_INGREDIENT", payload: res})
    });
  };

  const handleDelete = (): void => {
    getRequest<DeleteIngredientReturn, number>("delete-ingredient", "delete-ingredient-return", ingredient.id)
    .then(res => {
      dispatch({type: "DELETE_INGREDIENT", payload: res});
    });
  };
  return (
    <li className="grid grid-cols-8 gap-3">
      <ToggleInput
        id={`${ingredient.id}-measurement`}
        isEditing={isEditing}
        value={unescape(ingredient.measurement)}
        className="px-1 py-1 col-span-2"
        onBlur={val => handleIngUpdate({measurement: val})}
        autoFocus={autoFocus}
      />
      <ToggleInput
        id={`${ingredient.id}-item`}
        isEditing={isEditing}
        value={unescape(ingredient.item)}
        className="px-1 py-1 col-span-4"
        onBlur={val => handleIngUpdate({item: val})}
      />
      {isEditing && <PiTrash onClick={handleDelete} className="fill-red-500 cursor-pointer"/>}
    </li>
  );
};

export {IngredientItem};
