import { createContext, useContext, useRef } from "react";
import { Block } from "./Block";
import { ContainerProps } from "./ContainerProps";
import { $log, _$log } from "../core";
import { ExpanderBaseBehavior } from "../expanders";






//===






export interface ContainerInfo 
{
	type?: "row" | "col";

	debug?: boolean;

	rounded?: boolean;

	brtl?: boolean;
	brtr?: boolean;
	brbl?: boolean;
	brbr?: boolean;
	cssBorderRadius?: string;

	//ml?: number;
	//mr?: number;
	//mt?: number;
	//mb?: number;

	pl?: number;
	pr?: number;
	pt?: number;
	pb?: number;

	noPP?: boolean;
	ppl?: number;
	ppr?: number;
	ppt?: number;
	ppb?: number;

	gap?: number;

}






export module ContainerInfo
{

	//---



	export const propNames: Array<keyof ContainerInfo> = [
		"type",
		"debug",
		//"ml", "mr", "mt", "mb",
		"pl", "pr", "pt", "pb",
		"noPP", "ppl", "ppr", "ppt", "ppb",
		"gap",
	];


	export const Context = createContext<ContainerInfo | null>(null);


	export function use(): ContainerInfo | null
	{
		return useContext(Context);
	}



	//---



	export function useValue(newValue: ContainerInfo): ContainerInfo
	{

		let valueRef = useRef<ContainerInfo | null>();

		if (valueRef.current == null)
		{
			valueRef.current = {};
		}


		let v0 = valueRef.current!;


		for (let prop of propNames)
		{
			if (newValue[prop] !== v0[prop])
			{
				valueRef.current = newValue;
				break;
			}
		}


		return valueRef.current!;

	}



	export function build(
		props: Partial<ContainerProps>,
		parentInfo: ContainerInfo,
		v: ContainerInfo,
	): ContainerInfo
	{
		//_$log("props", props)


		let { rounded, start, end, debug } = props;
		let inRow = parentInfo.type === "row";
		let inCol = parentInfo.type === "col";

		v.debug = !!(debug ?? parentInfo.debug);


		if (props.id)
		{
			$log("ContainerInfo", props.id, ".build")
			//_$log("expanded", v.expanded)
		}


		v.pl = v.pl || 0;
		v.pr = v.pr || 0;
		v.pt = v.pt || 0;
		v.pb = v.pb || 0;

		let { pp, ppx, ppy } = props;

		v.noPP = v.noPP || !!props.noPP || !!parentInfo.noPP;
		v.ppl = (inCol || start ? parentInfo.ppl || 0 : 0) + (props.ppl ?? ppx ?? pp ?? 0);
		v.ppr = (inCol || end ? parentInfo.ppr || 0 : 0) + (props.ppr ?? ppx ?? pp ?? 0);
		v.ppt = (inRow || start ? parentInfo.ppt || 0 : 0) + (props.ppt ?? ppy ?? pp ?? 0);
		v.ppb = (inRow || end ? parentInfo.ppb || 0 : 0) + (props.ppb ?? ppy ?? pp ?? 0);

		v.brtl = !!(rounded || parentInfo.brtl && (inRow && start || inCol && start));
		v.brtr = !!(rounded || parentInfo.brtr && (inRow && end || inCol && start));
		v.brbr = !!(rounded || parentInfo.brbr && (inRow && end || inCol && end));
		v.brbl = !!(rounded || parentInfo.brbl && (inRow && start || inCol && end));

		let br2 = Block.bigBorderRadius;
		let br0 = Block.smallBorderRadius;

		v.cssBorderRadius = [
			v.brtl ? `${br2 + v.pl}px` : !parentInfo.gap && (inRow && !start || inCol && !start) ? "0" : `${br0 + v.pl}px`,
			v.brtr ? `${br2 + v.pr}px` : !parentInfo.gap && (inRow && !end || inCol && !start) ? "0" : `${br0 + v.pr}px`,
			v.brbr ? `${br2 + v.pl}px` : !parentInfo.gap && (inRow && !end || inCol && !end) ? "0" : `${br0 + v.pl}px`,
			v.brbl ? `${br2 + v.pr}px` : !parentInfo.gap && (inRow && !start || inCol && !end) ? "0" : `${br0 + v.pr}px`,
		].join(" ");


		return v;

	}



	//---

}