import { blueGrey } from "@mui/material/colors";
import { Block } from "./Block";






//===





export type ContainerLayout = "row" | "col";




export interface ContainerBaseProps extends Block.Props
{

	id?: string;
	debug?: boolean;

	layout?: ContainerLayout;

	b?: PaneBorder;
	r?: PaneRadius;

	wrapperCls?: string | null;

}




export module ContainerBaseProps
{

	export const propNames: PropNames<ContainerBaseProps> =
	{

		id: true,
		debug: true,
		layout: true,

		b: true,
		r: true,

		wrapperCls: true,

		...Block.propNames,

	};

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


	export function toCss(b: PaneBorder): string | undefined
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


	export function toPx(r: PaneRadius, add?: number | null): number
	{
		let rr = typeof r === "number" ? r : (px as any)[r] || 0;
		return rr + (add || 0);
	}

	export function toCss(rtl: PaneRadius, rtr: PaneRadius, rbr: PaneRadius, rbl: PaneRadius, add?: number | null)
	{
		return `${toPx(rtl, add)}px ${toPx(rtr, add)}px ${toPx(rbr, add)}px ${toPx(rbl, add)}px`;
	}

}