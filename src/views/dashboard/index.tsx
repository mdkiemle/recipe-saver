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
import { CreateFolderModal } from "../../modals/create-folder-modal";
import { PiChefHat, PiFolder, PiFolderFill } from "react-icons/pi";

export interface RecipeReturn {
  id: number;
  name: string;
  description?: string
  item?: string;
  measurement?: string;
}


const DashboardPage = (): ReactElement => {
  const [recipe, setRecipe] = useState<SearchRecipe[]>([]);
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [searching, setSearching] = useState(false);
  const {setActiveSearch, activeSearch, folder, setFolder} = useContext(DashboardContext);
  const {folders} = useContext(FolderContext)

  const toggleShowCreateRecipe = (): void => setShowCreateRecipe(prev => !prev);
  const toggleShowCreateFolder = (): void => setShowCreateFolder(prev => !prev);

  const getByFolder = (): void => {
    getRequest<SearchRecipe[], number>("get-recipes-by-folderId", "get-recipes-by-folderId-return", folder.id)
    .then(res => {
      setRecipe(res);
    });
  };

  const handleSearch = (item: string): void => {
    setSearching(true);
    setActiveSearch(item);
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
    setActiveSearch("");
    if (folder.id === 0) return setRecipe([]);
    getByFolder();
  };

  return (
    <div className="container md:mx-auto">
      <header className="flex gap-2">
        <Search handleSearch={handleSearch} handleReset={handleReset} resultCount={recipe.length}/>
        <Button className="btn-primary self-start" onClick={toggleShowCreateRecipe}>
          <PiChefHat />Create Recipe
        </Button>
        <Button className="btn-secondary self-start" onClick={toggleShowCreateFolder}>
          <PiFolderFill/> Create Folder
        </Button>
      </header>
      <FolderNav />
      <div className="grid grid-cols-3 gap-2 grid-flow-row-dense">
        {!folder.id && !activeSearch && folders?.map(f => <FolderItem key={f.id} folder={f} onClick={setFolder}/>)}
        {recipe?.map(r => (
          <RecipeCard key={r.id} recipe={r}/>
        ))}
      </div>
      <NoFolderSection show={!folder.id && !activeSearch}/>
      <CreateRecipeModal isOpen={showCreateRecipe} onClose={toggleShowCreateRecipe}/>
      <CreateFolderModal isOpen={showCreateFolder} onClose={toggleShowCreateFolder}/>
    </div>
  );
};

export {DashboardPage};
