import {ReactElement} from "react";

export interface PillProps {
  children: React.ReactNode;
  icon?: JSX.Element;
}

const Pill = ({children, icon}: PillProps): ReactElement => (
  <div className="flex gap-2 bg-purple-200 w-auto text-sm items-center px-4 py-1 rounded-xl shadow-md">
    {icon}
    {children}
  </div>
);

export {Pill};
