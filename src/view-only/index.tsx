import { createRoot } from "react-dom/client";
import { RecipeViewOnly } from "./recipe-read-only";

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<RecipeViewOnly />);

