import React, {ReactElement} from "react";
import {Card} from "./Card";
import {Link} from "react-router-dom";
import { SearchRecipe } from "../models/recipe";

export interface RecipeCardProps {
  recipe: SearchRecipe;
}

/**
 * Potential TODO: after getting past a certain height (increments of ~144px) make row-span 2, 3, etc.
 */

const RecipeCard = ({recipe: r}: RecipeCardProps): ReactElement => (
  <Card>
    <Link key={r.id} to="recipe" state={r.id} className="link inline">{r.name}</Link>
    {r.ingredients?.length && <div className="container flex flex-col">
      <span className="text-green-500">Matches:</span>
      {r.ingredients?.map(i => <span key={i.id}>{i.measurement} {i.item}</span>)} 
    </div>}
    {r.description ? <div className="container flex flex-col">
        <span className="text-orange-500">Description:</span>
        <span>{r.description}</span>
      </div> :
      <p className="text-gray-500">No description available</p>
    }
  </Card>
);

export {RecipeCard};
