import { Div, Focuser, Route } from "@libs";






//===






const pageRoute = Route.create({
	key: "/page04",
	title: "Page 04",
	content: () => <Page04 />,
});






export function Page04()
{

	return (

		<Focuser root ghost click="unfocus">

			<Div fill overflowAutoX scrollY bg1>

				<Focuser cursor ghost>

					<Div mx200 m100>

						<h1>PAGE 04</h1>

					</Div>

				</Focuser>

			</Div>

		</Focuser>

	);

}




export module Page04
{
	export const route = pageRoute;
}