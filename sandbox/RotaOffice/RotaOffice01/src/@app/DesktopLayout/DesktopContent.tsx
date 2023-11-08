import { Div, Focuser, GlobalState } from "@libs";
import type { ReactNode } from "react";






//===






export function DesktopContent(props: {

	children?: ReactNode;

})
{

	return (

		<Div fill scrollY>

			<Focuser cursor ghost click="unfocus">

				<Div relative>

					{props.children}

					<div style={{ height: "80vh" }} />

				</Div>

			</Focuser>

		</Div>

	);

}


