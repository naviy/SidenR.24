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






export type PaneBorder = "" | "xs" | "sm" | "md" | "lg";



export module PaneBorder
{


	export const styles: Partial<Record<PaneBorder, { width: number, color: string, css?: string }>> =
	{
		"xs": { width: 1, color: blueGrey[100] },
		"sm": { width: 1, color: blueGrey[200] },
		"md": { width: 2, color: blueGrey[400] },
		"lg": { width: 2, color: blueGrey[500] },
	} as const;



	export function width(b: PaneBorder): number | undefined
	{
		let style = (styles)[b] || undefined;

		if (!style)
			return undefined;

		return style.width;
	}



	export function css(b: PaneBorder): string | undefined
	{
		let style = (styles)[b] || undefined;

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






export type PaneRadius = "" | "xs" | "sm" | "md" | "lg" | number;



export module PaneRadius
{


	const px: Partial<Record<PaneRadius, number>> = {
		"xs": 3,
		"sm": 6,
		"md": 12,
		"lg": 24,
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