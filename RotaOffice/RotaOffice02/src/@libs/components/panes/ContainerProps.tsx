import { Block } from "./Block";
import type { PaneBorder } from "./PaneBorder";
import type { PaneRadius } from "./PaneRadius";






//===






export type ContainerLayout = "row" | "col";




export interface ContainerBaseProps extends Block.Props
{

	//---


	id?: string;


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


	//---


	debug?: boolean;
	ff?: boolean;

	wrapperCls?: string | null;


	//---

}




export module ContainerBaseProps
{

	export var propNames: PropNames<ContainerBaseProps> =
	{

		id: true,

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

		debug: true,
		ff: true,
		wrapperCls: true,

		...Block.propNames,

	};

}
