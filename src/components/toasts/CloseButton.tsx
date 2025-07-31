import {ReactElement} from "react";
import { GiCancel } from "react-icons/gi";
import {CloseButtonProps} from "react-toastify";

const CloseButton = ({closeToast}: CloseButtonProps): ReactElement => {
  return (
    <GiCancel onClick={closeToast} className="absolute top-1 right-1 cursor-pointer fill-orange-600 hover:fill-orange-900"/>
  )
}

export {CloseButton};
