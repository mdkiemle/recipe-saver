import {ReactElement} from "react";
import {FaSearch, FaFolder, FaFolderOpen} from "react-icons/fa"
import {GiSpiderBot, GiSpiderFace} from "react-icons/gi"
import {} from "react-icons";
import styles from "./input.module.scss";


const Input = (): ReactElement => {
  return (
    <div className={styles.help}>
      <GiSpiderFace />
      <FaFolderOpen />
    </div>
  );
};

export {Input};
