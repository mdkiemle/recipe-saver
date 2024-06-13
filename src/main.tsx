/**
 * The main entry point for the react app. Routes and such should probably go here
 */
import {ReactElement} from "react";
import { Input } from "./components/input";

const Main = (): ReactElement => {
	return (
			<div>
					hey there it's the app.
          <Input />
			</div>
	);
};

export {Main};