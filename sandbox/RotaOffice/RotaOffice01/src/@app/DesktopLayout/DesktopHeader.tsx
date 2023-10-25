import { Div, VR } from "@libs";
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { styled, type Theme } from "@mui/material/styles";
import type { ReactNode } from 'react';
import { AppThemes } from "../AppTheme";
import { DesktopIconButton } from "./DesktopButtons";
import { DesktopLayout } from "./DesktopLayout";






//===






//export const DesktopHeader = $logf(
export function DesktopHeader(props: { children?: ReactNode; })
{


	const layout = DesktopLayout.use();

	const siderIsOpened = layout?.siderIsOpened !== false;
	
	let siderWidth = layout?.siderWidth || DesktopLayout.defaultSiderWidth;


	return (

		<AppThemes.Default>

			<HeaderRoot>

				<AppThemes.Navigation>

					{/*<HideOnScroll>*/}

						<HeaderRoot1 
							siderWidth={siderIsOpened ? siderWidth : 0}
						>

							<TopBar 
								//siderIsOpened={siderIsOpened} position="static"
							>

								<Toolbar>

									<HeaderLogo 
									//visible={!siderIsOpened} 
									siderWidth={siderWidth}
									>

										<DesktopIconButton onClick={toggleClick} flexGrow>
											<MenuIcon />
											<VR />
											<Div pr1 />
											{layout?.logo || null}
											<Div pr3 />
										</DesktopIconButton>

									</HeaderLogo>

									<VR />

									{props.children || null}


								</Toolbar>

							</TopBar>

						</HeaderRoot1>


					{/*</HideOnScroll>*/}

				</AppThemes.Navigation>

			</HeaderRoot>

		</AppThemes.Default>

	);




	function toggleClick(e: React.MouseEvent)
	{
		e.stopPropagation();
		layout?.toggleSider();
	}


}




//---




export const HeaderRoot = styled('div')<{

	theme?: Theme;

}>(
	({ theme }) =>
	({

		//minHeight: 64, 

		backgroundColor: theme.palette.mode === 'light'
			? theme.palette.grey[100]
			: theme.palette.grey[900]
		,
		zIndex: 1,
	})
);






export const HeaderRoot1 = styled(
	'div', 
	{
		name: 'header-root-1',
		shouldForwardProp: p => p !== 'siderWidth',
	}
)<{

	theme?: Theme;
	siderWidth: number;

}>(
	({ theme, siderWidth }) =>
	({
		//position: 'fixed', 
		//top: 0, 
		left: siderWidth,
		//right: 0,
		//zIndex: 1100,

		minHeight: 64, 

		transition: theme.transitions.create(['left'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),

	})
);






const TopBar = styled(

	AppBar,
	//{ shouldForwardProp: p => p !== 'siderIsOpened', }

)<{

	theme?: Theme,
	//siderIsOpened: boolean;

}>(

	({ /*theme, siderIsOpened*/ }) => ({


		'& .MuiToolbar-root': {
			alignItems: 'stretch',
			paddingLeft: 0,
			//paddingLeft: siderIsOpened ? 24 : 0,
		},


		//transition: theme.transitions.create(['padding-left'], {
		//	easing: theme.transitions.easing.sharp,
		//	duration: theme.transitions.duration.leavingScreen,
		//}),

	})

);






export const HeaderLogo = styled(
	'div',
	{
		name: 'header-logo',
		shouldForwardProp: p => /*p !== 'visible' &&*/ p !== 'siderWidth'
	}
)<{

	theme?: Theme;
	//visible: boolean;
	siderWidth: number;

}>(
	({ theme, /*visible,*/ siderWidth }) =>
	({

		width: siderWidth,
		//width: visible ? siderWidth : 24,
		//marginLeft: visible ? 0 : -siderWidth,
		marginRight: 24,

		borderRight: `1px solid ${theme.palette.divider}`,
		//opacity: visible ? 1 : 0,

		display: 'flex',
		overflow: 'hidden',

		fontSize: '1.5rem',

		transition: theme.transitions.create(['margin-left', 'padding-right', 'opacity'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),

	})
);





//---




//function HideOnScroll(props: { children: React.ReactElement })
//{

//	const trigger = useScrollTrigger({
//		target: 'desktop-container',
//	});


//	return <Slide appear={false} direction="down" in={!trigger}>
//		{props.children}
//	</Slide>;

//}
