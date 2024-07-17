import {ipcRenderer } from "electron";
import {ReactElement, useContext, useEffect, useState} from "react";
import {Folder, Recipe, SearchRecipe} from "../../../src/models/recipe";
import {useMount} from "../../../src/hooks/useMount";
import { CreateRecipeModal } from "../../modals/create-recipe-modal";
import { Button } from "@headlessui/react";
import { getRequest } from "../../messaging/send";
import { RecipeCard } from "../../components/RecipeCard";
import { Search } from "../../components/Search";
import { DashboardContext } from "../../context/DashboardContext";
import { FolderItem } from "../../components/FolderItem";
import { FolderNav } from "../../components/FolderNav";
import { FolderContext } from "../../context/FolderContext";
import { NoFolderSection } from "../../components/NoFolderSection";

export interface RecipeReturn {
  id: number;
  name: string;
  description?: string
  item?: string;
  measurement?: string;
}


const DashboardPage = (): ReactElement => {
  const [recipe, setRecipe] = useState<SearchRecipe[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [searching, setSearching] = useState(false);
  const {setActiveSearch, activeSearch, folder, setFolder} = useContext(DashboardContext);
  const {folders} = useContext(FolderContext)

  const toggleShowCreate = (): void => setShowCreate(prev => !prev);

  const getByFolder = (): void => {
    getRequest<SearchRecipe[], number>("get-recipes-by-folderId", "get-recipes-by-folderId-return", folder.id)
    .then(res => {
      setRecipe(res);
    });
  };

  const handleSearch = (item: string): void => {
    setSearching(true);
    setActiveSearch(true);
    getRequest<SearchRecipe[], [string, number?]>("search", "search-return", [item, folder?.id])
    .then(res => {
      setRecipe(res);
      setSearching(false);
    });
  };

  useEffect(() => {
    if (folder.id === 0) return;
    getByFolder();
  }, [folder.id])

  const handleReset = (): void => {
    setActiveSearch(false);
    if (folder.id === 0) return setRecipe([]);
    getByFolder();
  };

  return (
    <div className="container md:mx-auto">
      <Search handleSearch={handleSearch} handleReset={handleReset} resultCount={recipe.length}/>
      <FolderNav />
      <div className="grid grid-cols-3 gap-2 grid-flow-row-dense">
        {!folder.id && !activeSearch && folders?.map(f => <FolderItem key={f.id} folder={f} onClick={setFolder}/>)}
        {recipe?.map(r => (
          <RecipeCard key={r.id} recipe={r}/>
        ))}
        <NoFolderSection show={!folder.id && !activeSearch}/>
      </div>
      <Button className="btn-primary" onClick={toggleShowCreate}>Hey click me</Button>
      <CreateRecipeModal isOpen={showCreate} onClose={toggleShowCreate}/>
    </div>
  );
};

export {DashboardPage};
