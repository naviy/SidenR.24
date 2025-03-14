import { $log } from "@libs";
$log("index")
//import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import {  Focuser, GlobalStylesOfPrimitives } from "@libs";
import CssBaseline from "@mui/material/CssBaseline";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./App";




(window as any)["onDocumentLoaded"] = function onDocumentLoaded()
{


	let rootEl = document.getElementById("root") as HTMLElement;

	const root = ReactDOM.createRoot(rootEl);


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


}