import { styled, type Theme } from "@mui/material";
import type { ReactNode } from "react";
import { DesktopLayout } from ".";
import { AppThemes } from "../AppTheme";






//===






export function DesktopMain(props: {

	children?: ReactNode;

})
{

	const layout = DesktopLayout.use();

	const siderIsOpened = layout?.siderIsOpened ?? true;



	return (

		<AppThemes.Default>

			<DesktopMain.Root siderIsOpened={siderIsOpened}>

				{props.children}

			</DesktopMain.Root>

		</AppThemes.Default>

	);

}





export module DesktopMain
{


	//---




	export var Root = styled(
		"main",
		{ shouldForwardProp: p => p !== "siderIsOpened" }
	)<{

		theme?: Theme;
		siderIsOpened?: boolean;

	}>(

		({ theme, siderIsOpened }) => ({

			flex: 1,

			position: "relative",

			//overflow: "auto scroll",

			backgroundColor: theme.palette.mode === "light"
				//? "#f3f9f6"
				? "#ecffe0"
				//? green[50]
				: theme.palette.grey[900]
			,

			borderTopLeftRadius: 24,
			//borderBottomLeftRadius: 24,
			//boxShadow: "inset 12px 12px 16px rgba(0,0,0,.3), inset 4px 4px 6px rgba(0,0,0,.3)",
			boxShadow: "inset 12px 12px 24px -4px rgba(0,0,0,.3), inset 4px 4px 12px -2px rgba(0,0,0,.2), inset 2px 2px 6px -1px rgba(0,0,0,0.2)",

			//boxShadow: "inset 0px 0px 4px -1px rgba(0,0,0,0.2), inset 0px 0px 5px 0px rgba(0,0,0,0.14), inset 0px 0px 10px 0px rgba(0,0,0,0.12)",

			//zIndex: 1,

			transition: theme.transitions.create("margin", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),

			...(siderIsOpened && {

				transition: theme.transitions.create("margin", {
					easing: theme.transitions.easing.easeOut,
					duration: theme.transitions.duration.enteringScreen,
				}),

				marginLeft: 0,

			}),

		})

	);




	//---


}