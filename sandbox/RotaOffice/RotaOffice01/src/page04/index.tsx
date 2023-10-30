import { Div, Focuser, Route } from "@libs";






//===






const pageRoute = Route.create({
	key: "/page04",
	title: "Page 04",
	content: () => <Page04 />,
});
const page1Route = Route.create({
	key: "/page04.1",
	title: "Page 04.1",
	content: () => <Page04 />,
});
const page2Route = Route.create({
	key: "/page04.2",
	title: "Page 04.2",
	content: () => <Page04 />,
});






export function Page04()
{

	let route = Route.use();

	return (

		<Div mx200 m100>

			<h1>PAGE 04</h1>

			<h2>{route?.key}</h2>

		</Div>

	);

}




export module Page04
{
	export const route = pageRoute;
	export const route1 = page1Route;
	export const route2 = page2Route;
}