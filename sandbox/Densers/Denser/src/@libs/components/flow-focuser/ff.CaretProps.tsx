import type { ReactNode } from "react";
import type { Focuser } from "./ff.Focuser";
import type { MuiColor, UseHookProps } from "../core";






export interface CaretProps extends UseHookProps<CaretProps>
{

	color?: MuiColor;
	borderRadius?: Focuser.BorderRadius;
	borderWidth?: Focuser.BorderWidth;

	children?: ReactNode;

}
