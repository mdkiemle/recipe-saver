import React, {ReactElement, useContext} from "react";
import { AddTimerReturn, Timer, TimerMeasure, TimerUpdates, TimerUpdateVars } from "../models/recipe";
import { ToggleInput } from "./ToggleInput";
import { getRequest } from "../messaging/send";
import { RecipeContext } from "../context/RecipeContext";
import { ToggleNumberInput } from "./ToggleNumberInput";
import { Select } from "@headlessui/react";
import { ToggleSelect } from "./ToggleSelect";

export interface TimerProps {
  timer: Timer;
}

const TimerItem = ({timer}: TimerProps): ReactElement => {
  const {isEditing, dispatch, autoFocus} = useContext(RecipeContext);
  const handleTimerUpdate = (updates:  Pick<TimerUpdateVars, "measurement" | "name">): void => {
    getRequest<AddTimerReturn, TimerUpdates>("update-timer", "update-timer-return", {id: timer.id, updates})
    .then(res => {
      dispatch({type: "UPDATE_TIMER", payload: res});
    });
  };

  const handleTimeUpdates = (type: "minTime" | "maxTime", value: number): void => {
    const converted = timer.measurement === "hours" ? value * 60 : value;
    getRequest<AddTimerReturn, TimerUpdates>("update-timer", "update-timer-return", {id: timer.id, updates: {[type]: converted}})
    .then(res => {
      dispatch({type: "UPDATE_TIMER", payload: res});
    });
  };
  return (
    <>
      <ToggleInput
        id={`timer-name-${timer.id}`}
        value={timer.name}
        className="px-1 py-1"
        isEditing={isEditing}
        onBlur={v => handleTimerUpdate({name: v})}
        autoFocus={autoFocus}
      />
      <div className="flex gap-2 items-center">
        {timer.minTime !== null && <>
          <ToggleNumberInput
            id={`timer-maxTime-${timer.id}`}
            value={Number(timer.minTime)}
            className="px-1 py-1"
            isEditing={isEditing}
            onBlur={e => handleTimeUpdates("minTime", e)}
          />
          <span>-</span>
        </>
        }
        {timer.maxTime !== null && <>
          <ToggleNumberInput
            id={`timer-maxTime-${timer.id}`}
            value={Number(timer.maxTime)}
            className="px-1 py-1"
            isEditing={isEditing}
            onBlur={e => handleTimeUpdates("maxTime", e)}
          />
          </>
        }
        <ToggleSelect
          isEditing={isEditing}
          value={timer.measurement} 
          options={["minutes", "hours"]}
          handleSelect={value => handleTimerUpdate({measurement: value as TimerMeasure})}
        />
      </div>
    </>
  );
};

export {TimerItem};
