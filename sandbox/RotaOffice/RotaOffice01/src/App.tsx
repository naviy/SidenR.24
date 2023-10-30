import { AppThemes, DesktopLayout } from "@app";
import { $log, Div, Focuser, HR, Route, Txt } from "@libs";
import { Button, createTheme } from "@mui/material";
import List from "@mui/material/List";
import ListItem, { type ListItemProps } from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import * as ReactRouter from "react-router-dom";
import NguIcon from "./@icons/ngu";
import { GlobalState } from "./@libs/components/core/GlobalState";
import { Page03 } from './page03';
import { Page04 } from './page04';






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






export const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		background: {
			//paper: "#1a200e",
			//paper: "#222b13",
			paper: "#2b3618",
		},
	},
});






function AppDesktop()
{

	let [globalState] = useState(() => ({}));


	let location = ReactRouter.useLocation();
	let navigate = ReactRouter.useNavigate();


	let router = Route.Router.useNew({

		routes: [
			Page03.route,
			Page04.route,
			Page04.route1,
			Page04.route2,
		],

		activeKey: location.pathname.substring(1) || Page03.route.key,

		onActivating: (route) => { navigate("/" + route.key) },

	});



	return (

		<GlobalState.Root rootState={globalState} compress>

			<Route.Router.Provider router={router}>

				<AppThemes darkTheme={darkTheme}>


					<DesktopLayout>


						<Route.SelectorModal />


						<DesktopLayout.Sider logo={<BigLogo />}>

							<HR />

							<List>
								<MainMenuItem route={Page03.route} />
								<MainMenuItem route={Page04.route} />
								<MainMenuItem route={Page04.route1} />
								<MainMenuItem route={Page04.route2} />
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

							</DesktopLayout.Header>


							<DesktopLayout.Main>

								<Route.Slider router={router} fill vertical offset={64}>

									<DesktopLayout.Content>
										<Route.Content />
									</DesktopLayout.Content>

								</Route.Slider>

							</DesktopLayout.Main>


						</DesktopLayout.Container>


					</DesktopLayout>

				</AppThemes>

			</Route.Router.Provider>

		</GlobalState.Root>

	);


}




function BigLogo()
{

	return <Div mt24 mb16 flex1 vflex textCenter>
		<Div>
			<NguIcon sx={{
				fontSize: 128,
				width: `128px !important`,
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

				{icon ? <ListItemIcon children={icon} /> : null}

				<ListItemText
					primary={<Txt.Button>{title}</Txt.Button>}
					secondary={description}
				/>

			</ListItemButton>

		</ListItem>

	);

}