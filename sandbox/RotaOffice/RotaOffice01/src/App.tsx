import { DesktopLayout } from "@app";
import { Div, Text } from "@libs";
import type { RouteObject } from "react-router-dom";
import { Link, Outlet, useLocation, useRoutes } from "react-router-dom";
import { Page03 } from './page03';
import { Page04 } from './page04';






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

			<DesktopLayout.Sider>

				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/page03">Page03</Link>
						</li>
						<li>
							<Link to="/page04">Page04</Link>
						</li>
					</ul>
				</nav>
			</DesktopLayout.Sider>

			<DesktopLayout.Container>

				<DesktopLayout.Header>
					<Text.H3>location: {location.pathname}</Text.H3>
				</DesktopLayout.Header>

				<DesktopLayout.Main>
					<Outlet />
				</DesktopLayout.Main>

			</DesktopLayout.Container>

		</DesktopLayout>


	);
}


function Layout0()
{

	let location = useLocation();


	return (
		<Div fill flex>

			<Div flex1>

				<p>location: {location.pathname}</p>

				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/page03">Page03</Link>
						</li>
						<li>
							<Link to="/page04">Page04</Link>
						</li>
					</ul>
				</nav>

			</Div>

			<Div flex10 relative>
				<Outlet />
			</Div>

		</Div>
	);
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