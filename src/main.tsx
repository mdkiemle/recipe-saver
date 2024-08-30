/**
 * The main entry point for the react app. Routes and such should probably go here
 */
import {ReactElement} from "react";
import {Route, Routes} from "react-router-dom";
import {DashboardPage} from "./views/dashboard";
import {RecipePage} from "./views/recipe";
import { DashboardContextProvider } from "./context/DashboardContext";
import { FolderContextProvider } from "./context/FolderContext";
import { RecipeContextLayout } from "./RecipeContextLayout";
import { PrintPage } from "./views/print";


// We could potentially have DashboardContext wrap everything here, but for now it's fine. 
const Main = (): ReactElement => (
  <div className="container relative m-auto">
    <FolderContextProvider>
      <DashboardContextProvider>
        <Routes>
          <Route index path="/" element={<DashboardPage />}/>
          <Route element={<RecipeContextLayout />}>
            <Route path="/recipe/:recipeId?" element={<RecipePage />} /> 
            <Route path="/print/:recipeId?" element={<PrintPage />} />
          </Route>
        </Routes>
      </DashboardContextProvider>
    </FolderContextProvider>
  </div>
);

export {Main};