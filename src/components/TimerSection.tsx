import React, {ReactElement, useContext, useEffect, useState} from "react";
import { AddTimerReturn, AddTimerVars, Timer } from "../models/recipe";
import { RecipeContext } from "../context/RecipeContext";
import { Card } from "./Card";
import { TimerItem } from "./TimerItem";
import { Button } from "@headlessui/react";
import { getRequest } from "../messaging/send";

export interface TimerSectionProps {
  timers: Timer[];
}

const timerDefaults = {name: "New Timer", measurement: "minutes"}

const TimerSection = ({timers}: TimerSectionProps): ReactElement | undefined => {
  const {isEditing, recipe: {id}, dispatch, setAutoFocus} = useContext(RecipeContext);
  const [startShowing, setStartShowing] = useState(false);
  console.log('timers', timers.length);

  const handleShowTimerCard = (): void => setStartShowing(true);

  const handleAddTimer = (type: "single" | "range"): void => {
    const values = type === "single" ? {maxTime: 0} : {minTime: 0, maxTime: 0};
    getRequest<AddTimerReturn, AddTimerVars>("add-timer", "add-timer-return", {recipeId: id,  ...timerDefaults, ...values})
    .then(res => {
      dispatch({type: "ADD_TIMER", payload: res});
      setAutoFocus(true);
    }).catch(err => console.log("Uh oh: ", err));
  };

  useEffect(() => {
    if (!isEditing && timers.length === 0) setStartShowing(false);
  }, [isEditing]);

  if (timers.length === 0 && !isEditing) return undefined
  if (timers.length === 0 && !startShowing && isEditing) {
    return <Button className="btn-primary self-start" onClick={handleShowTimerCard}>
      Add Timer Section
    </Button>
  }
  return (
    <Card>
      <h2 className="text-xl mb-4">Timers</h2>
      <div className="grid grid-cols-2 gap-3">
        {timers.map(timer => (<TimerItem key={timer.id} timer={timer}/>))}
      </div>
      {isEditing && <div className="flex items-center gap-3 pt-2">
        <Button className="btn-secondary" onClick={() => handleAddTimer("single")}>Add Time</Button>
        <Button className="btn-primary" onClick={() => handleAddTimer("range")} >Add Range</Button>
      </div>
      }
    </Card>
  );
};

export {TimerSection};
