import { createContext, useContext, useRef } from "react";
import { Block } from "./Block";
import { ContainerProps } from "./ContainerProps";






//===






export interface ContainerInfo 
{
	type?: "row" | "col";

	rounded?: boolean;

	brtl?: boolean;
	brtr?: boolean;
	brbl?: boolean;
	brbr?: boolean;
	cssBorderRadius?: string;

	ml?: number;
	mr?: number;
	mt?: number;
	mb?: number;

	pl?: number;
	pr?: number;
	pt?: number;
	pb?: number;

	p2l?: number;
	p2r?: number;
	p2t?: number;
	p2b?: number;

	gap?: number;

}






export module ContainerInfo
{

	//---



	export const propNames: Array<keyof ContainerInfo> = [
		"type",
		"rounded", "brtl", "brtr", "brbl", "brbr", "cssBorderRadius",
		"ml", "mr", "mt", "mb",
		"pl", "pr", "pt", "pb",
		"p2l", "p2r", "p2t", "p2b",
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

		let { rounded, start, end } = props;
		let inRow = parentInfo.type === "row";
		let inCol = parentInfo.type === "col";

		v.p2l = (inCol || start ? parentInfo.p2l || 0 : 0) + (v.ml && v.ml < 0 ? -v.ml - (v.pl || 0) : 0);
		v.p2r = (inCol || end ? parentInfo.p2r || 0 : 0) + (v.mr && v.mr < 0 ? -v.mr - (v.pr || 0) : 0);
		v.p2t = (inRow || start ? parentInfo.p2t || 0 : 0) + (v.mt && v.mt < 0 ? -v.mt - (v.pt || 0) : 0);
		v.p2b = (inRow || end ? parentInfo.p2b || 0 : 0) + (v.mb && v.mb < 0 ? -v.mb - (v.pb || 0) : 0);

		v.brtl = !!(rounded || parentInfo.brtl && (inRow && start || inCol && start));
		v.brtr = !!(rounded || parentInfo.brtr && (inRow && end || inCol && start));
		v.brbr = !!(rounded || parentInfo.brbr && (inRow && end || inCol && end));
		v.brbl = !!(rounded || parentInfo.brbl && (inRow && start || inCol && end));

		let br2 = Block.bigBorderRadius;
		let br0 = Block.smallBorderRadius;

		v.cssBorderRadius = [
			v.brtl ? `${br2 + (v.pl || 0)}px` : !parentInfo.gap && (inRow && !start || inCol && !start) ? "0" : `${br0 + (v.pl || 0)}px`,
			v.brtr ? `${br2 + (v.pr || 0)}px` : !parentInfo.gap && (inRow && !end || inCol && !start) ? "0" : `${br0 + (v.pr || 0)}px`,
			v.brbr ? `${br2 + (v.pl || 0)}px` : !parentInfo.gap && (inRow && !end || inCol && !end) ? "0" : `${br0 + (v.pl || 0)}px`,
			v.brbl ? `${br2 + (v.pr || 0)}px` : !parentInfo.gap && (inRow && !start || inCol && !end) ? "0" : `${br0 + (v.pr || 0)}px`,
		].join(" ");


		return v;

	}



	//---

}