/**
 * The main entry point for the react app. Routes and such should probably go here
 */
import {ReactElement} from "react";
import {Route, Routes} from "react-router-dom";
import {DashboardPage} from "./views/dashboard";
import {RecipePage} from "./views/recipe";
import {RecipeContextProvider} from "./context/RecipeContext";
import { DashboardContextProvider } from "./context/DashboardContext";
import { FolderContextProvider } from "./context/FolderContext";


// We could potentially have DashboardContext wrap everything here, but for now it's fine. 
const Main = (): ReactElement => (
  <div className="container relative m-auto">
    <FolderContextProvider>
      <DashboardContextProvider>
        <Routes>
          <Route path="/:recipeId?" element={<DashboardPage />}/>
          <Route path="/recipe" element={<RecipeContextProvider><RecipePage /> </RecipeContextProvider>} />
        </Routes>
      </DashboardContextProvider>
    </FolderContextProvider>
  </div>
);

export {Main};