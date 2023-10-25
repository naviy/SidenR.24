import { Div, Focuser, VR } from "@libs";
import Drawer from "@mui/material/Drawer";
import { styled, type Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { AppThemes } from "../AppTheme";
import { DesktopLayout } from "./DesktopLayout";
import { DesktopIconButton } from "./DesktopButtons";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';






//===






export function DesktopSider(props: {

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

					<Focuser cursor ghost click="unfocus">

						<div>

							<DesktopSiderHeader>

								<DesktopIconButton onClick={layout?.toggleSider} flexGrow flexEnd>
									{layout?.logo || null}
									<Div flex1 />
									<VR />
									<ChevronLeftIcon />
								</DesktopIconButton>
								<VR />

							</DesktopSiderHeader>

							{props.children || null}

						</div>

					</Focuser>

				</Sider>

			</SiderSlide>

		</AppThemes.Navigation>

	);

}






//===






const SiderSlide = styled(
	'div',
	{ shouldForwardProp: p => p !== 'open' && p !== 'width' }
)<{

	open: boolean;
	width: number;

}>(
	props => ({

		width: props.open ? props.width : 0,

		transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1)',

	})
);






const Sider = styled(
	Drawer,
	{ shouldForwardProp: p => p !== 'width' }

)<{

	theme?: Theme;
	width: number;

}>(({ theme, width }) => ({


	width: width,

	flexShrink: 0,

	'& .MuiDrawer-paper': {

		width: width,
		boxSizing: 'border-box',
		scrollbarWidth: 'thin',

		'& > div': {
			flex: 1,
			flexDirection: 'column',
			display: 'flex',
			background: theme.palette.action.hover,
		},

	},

}));




const DesktopSiderHeader = styled('div')<{

	theme?: Theme;

}>(
	({ theme }) => ({

		display: 'flex',
		alignItems: 'stretch',

		// necessary for content to be below app bar
		...theme.mixins.toolbar,

		justifyContent: 'flex-end',

	})
);






