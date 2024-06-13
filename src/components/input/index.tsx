import {ReactElement} from "react";
import {FaSearch} from "react-icons/fa"
import {GiSpiderBot, GiSpiderFace} from "react-icons/gi"
import styles from "./input.module.scss";


const Input = (): ReactElement => {
  return (
    <div className={styles.help}>
      <GiSpiderFace />
    </div>
  );
};

export {Input};
