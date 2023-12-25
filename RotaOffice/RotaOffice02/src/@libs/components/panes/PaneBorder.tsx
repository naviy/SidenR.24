import { blueGrey } from "@mui/material/colors";






//===






export type PaneBorder = (
	"" |
	"xs" | "sm" | "md" | "lg" | "xl" |
	"1-100" | "1-200" | "1-300" | "1-400" | "1-500" | "1-600" |
	"2-100" | "2-200" | "2-300" | "2-400" | "2-500" | "2-600"
);




export module PaneBorder
{


	export var styles: Record<
		Exclude<PaneBorder, "">,
		{
			width: number;
			color: string;
			borderCss?: string;
		}> =
	{
		"xs": { width: 1, color: blueGrey[50] },
		"sm": { width: 1, color: blueGrey[100] },
		//"sm": { width: 1, color: "red" },
		"md": { width: 2, color: blueGrey[100] },
		"lg": { width: 2, color: blueGrey[300] },
		//"lg": { width: 2, color: "red" },
		"xl": { width: 2, color: blueGrey[700] },

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



	export function borderCss(b: PaneBorder): string | undefined
	{
		let style = (styles as any)[b] || undefined;

		if (!style)
			return undefined;

		if (!style.borderCss)
		{
			return style.borderCss = `${style.width}px solid ${style.color}`;
		}


		return style.borderCss;
	}



	export function shadowCss(bt: PaneBorder, br: PaneBorder, bb: PaneBorder, bl: PaneBorder): string | undefined
	{
		return [
			sideCss(bt, 0, 1),
			sideCss(br, -1, 0),
			sideCss(bb, 0, -1),
			sideCss(bl, 1, 0),
		].filter(a => a).join(",");



		function sideCss(b: PaneBorder, x: number, y: number): string | undefined
		{
			let style = (styles as any)[b] || undefined;

			if (!style)
				return undefined;


			let { width } = style;
			return style.shadowCss = `inset ${x * width}px ${y * width}px ${style.color}`;

		}




	}


}
