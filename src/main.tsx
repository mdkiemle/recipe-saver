/**
 * The main entry point for the react app. Routes and such should probably go here
 */
import {ReactElement} from "react";
import {NavLink, Route, Routes} from "react-router-dom";
import {DashboardPage} from "./views/dashboard";
import {SearchPage} from "./views/search";
import {RecipePage} from "./views/recipe";

const Main = (): ReactElement => {
	return (
    <div>
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="search">Search</NavLink>
      <NavLink to="recipe">Recipe</NavLink>
      <Routes>
        <Route path="/" element={<DashboardPage />}/>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/recipe" element={<RecipePage />} />
      </Routes>
    </div>
	);
};

export {Main};