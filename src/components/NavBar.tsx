import React, {ReactElement} from "react";
import { NavLink } from "react-router-dom";


const NavBar = (): ReactElement => (
  <nav className="">
    <NavLink to="/">Dashboard</NavLink>
    <NavLink to="search">Search</NavLink>
  </nav>
);

export {NavBar};
