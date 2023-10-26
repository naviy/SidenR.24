import { DesktopLayout } from "@app";
import { Div, HR, Text, VR } from "@libs";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import type { ReactNode } from "react";
import type { RouteObject } from "react-router-dom";
import { Link, Outlet, useLocation, useNavigate, useRoutes } from "react-router-dom";
import NguIcon from "./@icons/ngu";
import { Page03 } from './page03';
import { Page04 } from './page04';
import ListItemIcon from "@mui/material/ListItemIcon";






//===






let routes: RouteObject[] = [
	{
		path: "/",
		element: <Layout />,
		children: [
			{ index: true, element: <Page03 /> },
			{ path: "/page03", element: <Page03 />, },
			{ path: "/page04", element: <Page04 />, },
			{ path: "*", element: <NoMatch /> },
		],
	},
];




export function App()
{

	let element = useRoutes(routes);


	return <>

		{element}

	</>;

}




function Layout()
{

	let location = useLocation();


	return (



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
					<Text.H3>location: {location.pathname}</Text.H3>
				</DesktopLayout.Header>

				<DesktopLayout.Main>
					<Outlet />
				</DesktopLayout.Main>

			</DesktopLayout.Container>

		</DesktopLayout>


	);
}




function BigLogo()
{
	return <Div mt24 mb16 flex1 vflex textCenter>
		<Div>
			<NguIcon sx={{ fontSize: 128, width: `128px !important` }} />
		</Div>
		<Div mt8 fontRoboto font300 upperCase>
			<span style={{ color: "gold" }}>Rota</span>
			<span style={{ color: "#00c3ff" }}>Office</span>
		</Div>
	</Div>;

}



function SmallLogo()
{
	return <Div ml8 vcenter >
		<NguIcon sx={{ fontSize: 48 }} />
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
			<p>
				<Link to="/">Go to the home page</Link>
			</p>
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

	let l = useLocation();
	let navigate = useNavigate();


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