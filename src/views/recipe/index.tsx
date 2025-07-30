import {ReactElement, useContext, useState} from "react";
import {AddIngredientGroup, CopyRecipeReturn, CopyRecipeVars, RawIngredientGroup, RecipeUpdateReturn, RecipeUpdates, RecipeUpdateVars} from "../../models/recipe"
import {RecipeContext} from "../../context/RecipeContext";
import {Button, Field, Label, Switch} from "@headlessui/react"
import {RecipeSection} from "../../components/recipe-section";
import {getRequest} from "../../messaging/send";
import { IngredientGroupSection } from "../../components/IngredientGroupSection";
import { Card } from "../../components/Card";
import { ToggleInput } from "../../components/ToggleInput";
import { FolderSection } from "../../components/FolderSection";
import { ConfirmModal, CopyRecipeModal, RecipeLinkModal } from "../../modals/";
import {useNavigate} from "react-router";
import { TimerSection } from "../../components/TimerSection";
import {AiOutlineGroup} from "react-icons/ai"
import { RecipeLinks } from "../../components/RecipeLinks";
import {unescape} from "validator";

export interface RecipePageProps {
  isViewOnly?: boolean;
}

const RecipePage = ({isViewOnly = false}: RecipePageProps): ReactElement => {
  const {recipe, dispatch, loading, isEditing, setIsEditing, setAutoFocus} = useContext(RecipeContext);
  const [showDelete, setShowDelete] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [linkModal, setLinkModal] = useState(false);

  const nav = useNavigate();

  const toggleDelete = (): void => setShowDelete(prev => !prev);
  const toggleLinkModal = (): void => setLinkModal(prev => !prev);
  const toggleCopyModal = (): void => setShowCopyModal(prev => !prev);

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
  };

  const handleDelete = (): void => {
    getRequest<number, number>("delete-recipe", "delete-recipe-return", recipe.id)
    .then(res => {
      if (res) nav(-1);
    }).catch(err => {
      console.log("Uh oh: ", err);
    });
  };

  return (
    <div className="container flex flex-col gap-4 m-auto">
      {!isViewOnly && <FolderSection handleShowCopy={toggleCopyModal}/>}
      {!loading && recipe && <>
        <Card className="container flex flex-row">
          <ToggleInput
            value={unescape(recipe.name)}
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
          <h2 className="text-xl mb-4">Description</h2>
          <RecipeSection id="description" textValue={recipe.description ? unescape(recipe.description) : ""} onBlur={val => handleUpdateRecipe({description: val})}/>
        </Card>
        <TimerSection />
        {recipe.ingredientGroups.length === 0 && <Card><h2 className="text-xl">Ingredient groups</h2></Card>}
        {recipe.ingredientGroups.map(ig => <IngredientGroupSection key={ig.id} ingredientGroup={ig} />)}
        {isEditing && <Button className="btn-primary self-start" onClick={handleAddGroup}>
          <AiOutlineGroup /> Add Ingredient Group
        </Button>}
        <Card>
          <h2 className="text-xl mb-4">Instructions</h2>
          <RecipeSection id="instructions" textValue={recipe.instructions ? unescape(recipe.instructions) : ""} onBlur={val => handleUpdateRecipe({instructions: val})}/>
        </Card>
        <RecipeLinks openModal={toggleLinkModal}/>
        <Card>
          <h2 className="text-xl mb-4">Notes</h2>
          <RecipeSection id="notes" textValue={recipe.notes ? unescape(recipe.notes) : ""} onBlur={val => handleUpdateRecipe({notes: val})} />
        </Card>
        {isEditing && <Button className="btn-delete self-end" onClick={toggleDelete}>Delete</Button>}
        </>
      }
      <ConfirmModal isOpen={showDelete} onClose={toggleDelete} title="Delete Recipe" handleConfirm={handleDelete}>
        <div>Are you sure you want to delete this recipe? This cannot be undone</div>
      </ConfirmModal>
      <CopyRecipeModal isOpen={showCopyModal} onClose={toggleCopyModal} />
      <RecipeLinkModal isOpen={linkModal} onClose={toggleLinkModal} />
    </div>
  );
};

export {RecipePage};