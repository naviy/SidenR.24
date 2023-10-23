import { CssBaseline } from "@mui/material";
import ReactDOM from "react-dom/client";
import { AppThemes, Focuser, GlobalStylesOfPrimitives } from "./@libs";
import { App } from "./App";




const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);


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
