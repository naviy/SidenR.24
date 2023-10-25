import { Box, styled, type Theme } from "@mui/material";
import type { ReactNode } from "react";
import { Div, Focuser } from "@libs";
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

			<Main siderIsOpened={siderIsOpened}>

				<Focuser cursor ghost click="unfocus">

					<Div relative>
						
						{props.children || null}

						<Box sx={{ height: "80vh" }} />

					</Div>

				</Focuser>

			</Main>

		</AppThemes.Default>

	);

}




const Main = styled(
	"main",
	{ shouldForwardProp: p => p !== "siderIsOpened" }
)<{

	theme?: Theme;
	siderIsOpened?: boolean;

}>(

	({ theme, siderIsOpened }) => ({

		flex: 1,

		position: "relative",

		overflow: "auto scroll",

		backgroundColor: theme.palette.mode === "light"
			? "#f3f6f9"
			: theme.palette.grey[900]
		,


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
