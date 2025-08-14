import {ReactElement, useCallback, useContext, useEffect, useState} from "react";
import {SearchRecipe} from "../../../src/models/recipe";
import { Button } from "@headlessui/react";
import { createNewDatabase, getRequest, loadNewDatabase } from "../../messaging/send";
import { RecipeCard } from "../../components/RecipeCard";
import { Search } from "../../components/Search";
import { DashboardContext } from "../../context/DashboardContext";
import { FolderItem } from "../../components/FolderItem";
import { FolderNav } from "../../components/FolderNav";
import { FolderContext } from "../../context/FolderContext";
import { NoFolderSection } from "../../components/NoFolderSection";
import { CreateRecipeModal, CreateFolderModal, DatabaseModal } from "../../modals";
import { PiChefHat, PiFolderFill } from "react-icons/pi";
import { SearchResultText } from "../../../src/components/SearchResultText";

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
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const [loadingDatabase, setLoadingDatabase] = useState(false);
  const [searching, setSearching] = useState(false);
  const [newDefault, setNewDefault] = useState(false);
  const {activeSearch, folder, setFolder, setActiveSearch, setSearch} = useContext(DashboardContext);
  const {folders, getFolders} = useContext(FolderContext);

  const toggleShowCreateRecipe = (): void => setShowCreateRecipe(prev => !prev);
  const toggleShowCreateFolder = (): void => setShowCreateFolder(prev => !prev);
  const toggleShowDatabase = (): void => setShowDatabaseModal(prev => !prev);

  const getByFolder = (): void => {
    getRequest<SearchRecipe[], number>("get-recipes-by-folderId", "get-recipes-by-folderId-return", folder.id)
    .then(res => {
      setRecipe(res);
    });
  };


  const filterSearch = useCallback((value: string): string[] => {
    const temp = value.split(",");
    const trimmed = temp.map(value => value.trim());
    return trimmed;
  }, []);

  const handleSearch = (): void => {
    setSearching(true);
    const searchArray = filterSearch(activeSearch);
    getRequest<SearchRecipe[], [string[], number?]>("search", "search-return", [searchArray, folder?.id])
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
    setSearch("");
    if (folder.id === 0) return setRecipe([]);
    setFolder({id: 0, name: ""})
    getByFolder();
  };

  // Could make these two a little cleaner, probably.
  const createCallback = () => {
    setLoadingDatabase(true);
    createNewDatabase({saveAsDefault: newDefault}).then(() => {
      getFolders();
      handleReset();
      setLoadingDatabase(false);
      setShowDatabaseModal(false);
    }).catch(res => console.log("I don't know: ", res));
  };

  const loadCallback = () => {
    setLoadingDatabase(true);
    loadNewDatabase({saveAsDefault: newDefault}).then(() => {
      getFolders();
      handleReset();
      setLoadingDatabase(false);
      setShowDatabaseModal(false);
    }).catch(res => console.log("Maybe an error or something who knows", res));
  };

  useEffect(() => {
    if (activeSearch) handleSearch();
  }, [activeSearch]);

  return (
    <div className="container md:mx-auto h-full">
      <header className="flex gap-2 justify-center pb-4">
        <Search handleSearch={setActiveSearch}/>
        <Button className="btn-primary self-center" onClick={toggleShowCreateRecipe}>
          <PiChefHat /> Create Recipe
        </Button>
        <Button className="btn-secondary self-center" onClick={toggleShowCreateFolder}>
          <PiFolderFill/> Create Folder
        </Button>
      </header>
      {activeSearch && <SearchResultText resultCount={recipe.length} handleReset={handleReset}/>}
      <FolderNav />
      <div className="grid grid-cols-3 gap-2 grid-flow-row-dense">
        {!folder.id && !activeSearch && folders?.map(f => <FolderItem key={f.id} folder={f} onClick={setFolder}/>)}
        {(folder.id || activeSearch) && recipe?.map(r => (
          <RecipeCard key={r.id} recipe={r}/>
        ))}
      </div>
      {!folder.id && !activeSearch && !loadingDatabase && <NoFolderSection /> }
      <CreateRecipeModal isOpen={showCreateRecipe} onClose={toggleShowCreateRecipe} folderId={folder.id}/>
      <CreateFolderModal isOpen={showCreateFolder} onClose={toggleShowCreateFolder}/>
      <DatabaseModal
        isOpen={showDatabaseModal}
        onClose={toggleShowDatabase}
        createCallback={createCallback}
        loadCallback={loadCallback}
        isDefault={newDefault}
        setIsDefault={setNewDefault}
      />
      <Button className="btn-secondary absolute bottom-2 right-2" onClick={toggleShowDatabase}>
        Select Directory
      </Button>
    </div>
  );
};

export {DashboardPage};
