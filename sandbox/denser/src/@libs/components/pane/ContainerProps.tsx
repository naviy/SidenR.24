import { ReactNode } from "react";
import { PrimitiveProps, UseHookProps } from "../core";
import { mui3 } from "../core/mui3";
import { ExpanderBaseProps } from "../expanders";
import { Block } from "./Block";






//===






export interface ContainerProps<P extends ContainerProps = any> extends Block.Props, ExpanderBaseProps, UseHookProps<P>
{

	//props?: (info: ContainerInfo) => Partial<P> | null | undefined;

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

	pp0?: number;
	ppx0?: number;
	ppy0?: number;
	ppl0?: number;
	ppr0?: number;
	ppt0?: number;
	ppb0?: number;

	children?: ReactNode;

}




export module ContainerProps
{


	export const propNames: Array<keyof (ContainerProps & PrimitiveProps)> = [
		"debug",
		"rounded",
		"e",
		"noPP",
		"pp", "ppx", "ppy", "ppl", "ppr", "ppt", "ppb",
		"pp0", "ppx0", "ppy0", "ppl0", "ppr0", "ppt0", "ppb0",
		"wrapperCls",

		...Block.propNames,
		...ExpanderBaseProps.propNames,
		...UseHookProps.propNames,
	];


}
