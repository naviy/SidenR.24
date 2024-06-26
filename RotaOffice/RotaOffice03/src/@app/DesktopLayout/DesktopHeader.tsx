import { Div, VR } from "@libs";
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import type { ReactNode } from 'react';
import { AppThemes } from "../AppThemes";
import { DesktopIconButton } from "./DesktopButtons";
import { DesktopLayout } from "./DesktopLayout";






//===






export function DesktopHeader(props: {

	logo?: ReactNode;
	children?: ReactNode;

})
{


	const layout = DesktopLayout.use();

	const siderIsOpened = layout?.siderIsOpened !== false;

	let siderWidth = layout?.siderWidth || DesktopLayout.defaultSiderWidth;


	return (

		<AppThemes.Navigation>

			<HeaderRoot1
				siderWidth={siderIsOpened ? siderWidth : 0}
			>

				<TopBar>

					<Toolbar>

						<HeaderLogo siderWidth={siderWidth}>

							<DesktopIconButton onClick={toggleClick} flexGrow>
								<MenuIcon fontSize="large" />
								<VR />
								<Div pr1 />
								{props.logo || null}
								{/*<Div pr3 />*/}
							</DesktopIconButton>

						</HeaderLogo>

						<VR />

						{props.children || null}


					</Toolbar>

				</TopBar>

			</HeaderRoot1>


		</AppThemes.Navigation>

	);




	function toggleClick(e: React.MouseEvent)
	{
		e.stopPropagation();
		layout?.toggleSider();
	}


}




export module DesktopHeader
{

	export var Icon = styled(Div)({


		display: "flex",
		alignItems: "center",
		minWidth: 64,

		fontSize: 40,

		">svg": {
			fontSize: "1em",
		},

	});

	export var Title = styled(Div)({


		display: "flex",
		alignItems: "center",

		margin: 0,

		fontFamily: "Roboto,Helvetica,Arial,sans-serif",
		fontWeight: 300,
		fontSize: 40,

		lineHeight: "64px",
		letterSpacing: "-0.00833em",

		padding: "0 24px 0 0",

	});

}



//---




export var HeaderRoot = styled('div')(
	({ theme }) =>
	({

		//backgroundColor: theme.palette.mode === 'light'
		//	? theme.palette.grey[100]
		//	: theme.palette.grey[900]
		//,
		//zIndex: 1,
	})
);






export var HeaderRoot1 = styled(
	'div',
	{
		name: 'header-root-1',
		shouldForwardProp: p => p !== 'siderWidth',
	}
)<{

	siderWidth: number;

}>(
	({ theme, siderWidth }) =>
	({

		left: siderWidth,

		minHeight: 64,

		transition: theme.transitions.create(['left'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),

	})
);






const TopBar = styled(AppBar)({

	'& .MuiToolbar-root': {
		alignItems: 'stretch',
		paddingLeft: 0,
	},

	backgroundImage: "unset",
	boxShadow: "unset",
	//zIndex: "unset",

});






export var HeaderLogo = styled(
	'div',
	{
		name: 'header-logo',
		shouldForwardProp: p => p !== 'siderWidth'
	}
)<{

	siderWidth: number;

}>(
	({ theme, siderWidth }) =>
	({

		width: siderWidth,
		marginRight: 24,

		borderRight: `1px solid ${theme.palette.divider}`,

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
