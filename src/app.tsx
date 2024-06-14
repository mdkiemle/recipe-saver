import {createRoot} from "react-dom/client";
import {Main} from "./main";
import {HashRouter} from "react-router-dom";

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<HashRouter>
  <Main />
</HashRouter>
);