import React, {ReactElement, useContext, useMemo} from "react";
import { AddTimerReturn, DeleteTimerReturn, Timer, TimerMeasure, TimerUpdates, TimerUpdateVars } from "../models/recipe";
import { ToggleInput } from "./ToggleInput";
import { getRequest } from "../messaging/send";
import { RecipeContext } from "../context/RecipeContext";
import { ToggleNumberInput } from "./ToggleNumberInput";
import { Select } from "@headlessui/react";
import { ToggleSelect } from "./ToggleSelect";
import { PiTrash } from "react-icons/pi";

export interface TimerProps {
  timer: Timer;
}

const TimerItem = ({timer}: TimerProps): ReactElement => {
  const {isEditing, dispatch, autoFocus} = useContext(RecipeContext);
  const {maxTime, minTime, measurement} = timer;
  const handleTimerUpdate = (updates:  Pick<TimerUpdateVars, "measurement" | "name">): void => {
    getRequest<AddTimerReturn, TimerUpdates>("update-timer", "update-timer-return", {id: timer.id, updates})
    .then(res => {
      dispatch({type: "UPDATE_TIMER", payload: res});
    });
  };

  const handleTimeUpdates = (type: "minTime" | "maxTime", value: number): void => {
    const converted = measurement === "hours" ? value * 60 : value;
    getRequest<AddTimerReturn, TimerUpdates>("update-timer", "update-timer-return", {id: timer.id, updates: {[type]: converted}})
    .then(res => {
      dispatch({type: "UPDATE_TIMER", payload: res});
    });
  };

  const handleDelete = (): void => {
    getRequest<DeleteTimerReturn, number>("delete-timer", "delete-timer-return", timer.id)
    .then(res => {
      dispatch({type: "DELETE_TIMER", payload: res});
    });
  }

  // Time is stored as minutes (since seconds doesn't make sense in terms of cooking, and makes it easier for me)
  const convertedMin = measurement === "hours" ? (minTime / 60).toFixed(2) : minTime;
  const convertedMax = measurement === "hours" ? (maxTime / 60).toFixed(2) : maxTime;
  return (
    <>
      <ToggleInput
        id={`timer-name-${timer.id}`}
        value={timer.name}
        className="px-1 py-1 col-span-2"
        isEditing={isEditing}
        onBlur={v => handleTimerUpdate({name: v})}
        autoFocus={autoFocus}
      />
      <div className="flex gap-2 items-center col-span-6">
        {timer.minTime !== null && <>
          <ToggleNumberInput
            id={`timer-maxTime-${timer.id}`}
            value={Number(convertedMin)}
            className="px-1 py-1 w-min max-w-20"
            isEditing={isEditing}
            onBlur={e => handleTimeUpdates("minTime", e)}
          />
          <span>-</span>
        </>
        }
        <ToggleNumberInput
          id={`timer-maxTime-${timer.id}`}
          value={Number(convertedMax)}
          className="px-1 py-1 w-min max-w-20"
          isEditing={isEditing}
          onBlur={e => handleTimeUpdates("maxTime", e)}
        />
        <ToggleSelect
          isEditing={isEditing}
          value={timer.measurement} 
          options={["minutes", "hours"]}
          handleSelect={value => handleTimerUpdate({measurement: value as TimerMeasure})}
        />
        {isEditing && <PiTrash onClick={handleDelete} className="fill-red-500 cursor-pointer" />}
      </div>
    </>
  );
};

export {TimerItem};
