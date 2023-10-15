import { CssBaseline } from "@mui/material";
import ReactDOM from "react-dom/client";
import { AppThemes, GlobalStylesOfPrimitives } from "./@libs";
import { App } from "./App";



const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);


root.render(
	//<React.StrictMode>
	<>
		<CssBaseline />

		<GlobalStylesOfPrimitives />

		<AppThemes>

			<App />

		</AppThemes>
	</>
	//</React.StrictMode>
);
