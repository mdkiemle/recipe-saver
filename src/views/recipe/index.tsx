import {ReactElement, useContext, useState} from "react";
import {AddIngredientGroup, RawIngredientGroup, RecipeUpdateReturn, RecipeUpdates, RecipeUpdateVars} from "../../models/recipe"
import {RecipeContext} from "../../context/RecipeContext";
import {Button, Field, Label, Switch} from "@headlessui/react"
import {RecipeSection} from "../../components/recipe-section";
import {getRequest} from "../../messaging/send";
import { IngredientGroupSection } from "../../components/IngredientGroupSection";
import { Card } from "../../components/Card";
import { ToggleInput } from "../../components/ToggleInput";
import { FolderSection } from "../../components/FolderSection";
import { ConfirmModal } from "../../modals/";
import { useNavigate } from "react-router";

const RecipePage = (): ReactElement => {
  const {recipe, dispatch, loading, isEditing, setIsEditing, setAutoFocus} = useContext(RecipeContext);
  const [showDelete, setShowDelete] = useState(false);
  const nav = useNavigate();

  const toggleDelete = (): void => setShowDelete(prev => !prev);

  const handleUpdateRecipe = (updates: Partial<RecipeUpdateVars>): void => {
    if (updates?.name === "") return;
    getRequest<RecipeUpdateReturn, RecipeUpdates>("update-recipe", "update-recipe-return", {id: recipe.id, updates})
    .then(res => {
      dispatch({type: "UPDATE_RECIPE", payload: res});
    })
  };

  const handleAddGroup = (): void => {
    getRequest<RawIngredientGroup, AddIngredientGroup>("add-ingGroup", "add-ingGroup-return", {groupName: "New Group", recipeId: recipe.id})
    .then(res => {
      dispatch({type: "ADD_ING_GROUP", payload: res});
      setAutoFocus(true);
    });
  };

  const handleSetEditing = (checked: boolean): void => {
    setIsEditing(checked);
    setAutoFocus(false);
  }

  const handleDelete = (): void => {
    getRequest<number, number>("delete-recipe", "delete-recipe-return", recipe.id)
    .then(res => {
      if (res) nav(-1);
    }).catch(err => {
      console.log("Uh oh: ", err);
    });
  }

  return (
    <div className="container flex flex-col gap-4 m-auto">
      <FolderSection />
      {!loading && recipe && <>
        {/* <PiTrash onClick={handleDelete} className="cursor-pointer"/> */}
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
              onChange={handleSetEditing}
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
        {isEditing && <Button className="btn-delete self-end" onClick={toggleDelete}>Delete</Button>}
        </>
      }
      <ConfirmModal isOpen={showDelete} onClose={toggleDelete} title="Delete Recipe" handleConfirm={handleDelete}>
        <div>Are you sure you want to delete this recipe? This cannot be undone</div>
      </ConfirmModal>
    </div>
  );
};

export {RecipePage};