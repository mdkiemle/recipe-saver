import {ReactElement} from "react";
import {PrintPreviewProps} from "./PrintColumnView";
import {prettyTime} from "../util/pretty-time";


const PrintTwoColumnView = ({recipe}: PrintPreviewProps): ReactElement => (
  <>
    <header>
      <h2 className="text-2xl">{recipe.name}</h2>
    </header>
    {recipe.timers.length > 0 && 
      <div className="flex gap-4">
        {recipe.timers.map(timer => <span key={timer.id}>{timer.name} - {timer.maxTime}</span>)}
      </div>
    }
    {recipe.totalTime > 0 && 
      <div>
      {prettyTime(recipe.totalTime)}
      </div>
    }
    <div className="flex">
      <div className="flex-1">
        <h2 className="text-2xl">Ingredients</h2>
        {recipe.ingredientGroups.map(ig => <div key={ig.id} className="py-2">
          <h3 className="text-xl">{ig.groupName}</h3>
          {ig.ingredients.map(ing => <p key={ing.id}>{ing.measurement} {ing.item}</p>)}
        </div>)}
      </div>
      <div className="flex-1">
        <h2 className="text-2xl">Directions</h2>
        {recipe.instructions}
        {recipe.notes && <>
          <h3 className="text-2xl pt-4">Notes</h3>
          <div>
            {recipe.notes}
          </div>
        </>
        }
      </div>
    </div>
  </>
);

export {PrintTwoColumnView};