import {ReactElement, useContext} from "react";
import {AddIngredientGroup, BaseRecipe, RawIngredientGroup, RecipeTextUpdate, RecipeUpdateReturn, RecipeUpdates, RecipeUpdateVars} from "../../models/recipe"
import {RecipeContext} from "../../context/RecipeContext";
import {Button, Field, Label, Switch} from "@headlessui/react"
import {RecipeSection} from "../../components/recipe-section";
import {getRequest} from "../../messaging/send";
import { IngredientGroupSection } from "../../components/IngredientGroupSection";
import { Card } from "../../components/Card";
import { ToggleInput } from "../../components/ToggleInput";
import { PiTrash } from "react-icons/pi";
import { useNavigate } from "react-router";

const RecipePage = (): ReactElement => {
  const {recipe, dispatch, loading, isEditing, setIsEditing} = useContext(RecipeContext);
  const nav = useNavigate();

  const handleUpdateRecipe = (updates: Partial<RecipeUpdateVars>): void => {
    let x = updates?.name;
    console.log('x', x, updates.name, "boolean", Boolean(x), updates.name === "")
    if (updates?.name === "") return;
    getRequest<RecipeUpdateReturn, RecipeUpdates>("update-recipe", "update-recipe-return", {id: recipe.id, updates})
    .then(res => {
      console.log("update recipe response", res);
      dispatch({type: "UPDATE_RECIPE", payload: res});
    })
  };

  const handleAddGroup = (): void => {
    getRequest<RawIngredientGroup, AddIngredientGroup>("add-ingGroup", "add-ingGroup-return", {groupName: "New Group", recipeId: recipe.id})
    .then(res => {
      dispatch({type: "ADD_ING_GROUP", payload: res});
    });
  };

  const handleDelete = (): void => {
    getRequest<{id: number}, number>("delete-recipe", "delete-recipe-return", recipe.id)
    .then(res => {
      console.log("Hey?", res);
      nav(-1);
    });
  };

  return (
    <div className="container flex flex-col gap-4">
      {!loading && recipe && <>
        <PiTrash onClick={handleDelete} className="cursor-pointer"/>
        <Card className="container flex flex-row">
          {/* <h1 className="text-2xl">{recipe.name}</h1> */}
          <ToggleInput
            value={recipe.name}
            id="recipe-name"
            isEditing={isEditing}
            className="text-2xl"
            maxLength={255}
            onBlur={val => handleUpdateRecipe({name: val})}
            validate
          />
          <Field className="flex flex-row content-center ml-auto gap-2">
            <Label htmlFor="set-editting">Edit Recipe</Label>
            <Switch
              checked={isEditing}
              onChange={setIsEditing}
              className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-purple-700 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-purple-700"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-orange-700 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
              />
            </Switch>
          </Field>
        </Card>
        <Card>
          <h2 className="text-xl">Description</h2>
          <RecipeSection id="description" textValue={recipe.description} onBlur={val => handleUpdateRecipe({description: val})}/>
        </Card>
        {recipe.ingredientGroups.length === 0 && <Card><h2 className="text-xl">Ingredient groups</h2></Card>}
        {recipe.ingredientGroups.map(ig => <IngredientGroupSection key={ig.id} ingredientGroup={ig} />)}
        {isEditing && <Button className="btn-primary self-start" onClick={handleAddGroup}>Add Ingredient Group</Button>}
        <Card>
          <h2 className="text-xl">Instructions</h2>
          <RecipeSection id="instructions" textValue={recipe.instructions} onBlur={val => handleUpdateRecipe({instructions: val})}/>
        </Card>
        <Card>
          <h2 className="text-xl">Notes</h2>
          <RecipeSection id="notes" textValue={recipe.notes ?? ""} onBlur={val => handleUpdateRecipe({notes: val})} />
        </Card>
        </>
      }
    </div>
  );
};

export {RecipePage};