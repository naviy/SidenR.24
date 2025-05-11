import "./AppThemes";


import { DesktopLayout } from "@app";
import { $log, Div, HR, Route, Txt, useForceUpdate } from "@libs";
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem, { type ListItemProps } from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import * as ReactRouter from "react-router-dom";
import NguIcon from "./@icons/ngu";
import { GlobalState } from "./@libs/components/core/GlobalState";
import { Page04 } from "./page04/Page04";
import { Page041 } from "./page04/Page041";
import { Page042 } from "./page04/Page042";
import { Page043 } from "./page04/Page043";
import { Page051 } from "./page051/Page051";
import { Page052 } from "./page052/Page052";
import { Page061 } from "./page06/Page061";






//===






let routes: ReactRouter.RouteObject[] = [{
	path: "*",
	element: <AppDesktop />,
}];




export function App()
{
	let element = ReactRouter.useRoutes(routes);
	return element;
}






//===






//AppThemes.init({

//	darkTheme: {
//		palette: {
//			mode: 'dark',
//			background: {
//				//paper: "#1a200e",
//				//paper: "#222b13",
//				paper: "#2b3618",
//			},
//		},
//	},

//});






//===






function AppDesktop()
{

	let [globalState] = useState(() => ({}));


	let forceUpdate = useForceUpdate();


	let location = ReactRouter.useLocation();
	let navigate = ReactRouter.useNavigate();

	const routes = [
		Page04.route,
		Page041.route,
		Page042.route,
		Page043.route,
		Page051.route,
		Page052.route,
		Page061.route,
	];


	let defaultActiveKey = routes.at(-1)!.key;
	//let defaultActiveKey = Page043.route.key;


	let router = Route.Router.useNew({

		routes,

		activeKey: location.pathname.substring(1) || defaultActiveKey,

		onActivating: (route) => { navigate("/" + route.key) },

	});



	return (

		<GlobalState.Root rootState={globalState} compress>

			<Route.Router.Provider router={router}>

				<DesktopLayout defaultSiderOpen={true}>


					<Route.SelectorModal />


					<DesktopLayout.Sider logo={<BigLogo />}>

						<HR />

						<List>
							{routes.map(a =>
								<MainMenuItem key={a.key} route={a} />
							)}
						</List>

					</DesktopLayout.Sider>


					<DesktopLayout.Container>


						<DesktopLayout.Header logo={<SmallLogo />}>

							<Route.Slider router={router} flex flex1 vertical offset={24} hidden>

								<DesktopLayout.Header.Icon>
									<Route.Icon />
								</DesktopLayout.Header.Icon>

								<DesktopLayout.Header.Title>
									<Route.Title />
								</DesktopLayout.Header.Title>

							</Route.Slider>


							<Button onClick={() => $log("globalState:", globalState)}>LOG globalState</Button>
							<Button onClick={forceUpdate}><RefreshIcon /></Button>

						</DesktopLayout.Header>


						<DesktopLayout.Main>

							<Route.Slider router={router} fill vertical offset={64}>

								<DesktopLayout.Content>
									<Route.Content globalState />
								</DesktopLayout.Content>

							</Route.Slider>

						</DesktopLayout.Main>


					</DesktopLayout.Container>


				</DesktopLayout>

			</Route.Router.Provider>

		</GlobalState.Root>

	);


}




function BigLogo()
{

	return <Div mt24 mb16 flex1 vflex textCenter>
		<Div>
			<NguIcon sx={{
				fontSize: 80,
				width: `96px !important`,
				filter: "drop-shadow(0px 3px 12px rgba(241, 235, 211, 0.4))",
			}} />
		</Div>
		<Div mt8 fontRoboto font300 upperCase>
			<span style={{ color: "gold" }}>Rota</span>
			<span style={{ color: "#00c3ff" }}>Office</span>
		</Div>
	</Div>;

}



function SmallLogo()
{

	return <Div ml8 vcenter>
		<NguIcon sx={{
			fontSize: 48,
			filter: "drop-shadow(0px 0px 8px rgba(241, 235, 211, 0.4))",

		}} />
		<Div textLeft ml4 fontRoboto font300 upperCase>
			<div style={{ color: "gold" }}>Rota</div>
			<div style={{ color: "#00c3ff" }}>Office</div>
		</Div>
	</Div>;

}




function MainMenuItem({
	route,
	...props
}: Omit<ListItemProps, 'children'> & {
	route: Route.Behavior;
})
{

	const icon = route.icon();
	const title = route.title();
	const description = route.description();


	return (

		<ListItem disablePadding {...props}>

			<ListItemButton onClick={route.activate} selected={route.active}>

				{icon ? <ListItemIcon children={icon} sx={{ minWidth: 36 }} /> : null}

				<ListItemText
					primary={<Txt.Button>{title}</Txt.Button>}
					secondary={description}
				/>

			</ListItemButton>

		</ListItem>

	);

}