import { DesktopLayout } from "@app";
import { $log, Div, HR, Route } from "@libs";
import { Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState, type ReactNode } from "react";
import * as ReactRouter from "react-router-dom";
import NguIcon from "./@icons/ngu";
import { GlobalState } from "./@libs/components/core/GlobalState";
import { Page03 } from './page03';
import { Page04 } from './page04';






//===






let routes: ReactRouter.RouteObject[] = [{
	path: "/",
	element: <AppDesktop />,
	children: [
		{ index: true, element: <Page03 /> },
		{ path: "/page03", element: <Page03 />, },
		{ path: "/page04", element: <Page04 />, },
		{ path: "*", element: <NoMatch /> },
	],
}];




export function App()
{

	let element = ReactRouter.useRoutes(routes);


	return <>

		{element}

	</>;

}




function AppDesktop()
{


	let [globalState] = useState(() => ({}));


	let location = ReactRouter.useLocation();
	let navigate = ReactRouter.useNavigate();


	let router = Route.Router.useBehavior({

		routes: [
		],

		activeKey: location.pathname,

		onActivating: (route) => navigate(route?.key || "/"),

	});



	return (

		<GlobalState.Root rootState={globalState} compress>

			<Route.Router.Provider router={router}>

				<DesktopLayout>

					<DesktopLayout.Sider logo={<BigLogo />}>

						<HR />

						<List>
							<MainMenuItem path="/" title="Home" divider />
							<MainMenuItem path="/page03" title="Page03" />
							<MainMenuItem path="/page04" title="Page04" />
						</List>
					</DesktopLayout.Sider>

					<DesktopLayout.Container>

						<DesktopLayout.Header logo={<SmallLogo />}>
							<div>location: {location.pathname}</div>
							<Button onClick={() => $log("globalState:", globalState)}>LOG globalState</Button>
						</DesktopLayout.Header>

						<DesktopLayout.Main>
							{/*<Route.Children route={router.activeRoute} />*/}
							<ReactRouter.Outlet />
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




function NoMatch()
{
	return (
		<div>
			<h2>It looks like you're lost...</h2>
		</div>
	);
}



function MainMenuItem(props: {
	path: string;
	icon?: ReactNode;
	title?: ReactNode;
	description?: ReactNode;
	extra?: ReactNode;
	divider?: boolean;
})
{

	let l = ReactRouter.useLocation();
	let navigate = ReactRouter.useNavigate();


	function onClick()
	{
		navigate(props.path);
	}


	return (

		<ListItem disablePadding divider={props.divider}>

			<ListItemButton onClick={onClick} selected={props.path === l.pathname}>

				{props.icon ? <ListItemIcon children={props.icon} /> : null}

				<ListItemText
					primary={props.title || props.path}
					secondary={props.description}
				/>

			</ListItemButton>


			{props.extra}


		</ListItem>

	);

}