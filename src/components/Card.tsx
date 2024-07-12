import React, {ReactElement} from "react";
import {clsx} from "clsx";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({children, className}: CardProps): ReactElement => (
  <div className={clsx("p-3 bg-white rounded-lg shadow-md", className)}>
    {children}
  </div>
);

export {Card};
