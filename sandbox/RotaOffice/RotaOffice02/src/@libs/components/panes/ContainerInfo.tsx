import React, { createContext, useContext, useRef } from "react";
import { PaneRadius, type ContainerBaseProps, type PaneBorder } from "./ContainerProps";
import { $log, _$log } from "../core/utils";






//===






export interface ContainerInfo 
{

	layout?: "row" | "col";

	debug?: boolean;

	start?: boolean; // must have
	end?: boolean;   // must have
	rounded?: boolean;


	// Border

	b?: PaneBorder;

	bt: PaneBorder;
	br: PaneBorder;
	bb: PaneBorder;
	bl: PaneBorder;


	// [Border] Radius

	r?: PaneRadius;

	rtl: PaneRadius;
	rtr: PaneRadius;
	rbl: PaneRadius;
	rbr: PaneRadius;

}






export module ContainerInfo
{


	//---




	export const propNames: PropNames<ContainerInfo> =
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


	export const Context = createContext<ContainerInfo | null>(null);


	export function use(): ContainerInfo | null
	{
		return useContext(Context);
	}




	//---




	export function useValue(newValue: ContainerInfo, id?: React.Key): ContainerInfo
	{

		let valueRef = useRef<ContainerInfo | null>();

		if (valueRef.current == null)
		{
			valueRef.current = newValue;
			return newValue;
		}


		let v0 = valueRef.current!;


		for (let prop of Object.keys(propNames))
		{
			if ((newValue as any)[prop] !== (v0 as any)[prop])
			{
				//__$log("ContainerInfo: create", id)
				//___$log("prop:", prop, v0[prop], '=>', newValue[prop]);
				//__$log("old value: ", v0);
				//__$log("new value: ", newValue);

				valueRef.current = newValue;
				break;
			}
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

			v.bl = inRow && start || inCol ? parentInfo.bl : b;
			v.br = inRow && end || inCol ? parentInfo.br : inRow && !end ? "" : b;
			v.bt = inRow || inCol && start ? parentInfo.bt : b;
			v.bb = inRow || inCol && end ? parentInfo.bb : inCol && !end ? "" : b;


			let r = v.r = (props.r ?? parentInfo.r) || 0 as PaneRadius;

			v.rtl = inRow && start || inCol && start ? parentInfo.rtl : r;
			v.rtr = inRow && end || inCol && start ? parentInfo.rtr : r;
			v.rbr = inRow && end || inCol && end ? parentInfo.rbr : r;
			v.rbl = inRow && start || inCol && end ? parentInfo.rbl : r;

		}


		return v as ContainerInfo;

	}




	//---


}