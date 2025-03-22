import { Div, Focuser } from "@libs";
import type { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";






//===






export function DesktopContent(props: {

	children?: ReactNode;

})
{

	return (

		<Div fill scrollY>

			<ErrorBoundary>

				<Focuser.Ghost cursor click="unfocus">

					<Div relative>

						{props.children}

						<div style={{ height: "80vh" }} />

					</Div>

				</Focuser.Ghost>

			</ErrorBoundary>

		</Div>

	);

}






export module DesktopContent
{

}