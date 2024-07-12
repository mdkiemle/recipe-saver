import {ipcRenderer } from "electron";
import {ReactElement, useEffect, useState} from "react";
import {Recipe} from "../../../src/models/recipe";
import {useMount} from "../../../src/hooks/useMount";
import { Link, NavLink } from "react-router-dom";
import { CreateRecipeModal } from "../../modals/create-recipe-modal";
import { Button } from "@headlessui/react";
import { SearchInput } from "../../components/SearchInput";
import { getRequest } from "../../messaging/send";

export interface RecipeReturn {
  id: number;
  name: string;
  item?: string;
  measurement?: string;
}


const DashboardPage = (): ReactElement => {
  const [recipe, setRecipe] = useState<RecipeReturn[]>([])
  const [showCreate, setShowCreate] = useState(false);

  const toggleShowCreate = (): void => setShowCreate(prev => !prev);

  useMount(() => {
    ipcRenderer.once("async-reply", (event, args: RecipeReturn[] | null) => {
      if (args) setRecipe(args);
    });
    ipcRenderer.send("async-message", "SELECT id, name FROM recipe")
  });

  useMount(() => {
    ipcRenderer.once("folders-get", (event, arg) => {
      console.log("folders get", arg);
    });
    ipcRenderer.send("get-all-folders");
  });

  // const create = (): void => {
  //   console.log("hey", recipe.length);
  //   ipcRenderer.once("create-recipe-return", (e, args: RecipeReturn | string) => {
  //     if (typeof args !== "string") {
  //       console.log("and this?", [...recipe, args]);
  //       setRecipe(prev => [...prev, args]);
  //     }
  //   });
  //   ipcRenderer.send("create-recipe", "Hey Final test");
  // };

  const handleSearch = (item: string): void => {
    console.log("inside handleSearch", item);
    getRequest<RecipeReturn[], string>("search", "search-return", item)
    .then(res => {
      console.log("Uhh excuse me", res);
      setRecipe(res);
    });
  }

  return (
    <div className="container md:mx-auto">
      <SearchInput onEnter={handleSearch}/>
      <div className="flex flex-col">
        {recipe.length && recipe.map(r => (
          <Link key={r.id} to="recipe" state={r.id} className="link inline">{r.name}</Link>
        ))}
      </div>
      <Button className="btn-primary" onClick={toggleShowCreate}>Hey click me</Button>
      <CreateRecipeModal isOpen={showCreate} onClose={toggleShowCreate}/>
    </div>
  );
};

export {DashboardPage};
