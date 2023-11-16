import type { ReactNode } from "react";
import { PrimitiveProps, UseHookProps } from "../core";
import { ExpanderBaseProps } from "../expanders";
import { Block } from "./Block";






//===





export type ContainerLayout = "row" | "col";





export interface ContainerProps<P extends ContainerProps = any> extends Block.Props, ExpanderBaseProps, UseHookProps<P>
{

	//props?: (info: ContainerInfo) => Partial<P> | null | undefined;

	id?: string;
	debug?: boolean;

	layout?: ContainerLayout;

	rounded?: boolean;

	wrapperCls?: string | null;

	noPP?: boolean;
	ppStart?: boolean;

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

	//pg?: number;
	//png?: number;

	children?: ReactNode;

}




export module ContainerProps
{


	export const propNames: Array<keyof (ContainerProps & PrimitiveProps)> = [

		"debug",
		"layout",
		"rounded",
		"noPP", "ppStart",
		"pp", "ppx", "ppy", "ppl", "ppr", "ppt", "ppb",
		"pp0", "ppx0", "ppy0", "ppl0", "ppr0", "ppt0", "ppb0",
		"wrapperCls",

		...Block.propNames,
		...ExpanderBaseProps.propNames,
		...UseHookProps.propNames,

	];


}
