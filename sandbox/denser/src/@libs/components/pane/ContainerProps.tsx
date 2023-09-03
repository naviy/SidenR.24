import { ReactNode } from "react";
import { PrimitiveProps, UseHookProps } from "../core";
import { mui3 } from "../core/mui3";
import { ExpanderBaseProps } from "../expanders";
import { Block } from "./Block";






//===






export interface ContainerProps<P extends ContainerProps = any> extends Block.Props, ExpanderBaseProps, UseHookProps<P>
{

	//props?: (bhv: ContainerBehavior) => Partial<P>;

	id?: string;
	debug?: boolean;

	rounded?: boolean;

	e?: mui3.BoxShadow;

	wrapperCls?: string | null;

	noPP?: boolean;

	pp?: number;

	ppx?: number;
	ppy?: number;

	ppl?: number;
	ppr?: number;
	ppt?: number;
	ppb?: number;

	children?: ReactNode;

}




export module ContainerProps
{


	export const propNames: Array<keyof (ContainerProps & PrimitiveProps)> = [
		"debug",
		"rounded",
		"e",
		"noPP", "ppl", "ppr", "ppt", "ppb",
		"wrapperCls",

		...Block.propNames,
		...ExpanderBaseProps.propNames,
		...UseHookProps.propNames,
	];


}
