import { blueGrey } from "@mui/material/colors";
import { Block } from "./Block";






//===






export type ContainerLayout = "row" | "col";




export interface ContainerBaseProps extends Block.Props
{

	id?: string;
	debug?: boolean;

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
	rtl?: PaneRadius;
	rtr?: PaneRadius;
	rb?: PaneRadius;
	rbl?: PaneRadius;
	rbr?: PaneRadius;

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

		wrapperCls: true,

		...Block.propNames,

	};

}






//===






export type PaneBorder = (
	"" |
	"xs" | "sm" | "md" | "lg" | "xl" |
	"1-100" | "1-200" | "1-300" | "1-400" | "1-500" | "1-600" |
	"2-100" | "2-200" | "2-300" | "2-400" | "2-500" | "2-600"
);




export module PaneBorder
{


	export const styles: Record<Exclude<PaneBorder, "">, { width: number, color: string, css?: string }> =
	{
		"xs": { width: 1, color: blueGrey[100] },
		"sm": { width: 1, color: blueGrey[200] },
		"md": { width: 1, color: blueGrey[400] },
		"lg": { width: 2, color: blueGrey[400] },
		"xl": { width: 2, color: blueGrey[500] },

		"1-100": { width: 1, color: blueGrey[100] },
		"1-200": { width: 1, color: blueGrey[200] },
		"1-300": { width: 1, color: blueGrey[300] },
		"1-400": { width: 1, color: blueGrey[400] },
		"1-500": { width: 1, color: blueGrey[500] },
		"1-600": { width: 1, color: blueGrey[600] },

		"2-100": { width: 2, color: blueGrey[100] },
		"2-200": { width: 2, color: blueGrey[200] },
		"2-300": { width: 2, color: blueGrey[300] },
		"2-400": { width: 2, color: blueGrey[400] },
		"2-500": { width: 2, color: blueGrey[500] },
		"2-600": { width: 2, color: blueGrey[600] },
	};



	export function width(b: PaneBorder): number | undefined
	{
		let style = (styles as any)[b] || undefined;

		if (!style)
			return undefined;

		return style.width;
	}



	export function css(b: PaneBorder): string | undefined
	{
		let style = (styles as any)[b] || undefined;

		if (!style)
			return undefined;

		if (!style.css)
		{
			return style.css = `${style.width}px solid ${style.color}`;
		}


		return style.css;
	}


}






//===






export type PaneRadius = "" | "xs" | "sm" | "md" | "lg" | "xl" | number;




export module PaneRadius
{


	const px: Partial<Record<PaneRadius, number>> = {
		"xs": 3,
		"sm": 6,
		"md": 9,
		"lg": 12,
		"xl": 24,
	}


	export function toPx(r: PaneRadius, add?: number | null): number
	{
		let rr = typeof r === "number" ? r : (px as any)[r] || 0;
		return rr + (add || 0);
	}


	export function css(rtl: PaneRadius, rtr: PaneRadius, rbr: PaneRadius, rbl: PaneRadius, add?: number | null)
	{
		return `${toPx(rtl, add)}px ${toPx(rtr, add)}px ${toPx(rbr, add)}px ${toPx(rbl, add)}px`;
	}


}