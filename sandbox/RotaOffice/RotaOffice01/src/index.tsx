import { CssBaseline } from "@mui/material";
import ReactDOM from "react-dom/client";
import { $log, AppThemes, Focuser, GlobalStylesOfPrimitives } from "./@libs";
import { App } from "./App";




(window as any)["onDocumentLoaded"] = function onDocumentLoaded()
{


	let rootEl = document.getElementById("root") as HTMLElement;
	$log("rootEl:", rootEl);


	const root = ReactDOM.createRoot(rootEl);


	root.render(
		//<React.StrictMode>
		<>
			<CssBaseline />

			<GlobalStylesOfPrimitives />

			<Focuser.Core />

			<AppThemes>

				<App />

			</AppThemes>
		</>
		//</React.StrictMode>
	);


}