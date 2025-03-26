import { Div, Focuser } from "@libs";
import type { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";






//===






export function DesktopContent(props: {

	children?: ReactNode;

})
{

	let ff = Focuser.useGhost({
		name: "DesktopContent",
		cursor: true,
		click: "unfocus",
	});


	return (

		<Div fill scrollY>

			<ErrorBoundary>

				<Focuser.Area ff={ff}>

					<Div ref={ff.divRef} relative>

						{props.children}

						<div style={{ height: "80vh" }} />

					</Div>

				</Focuser.Area>

			</ErrorBoundary>

		</Div>

	);

}






export module DesktopContent
{

}