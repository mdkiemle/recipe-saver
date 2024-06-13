import {createRoot} from "react-dom/client";
import {Main} from "./main";
const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<Main />)