import React, {ReactElement, useContext, useEffect, useState} from "react";
import {RecipeContext} from "../../context/RecipeContext";
import {Textarea} from "@headlessui/react";
import {clsx} from "clsx"
import {useResizeTextarea} from "../../hooks/useResizeTextarea";

export interface RecipeSectionProps {
  id: string;
  textValue?: string;
  onBlur?: (newValue: string) => void;
}

const RecipeSection = ({id, textValue, onBlur}: RecipeSectionProps): ReactElement => {
  const {isEditing} = useContext(RecipeContext);
  const [value, setValue] = useState(textValue ?? "");
  const resizeProps = useResizeTextarea();

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>): void => {
    if (!isEditing || textValue === e.target.value) return;
    onBlur?.(e.target.value);
  };

  // For if the textValue updates outside of this element
  useEffect(() => {
    if (textValue !== value) setValue(textValue);
  }, [textValue]);
  return (
    <Textarea
      {...resizeProps}
      id={id}
      value={value ?? ""}
      onBlur={handleBlur}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
      className={clsx("resize-none rounded-md px-4 py-2 w-full bg-gray-100", !isEditing && "bg-transparent outline-none cursor-auto")}
      placeholder={`There is currently no ${id} for this recipe`}
      readOnly={!isEditing}
    />
  )
};

export {RecipeSection};
