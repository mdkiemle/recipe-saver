import { ReactElement } from "react";
import { ToastContentProps } from "react-toastify";

type CustomNotifictionProps = ToastContentProps<{
  content: string;
  title?: string;
}>

const StandardToast = (props: CustomNotifictionProps): ReactElement => (
  <div className="text-orange-600">
    {props.data.content}
  </div>
);

export {StandardToast};