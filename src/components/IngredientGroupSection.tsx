import React, {ReactElement, useContext} from "react";
import {AddIngredientReturn, AddIngredientVars, DeleteGroupReturn, DeleteIngredientReturn, IngredientGroup, RecipeTextUpdate} from "../models/recipe";
import {RecipeContext } from "../context/RecipeContext";
import { ToggleInput } from "./ToggleInput";
import { getRequest } from "../messaging/send";
import { Button } from "@headlessui/react";
import {PiFlask, PiTrash} from "react-icons/pi";
import { IngredientList } from "./IngredientList";
import { Card } from "./Card";

export interface IngredientGroupProps {
  ingredientGroup: IngredientGroup;
}

const IngredientGroupSection = ({ingredientGroup: {id, ingredients, groupName}}: IngredientGroupProps): ReactElement => {
  const {isEditing, dispatch, setAutoFocus, autoFocus} = useContext(RecipeContext);

  const handleChangeGroup = (text: string): void => {
    getRequest<{id: number, groupName: string}, RecipeTextUpdate>("update-groupName", "update-groupName-return", {id, text})
    .then(res => {
      dispatch({type: "UPDATE_GROUPNAME", payload: res})
    }).catch(err => {
      console.log("Problem editing name: ", err);
    });
  };

  const handleAddIngredient = (): void => {
    getRequest<AddIngredientReturn, AddIngredientVars>("add-ingredient", "add-ingredient-return", {item: "New item", measurement: "(Measurements)", ingredientGroupId: id})
    .then(res => {
      dispatch({type:"ADD_INGREDIENT", payload: res})
      setAutoFocus(true);
    }).catch(err => {
      console.log("Uh oh! ", err);
    });
  };

  const handleDeleteGroup = (): void => {
    getRequest<DeleteGroupReturn, number>("delete-ingredientGroup", "delete-ingredientGroup-return", id)
    .then(res => {
      dispatch({type: "DELETE_GROUP", payload: res});
    });
  };

  return (
    <Card className="relative">
      <ToggleInput
        id={`${id}-groupInput`}
        value={groupName}
        isEditing={isEditing}
        className="text-xl col-span-5"
        onBlur={handleChangeGroup}
        autoFocus={autoFocus}
        type="h2"
      />
      <IngredientList ingredients={ingredients}/>
      { isEditing && <>
        <Button className="btn-secondary col-span-3" onClick={handleAddIngredient}>
          <PiFlask /> Add Ingredient
        </Button>
        <PiTrash className="fill-red-500 cursor-pointer absolute top-3 right-3 w-6 h-6" onClick={handleDeleteGroup}/>
      </>
      }
    </Card>
  );
};

export {IngredientGroupSection};
