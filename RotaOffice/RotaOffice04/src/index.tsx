//import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import { Focuser, GlobalStylesOfPrimitives } from "@libs";
import CssBaseline from "@mui/material/CssBaseline";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./App";




var root = ReactDOM.createRoot(
	document.getElementById("root")!
);


root.render(
	//<React.StrictMode>
	<>

		<CssBaseline />

		<GlobalStylesOfPrimitives />

		<Focuser.Core />

		<HashRouter>

			<App />

		</HashRouter>

	</>
	//</React.StrictMode>
);
