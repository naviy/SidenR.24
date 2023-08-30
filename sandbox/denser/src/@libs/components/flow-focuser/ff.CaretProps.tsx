import { ReactNode } from "react";
import { Focuser } from ".";
import { MuiColor, UseHookProps } from "../core";






export interface CaretProps extends UseHookProps<CaretProps>
{

	color?: MuiColor;
	borderRadius?: Focuser.BorderRadius;
	borderWidth?: Focuser.BorderWidth;

	children?: ReactNode;

}
