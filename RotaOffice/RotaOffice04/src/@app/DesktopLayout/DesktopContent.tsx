import { $defaultAnimationDurationMs, Div, Focuser } from "@libs";
import React, { type ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";






//===






export function DesktopContent(props: {

	children?: ReactNode;

})
{

	let ff = Focuser.useGhost({
		name: "DesktopContent",
		scrollable: true,
		click: "unfocus",
	});


	React.useEffect(() =>
	{

		if (ff.canFocus())
			ff.focusLastItem()
		else
			window.setTimeout(() => ff.focusLastItem(), $defaultAnimationDurationMs + 50);
	}, []);



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