/**
 * The main entry point for the react app. Routes and such should probably go here
 */
import {ReactElement} from "react";
import {NavLink, Route, Routes} from "react-router-dom";
import {DashboardPage} from "./views/dashboard";
import {SearchPage} from "./views/search";
import {RecipePage} from "./views/recipe";
import {RecipeContextProvider} from "./context/RecipeContext";
import {NavBar} from "./components/NavBar"
import { DashboardContextProvider } from "./context/DashboardContext";


// We could potentially have DashboardContext wrap everything here, but for now it's fine. 
const Main = (): ReactElement => (
  <div className="container">
    <NavBar />
    <Routes>
      <Route path="/" element={<DashboardContextProvider><DashboardPage /> </DashboardContextProvider>}/>
      <Route path="/search" element={<SearchPage />} />
      <Route path="/recipe" element={<RecipeContextProvider><RecipePage /> </RecipeContextProvider>} />
      <Route path="/recipe/:recipeId" element={<RecipePage />} />
    </Routes>
  </div>
);

export {Main};