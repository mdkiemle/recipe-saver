import {PropsWithChildren, ReactElement, act, createContext, useEffect, useMemo, useReducer, useState} from "react";
import {AddIngredientReturn, DeleteGroupReturn, DeleteIngredientReturn, DeleteTimerReturn, Folder, IngredientGroup, RawIngredientGroup, Recipe, RecipeLink, RecipeUpdateReturn, Timer} from "../models/recipe";
import { updateObject } from "../util/update-object";
import { Setter } from "../models/setter" ;
import {useParams} from "react-router";
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
  recipeLinks: [],
  // Could add folders here
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
  {type: "COPY_GROUPS", payload: IngredientGroup[]} |
  {type: "ADD_INGREDIENT" | "UPDATE_INGREDIENT", payload: AddIngredientReturn} |
  {type: "DELETE_INGREDIENT", payload: DeleteIngredientReturn} |
  {type: "DELETE_GROUP", payload: DeleteGroupReturn} |
  {type: "DELETE_TIMER", payload: DeleteTimerReturn} |
  {type: "ADD_TIMER" | "UPDATE_TIMER", payload: Timer} |
  {type: "ADD_LINKS", payload: RecipeLink[]} | // Mostly for querying update
  {type: "UPDATE_LINK" | "ADD_LINK", payload: RecipeLink} |
  {type: "DELETE_LINK", payload: number};

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
        ...action.payload,
      });
    case "UPDATE_GROUPNAME":
      return updateObject(state, {
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
        ingredientGroups: [...state.ingredientGroups, {...action.payload, ingredients: []}]
      });
    case "COPY_GROUPS":
      return updateObject(state, {
        ingredientGroups: [...state.ingredientGroups, ...action.payload],
      });
    case "ADD_TIMER": {
      return updateObject(state, {
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
        timers: copiedTimers,
      })
    }
    case "ADD_INGREDIENT": {
      const {ingredientGroupId, ...ing} = action.payload;
      const copyGroup = [...state.ingredientGroups];
      const idx = copyGroup.findIndex(group => group.id === ingredientGroupId);
      copyGroup[idx].ingredients.push(ing);
      return updateObject(state, {
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
        ingredientGroups: copyGroup,
      });
    }
    case "DELETE_GROUP": {
      const copyGroup = [...state.ingredientGroups];
      const idx = copyGroup.findIndex(group => group.id === action.payload.id);
      copyGroup.splice(idx, 1);
      return updateObject(state, {
        ingredientGroups: copyGroup,
      });
    }
    case "DELETE_TIMER": {
      const copyTimer = [...state.timers];
      const idx = copyTimer.findIndex(timer => timer.id = action.payload.id);
      copyTimer.splice(idx, 1);
      return updateObject(state, {
        timers: copyTimer,
      });
    }
    case "DELETE_LINK": {
      const copyLinks = [...state.recipeLinks];
      const idx = copyLinks.findIndex(link => link.id === action.payload);
      copyLinks.splice(idx, 1);
      return updateObject(state, {
        recipeLinks: copyLinks,
      });
    }
    case "ADD_LINKS":
      return updateObject(state, {
        recipeLinks: [...state.recipeLinks, ...action.payload],
      });
    case "ADD_LINK":
      return updateObject(state, {
        recipeLinks: [...state.recipeLinks, action.payload],
      });
    default:
      return state;
  }
};

const RecipeContextProvider = (props: PropsWithChildren): ReactElement => {
  const {recipeId} = useParams<{recipeId: string}>();
  const [recipe, dispatch] = useReducer(recipeReducer, baseRecipe);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [autoFocus, setAutoFocus] = useState(false);
  useEffect(() => {
    if (!recipeId) return;
    setLoading(true);
    getRequest<Recipe, string>("get-recipe", "recipe-retrieved", recipeId).then(res => {
      // setRecipe(res);
      dispatch({type: "UPDATE_RECIPE", payload: res});
      setLoading(false);
    }).catch(err => {
      console.error("Uh oh: ", err.message);
      setLoading(false);
    });
    getRequest<Folder[], string>("get-folders-for-recipe", "get-folders-for-recipe-return", recipeId)
    .then(res => {
      setFolders(res);
    });
  }, [recipeId]);

  // Maybe overkill. Should look into cost on with and without.
  const contextValue = useMemo(() => ({
    recipe,
    isEditing,
    loading,
    folders,
    autoFocus,
    dispatch,
    setIsEditing,
    setFolders,
    setAutoFocus,
  }), [recipe, dispatch, isEditing, autoFocus, setAutoFocus, loading, folders, setFolders, setIsEditing]);

  return (
    <RecipeContext.Provider value={contextValue}>
      {props.children}
    </RecipeContext.Provider>
  );
};

export {RecipeContextProvider, RecipeContext};
