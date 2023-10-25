import { Div } from "@libs";
import { type ReactNode } from "react";




export function DesktopContainer(props: { children?: ReactNode; })
{

	return <Div
		id="desktop-container"
		flex1
		vflex
		relative
		children={props.children}
	/>;

}
