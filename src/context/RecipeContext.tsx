import {PropsWithChildren, ReactElement, createContext, useReducer, useState} from "react";
import {AddIngredientReturn, AddTimerReturn, BaseRecipe, DeleteGroupReturn, DeleteIngredientReturn, DeleteTimerReturn, Folder, RawIngredientGroup, Recipe, RecipeUpdateReturn, Timer} from "../models/recipe";
import { updateObject } from "../util/update-object";
import { Setter } from "../models/setter" ;
import { useLocation } from "react-router";
import { useMount } from "../hooks/useMount";
import { getRequest } from "../messaging/send";

const baseRecipe: Recipe = {
  id: 0,
  name: "Filler name",
  instructions: "",
  ingredientGroups: [],
  timers: [],
  description: "",
  notes: "",
  totalTime: 0,
};

export interface BaseRecipeContext {
  recipe: Recipe;
  dispatch: React.Dispatch<Action>;
  isEditing: boolean;
  setIsEditing: Setter<boolean>;
  loading: boolean;
  folders: Folder[];
  setFolders: Setter<Folder[]>;
  autoFocus: boolean;
  setAutoFocus: Setter<boolean>;
}

export type Action =
  {type: "UPDATE_RECIPE", payload: RecipeUpdateReturn} |
  {type: "UPDATE_GROUPNAME" | "ADD_ING_GROUP", payload: RawIngredientGroup} |
  {type: "ADD_INGREDIENT" | "UPDATE_INGREDIENT", payload: AddIngredientReturn} |
  {type: "DELETE_INGREDIENT", payload: DeleteIngredientReturn} |
  {type: "DELETE_GROUP", payload: DeleteGroupReturn} |
  {type: "DELETE_TIMER", payload: DeleteTimerReturn} |
  {type: "ADD_TIMER" | "UPDATE_TIMER", payload: Timer};

const RecipeContext = createContext<BaseRecipeContext>({
  recipe: baseRecipe,
  folders: [],
  autoFocus: false,
  isEditing: false,
  loading: false,
  setFolders: () => undefined,
  setAutoFocus: () => undefined,
  setIsEditing: () => undefined,
  dispatch: () => undefined,
});

const recipeReducer = (state: Recipe, action: Action): Recipe => {
  switch(action.type) {
    case "UPDATE_RECIPE":
      return updateObject(state, {
        ...state,
        ...action.payload,
      });
    case "UPDATE_GROUPNAME":
      return updateObject(state, {
        ...state,
        ingredientGroups: state.ingredientGroups.map(ig => {
          if (ig.id === action.payload?.id) {
            return {
              ...ig,
              groupName: action.payload.groupName,
            };
          }
          return ig;
        }),
      });
    case "ADD_ING_GROUP":
      return updateObject(state, {
        ...state,
        ingredientGroups: [...state.ingredientGroups, {...action.payload, ingredients: []}]
      });
    case "ADD_TIMER": {
      return updateObject(state, {
        ...state,
        timers: [...state.timers, action.payload],
      });
    }
    case "UPDATE_TIMER": {
      const copiedTimers = [...state.timers];
      const idx = copiedTimers.findIndex(timer => timer.id === action.payload?.id);
      const updatedTimer = updateObject(copiedTimers[idx], {
        id: copiedTimers[idx].id,
        ...action.payload,
      });
      copiedTimers.splice(idx, 1, updatedTimer);
      return updateObject(state, {
        ...state,
        timers: copiedTimers,
      })
    }
    case "ADD_INGREDIENT": {
      const {ingredientGroupId, ...ing} = action.payload;
      const copyGroup = [...state.ingredientGroups];
      const idx = copyGroup.findIndex(group => group.id === ingredientGroupId);
      copyGroup[idx].ingredients.push(ing);
      return updateObject(state, {
        ...state,
        ingredientGroups: copyGroup,
      });
    }
    case "UPDATE_INGREDIENT": {
      const {ingredientGroupId, ...ingredient} = action.payload;
      const copyGroup = [...state.ingredientGroups];
      const idx = copyGroup.findIndex(group => group.id === ingredientGroupId);
      const idxIng = copyGroup[idx]?.ingredients.findIndex(ing => ing.id === ingredient.id);
      const updatedIngredient = updateObject(copyGroup[idx].ingredients[idxIng], {
        ...copyGroup[idx].ingredients[idxIng],
        ...ingredient
      });
      copyGroup[idx].ingredients.splice(idxIng, 1, updatedIngredient);
      return updateObject(state, {
        ...state,
        ingredientGroups: copyGroup,
      });
    }
    case "DELETE_INGREDIENT": {
      const {ingredientGroupId, id} = action.payload;
      const copyGroup = [...state.ingredientGroups];
      const idx = copyGroup.findIndex(group => group.id === ingredientGroupId);
      const idxIng = copyGroup[idx].ingredients.findIndex(ing => ing.id === id);
      copyGroup[idx].ingredients.splice(idxIng, 1);
      return updateObject(state, {
        ...state,
        ingredientGroups: copyGroup,
      });
    }
    case "DELETE_GROUP": {
      const copyGroup = [...state.ingredientGroups];
      const idx = copyGroup.findIndex(group => group.id === action.payload.id);
      copyGroup.splice(idx, 1);
      return updateObject(state, {
        ...state,
        ingredientGroups: copyGroup,
      });
    }
    case "DELETE_TIMER": {
      const copyTimer = [...state.timers];
      const idx = copyTimer.findIndex(timer => timer.id = action.payload.id);
      copyTimer.splice(idx, 1);
      return updateObject(state, {
        ...state,
        timers: copyTimer,
      });
    }
    default:
      return state;
  }
};

const RecipeContextProvider = (props: PropsWithChildren): ReactElement => {
  const {state: id} = useLocation();
  const [recipe, dispatch] = useReducer(recipeReducer, baseRecipe);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [autoFocus, setAutoFocus] = useState(false);
  useMount(() => {
    if (!id) return;
    setLoading(true);
    getRequest<Recipe, number>("get-recipe", "recipe-retrieved", id).then(res => {
      // setRecipe(res);
      dispatch({type: "UPDATE_RECIPE", payload: res});
      setLoading(false);
    }).catch(err => {
      console.error("Uh oh: ", err.message);
      setLoading(false);
    });
    getRequest<Folder[], number>("get-folders-for-recipe", "get-folders-for-recipe-return", id)
    .then(res => {
      setFolders(res);
    })
  });
  return (
    <RecipeContext.Provider value={{recipe, dispatch, isEditing, setIsEditing, loading, folders, setFolders, autoFocus, setAutoFocus}}>
      {props.children}
    </RecipeContext.Provider>
  );
};

export {RecipeContextProvider, RecipeContext};
