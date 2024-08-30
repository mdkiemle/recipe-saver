import { ReactElement, useContext } from "react";
import {Outlet} from "react-router-dom";
import { RecipeContextProvider } from "./context/RecipeContext";

const RecipeContextLayout = (): ReactElement => (
  <RecipeContextProvider>
    <Outlet />
  </RecipeContextProvider>
);

export {RecipeContextLayout};
