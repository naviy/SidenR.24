import { ReactNode } from "react";
import { PrimitiveProps, UseHookProps } from "../core";
import { mui3 } from "../core/mui3";
import { ExpanderBaseProps } from "../expanders";
import { Block } from "./Block";






//===






export interface ContainerProps extends Block.Props, ExpanderBaseProps, UseHookProps<ContainerProps>
{

	rounded?: boolean;

	e?: mui3.BoxShadow;

	wrapperCls?: string | null;

	children?: ReactNode;

}




export module ContainerProps
{


	export const propNames: Array<keyof (ContainerProps & PrimitiveProps)> = [
		"rounded",
		"e",
		"wrapperCls",
		...Block.propNames,
		...ExpanderBaseProps.propNames,
		...UseHookProps.propNames,
	];


}
