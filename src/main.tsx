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
import { ToastContainer } from "react-toastify";
import { CloseButton } from "./components/toasts/CloseButton";


// We could potentially have DashboardContext wrap everything here, but for now it's fine. 
const Main = (): ReactElement => (
  <div className="container relative m-auto">
    <FolderContextProvider>
      <DashboardContextProvider>
        <ToastContainer
          limit={3}
          position="top-center"
          toastClassName="bg-purple-100 fill-orange-800"
          closeButton={CloseButton}
          autoClose={2500}
        />
        <Routes>
          <Route index path="/" element={<DashboardPage />}/>
          <Route element={<RecipeContextLayout />}>
            <Route path="/recipe/:recipeId?" element={<RecipePage />} /> 
            <Route path="/print/:recipeId?" element={<PrintPage />} />
            {/* Route for viewing only, usually opened in a new window */}
            <Route path="/recipe/view-only/:recipeId?" element = {<RecipePage isViewOnly/>} />
          </Route>
        </Routes>
      </DashboardContextProvider>
    </FolderContextProvider>
  </div>
);

export {Main};