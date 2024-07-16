import {ipcRenderer } from "electron";
import {ReactElement, useContext, useEffect, useState} from "react";
import {Recipe, SearchRecipe} from "../../../src/models/recipe";
import {useMount} from "../../../src/hooks/useMount";
import { Link, NavLink } from "react-router-dom";
import { CreateRecipeModal } from "../../modals/create-recipe-modal";
import { Button } from "@headlessui/react";
import { getRequest } from "../../messaging/send";
import { RecipeCard } from "../../components/RecipeCard";
import { Search } from "../../components/Search";
import { DashboardContext } from "../../context/DashboardContext";

export interface RecipeReturn {
  id: number;
  name: string;
  description?: string
  item?: string;
  measurement?: string;
}


const DashboardPage = (): ReactElement => {
  const [recipe, setRecipe] = useState<SearchRecipe[]>([])
  const [showCreate, setShowCreate] = useState(false);
  const [searching, setSearching] = useState(false);
  const {setActiveSearch} = useContext(DashboardContext);

  const toggleShowCreate = (): void => setShowCreate(prev => !prev);

  const initialRequest = (): void => {
    getRequest<SearchRecipe[], undefined>("get-recipes", "get-recipes-return", undefined)
    .then(res => {
      setRecipe(res);
    });
  }

  useMount(() => {
    initialRequest();
    // ipcRenderer.once("async-reply", (event, args: RecipeReturn[] | null) => {
    //   if (args) setRecipe(args);
    // });
    // ipcRenderer.send("async-message", "SELECT id, name FROM recipe")
  });

  useMount(() => {
    ipcRenderer.once("folders-get", (event, arg) => {
      console.log("folders get", arg);
    });
    ipcRenderer.send("get-all-folders");
  });

  const handleSearch = (item: string): void => {
    setSearching(true);
    setActiveSearch(true);
    getRequest<SearchRecipe[], string>("search", "search-return", item)
    .then(res => {
      setRecipe(res);
      setSearching(false);
    });
  };

  const handleReset = (): void => {
    setActiveSearch(false);
    initialRequest();
  };

  return (
    <div className="container md:mx-auto">
      <Search handleSearch={handleSearch} handleReset={handleReset} resultCount={recipe.length}/>
      <div className="grid grid-cols-3 gap-2 grid-flow-row-dense">
        {recipe?.map(r => (
          <RecipeCard key={r.id} recipe={r}/>
        ))}
      </div>
      <Button className="btn-primary" onClick={toggleShowCreate}>Hey click me</Button>
      <CreateRecipeModal isOpen={showCreate} onClose={toggleShowCreate}/>
    </div>
  );
};

export {DashboardPage};
