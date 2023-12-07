import { blueGrey } from "@mui/material/colors";
import { Block } from "./Block";






//===





export type ContainerLayout = "row" | "col";




export interface ContainerProps/*<P extends ContainerProps = any>*/ extends Block.Props//, ExpanderBaseProps, UseHookProps<P>
{

	id?: string;
	debug?: boolean;

	layout?: ContainerLayout;

	b?: PaneBorder;
	r?: PaneRadius;

	wrapperCls?: string | null;

}




export module ContainerProps
{


	export var propNames_: Record<keyof ContainerProps, true> =
	{

		id: true,
		debug: true,
		layout: true,

		b: true,
		r: true,

		wrapperCls: true,

		...Block.propNames_,
		//...ExpanderBaseProps.propNames_,
		//...UseHookProps.propNames_,

	};



	export var propNames = Object.keys(propNames_) as (keyof ContainerProps)[];



}






//===






export type PaneBorder = "" | "0" | "1" | "2" | "3";



export module PaneBorder
{

	const css = {
		"1": `1px solid ${blueGrey[200]}`,
		"2": `2px solid ${blueGrey[400]}`,
		"3": `2px solid ${blueGrey[500]}`,
	}


	export function toCss(b: PaneBorder): string|undefined
	{
		return (css as any)[b] || undefined;
	}


}






//===






export type PaneRadius = "" | "0" | "1" | "2" | "3" | "4" | number;



export module PaneRadius
{

	const px = {
		"1": 3,
		"2": 6,
		"3": 12,
		"4": 24,
	}


	export function toPx(r: PaneRadius): number
	{
		return typeof r === "number" ? r : (px as any)[r] || 0;
	}

	export function toCss(rtl: PaneRadius, rtr: PaneRadius, rbr: PaneRadius, rbl: PaneRadius)
	{
		return `${toPx(rtl)}px ${toPx(rtr)}px ${toPx(rbr)}px ${toPx(rbl)}px`;
	}

}