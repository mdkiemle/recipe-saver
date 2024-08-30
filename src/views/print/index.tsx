import React, {ReactElement, useContext} from "react";
import { RecipeContext } from "../../context/RecipeContext";
import { useNavigate } from "react-router";
import { FaChevronLeft } from "react-icons/fa";
import { prettyTime } from "../../util/pretty-time";

const PrintPage = (): ReactElement => {
  const {recipe} = useContext(RecipeContext);
  const nav = useNavigate();


  const handleBack = () => nav(-1);
  return (
    <div className="container flex flex-col">
      <FaChevronLeft className="size-5 cursor-pointer self-center" onClick={handleBack}/>
      <header>
        <h2 className="text-2xl">{recipe.name}</h2>
      </header>
      <div className="flex gap-4">
        {recipe.timers.map(timer => <span key={timer.id}>{timer.name} - {timer.maxTime}</span>)}
      </div>
      <div>
      {prettyTime(recipe.totalTime)}
      </div>
      <div className="flex">
        <div className="flex-1">
          <h2 className="text-2xl">Ingredients</h2>
          {recipe.ingredientGroups.map(ig => <div key={ig.id}>
            <h3 className="text-xl">{ig.groupName}</h3>
            {ig.ingredients.map(ing => <p key={ing.id}>{ing.measurement} {ing.item}</p>)}
          </div>)}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl">Directions</h2>
          {recipe.instructions}
        </div>
      </div>
      <div>
        {recipe.notes}
      </div>
    </div>
  );
};

export {PrintPage};
