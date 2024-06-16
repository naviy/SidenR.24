import type { MutableRefObject, RefObject } from "react";
import type { ExpanderBaseBehavior } from "../expanders";
import { Block } from "./Block";
import type { PaneBorder } from "./PaneBorder";
import type { PaneRadius } from "./PaneRadius";






//===






export type ContainerLayout = "row" | "col";




export interface ContainerBaseProps extends Block.Props
{

	//---


	id?: string;

	expanderRef?: RefObject<ExpanderBaseBehavior | null>;


	//---


	layout?: ContainerLayout;


	/** border */
	b?: PaneBorder;

	bt?: PaneBorder;
	br?: PaneBorder;
	bb?: PaneBorder;
	bl?: PaneBorder;


	/** border radius */
	r?: PaneRadius;

	rt?: PaneRadius;
	rb?: PaneRadius;
	rtl?: PaneRadius;
	rtr?: PaneRadius;
	rbl?: PaneRadius;
	rbr?: PaneRadius;

	bg?: string;


	//---


	debug?: boolean;
	ff?: boolean;

	wrapperCls?: string | null;
	addHeight?: number;


	//---

}




export module ContainerBaseProps
{

	export var propNames: PropNames<ContainerBaseProps> =
	{

		id: true,

		expanderRef: true,

		layout: true,

		b: true,

		bt: true,
		br: true,
		bb: true,
		bl: true,

		r: true,

		rt: true,
		rtl: true,
		rtr: true,
		rb: true,
		rbr: true,
		rbl: true,

		bg: true,

		debug: true,
		ff: true,
		wrapperCls: true,
		addHeight: true,

		...Block.propNames,

	};

}
