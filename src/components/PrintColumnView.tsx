import {ReactElement} from "react";
import { Recipe } from "../models/recipe";
import { prettyTime } from "../util/pretty-time";
import { unescape } from "validator";

export interface PrintPreviewProps {
  recipe: Recipe;
}

const PrintColumnView = ({recipe: {name, timers, totalTime, ingredientGroups, instructions, notes}}: PrintPreviewProps): ReactElement => (
  <div className="flex flex-col">
    <header>
      <h2 className="text-2xl">{name}</h2>
    </header>
    {timers.length > 0 && 
      <div className="flex gap-4">
        {timers.map(timer => <span key={timer.id}>{timer.name} - {timer.maxTime}</span>)}
      </div>
    }
    {totalTime > 0 &&
      <div>
        {prettyTime(totalTime)}    
      </div>
    }
    <h2 className="text-2xl">Ingredients</h2>
    {ingredientGroups.map(ig => <div key={ig.id} className="py-2">
      <h3 className="text-xl">{ig.groupName}</h3>
      {ig.ingredients.map(ing => <p key={ing.id}>{ing.measurement} {ing.item ? unescape(ing.item) : ""}</p>)}
    </div>)}
    <h2 className="text-2xl">Directions</h2>
    {instructions ? unescape(instructions) : ""}
     {notes && <>
        <h3 className="text-2xl pt-4">Notes</h3>
        <div>
          {unescape(notes)}
        </div>
      </>
    }
  </div>
);

export {PrintColumnView};