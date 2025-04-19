import { Focuser, VR } from "@libs";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Drawer from "@mui/material/Drawer";
import { styled, type Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { AppThemes } from "../AppThemes";
import { DesktopIconButton } from "./DesktopButtons";
import { DesktopLayout } from "./DesktopLayout";






//===






export function DesktopSider(props: {

	logo?: ReactNode;
	children?: ReactNode;

})
{

	const layout = DesktopLayout.use();

	const width = layout?.siderWidth ?? DesktopLayout.defaultSiderWidth;
	const siderIsOpened = layout?.siderIsOpened !== false;


	return (

		<AppThemes.Navigation>

			<SiderSlide open={siderIsOpened} width={width}>

				<Sider variant="persistent" open={siderIsOpened} width={width}>

					<Focuser ghost name="DesktopSider" cursor>

						<div>

							<DesktopSiderHeader>

								<DesktopIconButton onClick={layout?.toggleSider} flexGrow flexEnd>
									{props.logo}
									<VR />
									<ChevronLeftIcon fontSize="large" />
								</DesktopIconButton>
								{/*<VR />*/}

							</DesktopSiderHeader>

							{props.children}

						</div>

					</Focuser>

				</Sider>

			</SiderSlide>

		</AppThemes.Navigation>

	);

}






export module DesktopSider
{

}






//===






const SiderSlide = styled(
	"div",
	{ shouldForwardProp: p => p !== "open" && p !== "width" }
)<{

	open: boolean;
	width: number;

}>(
	props => ({

		width: props.open ? props.width : 0,

		transition: "width 225ms cubic-bezier(0, 0, 0.2, 1)",

	})
);






const Sider = styled(
	Drawer,
	{ shouldForwardProp: p => p !== "width" }

)<{

	theme?: Theme;
	width: number;

}>(({ width }) => ({


	width: width,


	">.MuiPaper-root": {
		//zIndex: 1,
		border: "unset",
	},

	"& .MuiDrawer-paper": {

		width: width,
		boxSizing: "border-box",
		scrollbarWidth: "thin",

		"& > div": {
			flex: 1,
			flexDirection: "column",
			display: "flex",
			//background: theme.palette.action.hover,
		},

	},

}));




const DesktopSiderHeader = styled("div")<{

	theme?: Theme;

}>(
	({ theme }) => ({

		display: "flex",
		alignItems: "stretch",

		// necessary for content to be below app bar
		...theme.mixins.toolbar,

		justifyContent: "flex-end",

	})
);






