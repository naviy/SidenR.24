import React, { createContext, useContext, useRef } from "react";
import { PaneRadius, type ContainerProps, type PaneBorder } from "./ContainerProps";
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

	bOff?: PaneBorder;
	bOn?: PaneBorder;

	bt?: boolean;
	br?: boolean;
	bb?: boolean;
	bl?: boolean;


	// Border

	rI?: PaneRadius;
	rO?: PaneRadius;

	rtl?: boolean;
	rtr?: boolean;
	rbl?: boolean;
	rbr?: boolean;
	rCss?: string;

}






export module ContainerInfo
{

	//---



	export const propNames: Record<keyof ContainerInfo, true> =
	{

		layout: true,
		debug: true,

		start: true,
		end: true,
		rounded: true,

		bOn: true,
		bOff: true,

		bt: true,
		br: true,
		bb: true,
		bl: true,

		rO: true,
		rI: true,

		rtl: true,
		rtr: true,
		rbr: true,
		rbl: true,

		rCss: true,

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
		props: Partial<ContainerProps>,
		parentInfo: ContainerInfo|null,
		v: ContainerInfo,
	): ContainerInfo
	{
		//_$log("props", props)


		v.debug = !!(props.debug ?? parentInfo?.debug);

		v.bOn = (props.borderOn ?? parentInfo?.bOn) || 0;
		v.bOff = (props.borderOff ?? parentInfo?.bOff) || 0;
		v.rO = (parentInfo?.rI) || 0;
		v.rI = (props.radius ?? parentInfo?.rI) || 0;


		let { start, end, } = props;
		let inRow = parentInfo?.layout === "row";
		let inCol = !parentInfo || parentInfo.layout === "col";

		v.start = start;
		v.end = end;


		$log("id:", props.id);
		_$log("v:", v);
		_$log("inRow:", inRow);
		_$log("inCol:", inCol);

		v.rtl = parentInfo?.rtl !== false && (inRow && start || inCol && start);
		v.rtr = parentInfo?.rtr !== false && (inRow && end || inCol && start);
		v.rbr = parentInfo?.rbr !== false && (inRow && end || inCol && end);
		v.rbl = parentInfo?.rbl !== false && (inRow && start || inCol && end);
		_$log("v:", v);

		v.rCss = PaneRadius.toCss(v.rI!, v.rO!, v.rtl, v.rtr, v.rbr, v.rbl);
		_$log("rCss:", v.rCss);


		return v;

	}



	//---

}