import React, {ReactElement, useContext} from "react";
import { Timer } from "../models/recipe";
import { RecipeContext } from "../context/RecipeContext";
import { Card } from "./Card";
import { TimerItem } from "./TimerItem";

export interface TimerSectionProps {
  timers: Timer[];
}

const TimerSection = ({timers}: TimerSectionProps): ReactElement | undefined => {
  const {isEditing} = useContext(RecipeContext);
  console.log('timers', timers.length);
  if (timers.length === 0 && !isEditing) return undefined
  return (
    <Card>
      <h2 className="text-xl mb-4">Timers</h2>
      <div className="grid grid-cols-2 gap-3">
        {timers.map(timer => (<TimerItem key={timer.id} timer={timer}/>))}
      </div>
    </Card>
  );
};

export {TimerSection};
