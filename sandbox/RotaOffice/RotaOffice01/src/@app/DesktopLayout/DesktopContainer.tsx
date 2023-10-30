import { styled } from "@mui/material/styles";
import { type ReactNode } from "react";
import { AppThemes } from "../AppTheme";




export function DesktopContainer(props: { children?: ReactNode; })
{

	return (

		<AppThemes.Navigation>

			<Root>{props.children}</Root>

		</AppThemes.Navigation>

	);

}




const Root = styled(
	"div",
	{ name: "desktop-container" }
)(
	({ theme }) => ({

		flex: 1,
		display: "flex",
		flexDirection: "column",
		position: "relative",

		background: theme.palette.background.paper,

	})
);

