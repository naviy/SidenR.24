import React, { createContext, useContext, useRef } from "react";
import { type ContainerBaseProps } from "./ContainerProps";
import type { PaneBorder } from "./PaneBorder";
import type { PaneRadius } from "./PaneRadius";






//===






export interface ContainerInfo 
{

	layout?: "row" | "col";

	debug?: boolean;

	start?: boolean; // must have
	end?: boolean;   // must have
	rounded?: boolean;


	/** border */
	b?: PaneBorder;

	bt: PaneBorder;
	br: PaneBorder;
	bb: PaneBorder;
	bl: PaneBorder;


	/** border radius */
	r?: PaneRadius;

	rtl: PaneRadius;
	rtr: PaneRadius;
	rbl: PaneRadius;
	rbr: PaneRadius;

}






export module ContainerInfo
{


	//---




	export var propNames: PropNames<ContainerInfo> =
	{

		layout: true,
		debug: true,

		start: true,
		end: true,
		rounded: true,

		b: true,

		bt: true,
		br: true,
		bb: true,
		bl: true,

		r: true,

		rtl: true,
		rtr: true,
		rbr: true,
		rbl: true,

	};


	export var Context = createContext<ContainerInfo | null>(null);


	export function use(): ContainerInfo | null
	{
		return useContext(Context);
	}




	//---




	export function useChangedOrCurrent(newValue: ContainerInfo, id?: React.Key): ContainerInfo
	{

		var valueRef = useRef<ContainerInfo | null>();

		if (valueRef.current == null)
		{
			valueRef.current = newValue;
			return newValue;
		}


		if (!valueRef.current || !Object.shallowEqual(valueRef.current, newValue))
		{
			valueRef.current = newValue;
		}


		return valueRef.current!;

	}




	export function init(
		props: Partial<ContainerBaseProps>,
		parentInfo: ContainerInfo | null,
		v: Partial<ContainerInfo>,
	): ContainerInfo
	{
		//_$log("props", props)


		v.debug = !!(props.debug ?? parentInfo?.debug);


		let { start, end, } = props;
		let inRow = parentInfo?.layout === "row";
		let inCol = !parentInfo || parentInfo.layout === "col";

		v.start = start;
		v.end = end;


		if (!parentInfo)
		{
			v.b = props.b || "" as PaneBorder;
			v.bt = v.br = v.bb = v.bl = props.b || "";

			v.r = props.r || 0 as PaneRadius;
			v.rtl = v.rtr = v.rbr = v.rbl = props.r || 0;
		}
		else
		{

			let b = v.b = (props.b ?? parentInfo.b) || "" as PaneBorder;

			v.bl = props.bl ?? (inRow && start || inCol ? parentInfo.bl : b);
			v.br = props.br ?? (inRow && end || inCol ? parentInfo.br : inRow && !end ? "" : b);
			v.bt = props.bt ?? (inRow || inCol && start ? parentInfo.bt : b);
			v.bb = props.bb ?? (inRow || inCol && end ? parentInfo.bb : inCol && !end ? "" : b);


			let r = v.r = (props.r ?? parentInfo.r) || 0 as PaneRadius;

			v.rtl = props.rtl ?? props.rt ?? (inRow && start || inCol && start ? parentInfo.rtl : r);
			v.rtr = props.rtr ?? props.rt ?? (inRow && end || inCol && start ? parentInfo.rtr : r);
			v.rbr = props.rbr ?? props.rb ?? (inRow && end || inCol && end ? parentInfo.rbr : r);
			v.rbl = props.rbl ?? props.rb ?? (inRow && start || inCol && end ? parentInfo.rbl : r);

		}


		return v as ContainerInfo;

	}




	//---


}