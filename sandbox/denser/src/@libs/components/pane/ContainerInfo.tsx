import { createContext, useContext, useRef } from "react";
import { Block } from "./Block";
import { ContainerProps } from "./ContainerProps";






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
	ppl0?: number;
	ppr0?: number;
	ppt0?: number;
	ppb0?: number;

	gap?: number;

	preExpanding?: boolean;

}






export module ContainerInfo
{

	//---



	export const propNames: Array<keyof ContainerInfo> = [
		"type",
		"debug",
		//"ml", "mr", "mt", "mb",
		"pl", "pr", "pt", "pb",
		"noPP",
		"ppl", "ppr", "ppt", "ppb",
		"ppl0", "ppr0", "ppt0", "ppb0",
		"gap",
		"preExpanding",
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



	export function init(
		props: Partial<ContainerProps>,
		parentInfo: ContainerInfo,
		v: ContainerInfo,
	): ContainerInfo
	{
		//_$log("props", props)



		v.debug = !!(props.debug ?? parentInfo.debug);


		//if (props.id)
		//{
		//	$log("ContainerInfo", props.id, ".build")
		//	//_$log("expanded", v.expanded)
		//}


		v.pl = v.pl || 0;
		v.pr = v.pr || 0;
		v.pt = v.pt || 0;
		v.pb = v.pb || 0;


		return v;

	}



	export function build(
		props: Partial<ContainerProps>,
		parentInfo: ContainerInfo,
		v: ContainerInfo,
	): ContainerInfo
	{

		let { rounded, start, end, } = props;
		let inRow = parentInfo.type === "row";
		let inCol = parentInfo.type === "col";

		v.noPP = v.noPP || !!props.noPP || !!parentInfo.noPP;

		let { pp, ppx, ppy } = props;
		v.ppl = (inCol || start ? parentInfo.ppl || 0 : 0) + (props.ppl ?? ppx ?? pp ?? 0);
		v.ppr = (inCol || end ? parentInfo.ppr || 0 : 0) + (props.ppr ?? ppx ?? pp ?? 0);
		v.ppt = (inRow || start ? parentInfo.ppt || 0 : 0) + (props.ppt ?? ppy ?? pp ?? 0);
		v.ppb = (inRow || end ? parentInfo.ppb || 0 : 0) + (props.ppb ?? ppy ?? pp ?? 0);

		let { pp0, ppx0, ppy0 } = props;
		v.ppl0 = (inCol || start ? parentInfo.ppl0 || 0 : 0) + (props.ppl0 ?? ppx0 ?? pp0 ?? 0);
		v.ppr0 = (inCol || end ? parentInfo.ppr0 || 0 : 0) + (props.ppr0 ?? ppx0 ?? pp0 ?? 0);
		v.ppt0 = (inRow || start ? parentInfo.ppt0 || 0 : 0) + (props.ppt0 ?? ppy0 ?? pp0 ?? 0);
		v.ppb0 = (inRow || end ? parentInfo.ppb0 || 0 : 0) + (props.ppb0 ?? ppy0 ?? pp0 ?? 0);

		v.brtl = !!(rounded || parentInfo.brtl && (inRow && start || inCol && start));
		v.brtr = !!(rounded || parentInfo.brtr && (inRow && end || inCol && start));
		v.brbr = !!(rounded || parentInfo.brbr && (inRow && end || inCol && end));
		v.brbl = !!(rounded || parentInfo.brbl && (inRow && start || inCol && end));

		let br2 = Block.bigBorderRadius;
		let br0 = Block.smallBorderRadius;

		v.cssBorderRadius = [
			v.brtl ? `${br2 + v.pl!}px` : !parentInfo.gap && (inRow && !start || inCol && !start) ? "0" : `${br0 + v.pl!}px`,
			v.brtr ? `${br2 + v.pr!}px` : !parentInfo.gap && (inRow && !end || inCol && !start) ? "0" : `${br0 + v.pr!}px`,
			v.brbr ? `${br2 + v.pl!}px` : !parentInfo.gap && (inRow && !end || inCol && !end) ? "0" : `${br0 + v.pl!}px`,
			v.brbl ? `${br2 + v.pr!}px` : !parentInfo.gap && (inRow && !start || inCol && !end) ? "0" : `${br0 + v.pr!}px`,
		].join(" ");


		return v;

	}



	//---

}