import { GlobalProps } from "@emotion/react";
import { GlobalStyles, styled } from "@mui/material";
import clsx from "clsx";
import * as React from "react";
import { forwardRef, ReactNode } from "react";
import { Values } from "./utils";
import { $defaultAnimationDurationMs } from "./__debug";




//===




var primitiveClsPrefix: string = "";




//===




export interface PrimitiveProps<T extends Element = Element>
	extends PrimitiveBaseProps<T>, PrimitiveClassesProps
{
}




export module PrimitiveProps
{



	const reGap = /gap(\d+)/;


	export function getGap(props: Pick<PrimitiveClassesProps, "gap" | "gapi">): "inherit" | number | undefined
	{

		let { gap, gapi } = props;

		if (gap !== undefined)
			return gap;

		if (gapi)
			return "inherit";


		for (let prop in props)
		{
			let m = reGap.exec(prop);
			if (m?.[1])
				return parseInt(m[1]);
		}


		return undefined;

	}



	//---



	const reMargin = /^m(\d+)$/;
	const reMarginX = /^mx(\d+)$/;
	const reMarginY = /^my(\d+)$/;
	const reMarginLeft = /^ml(\d+)$/;
	const reMarginRight = /^mr(\d+)$/;
	const reMarginTop = /^mt(\d+)$/;
	const reMarginBottom = /^mb(\d+)$/;


	export function getMargins(props: Pick<PrimitiveClassesProps, "m" | "mx" | "my" | "ml" | "mr" | "mt" | "mb">):
		{
			m: number | undefined;
			mx: number | undefined;
			my: number | undefined;
			ml: number | undefined;
			mr: number | undefined;
			mt: number | undefined;
			mb: number | undefined;
		}
	{

		let { m, mx, my, ml, mr, mt, mb }: {
			m: number | undefined;
			mx: number | undefined;
			my: number | undefined;
			ml: number | undefined;
			mr: number | undefined;
			mt: number | undefined;
			mb: number | undefined;
		} = props as any;


		for (let prop in props)
		{

			if (m === undefined)
			{
				let mm = reMargin.exec(prop);
				if (mm?.[1])
				{
					m = parseInt(mm[1]);
					break;
				}
			}

			if (mx === undefined)
			{
				let mm = reMarginX.exec(prop);
				if (mm?.[1])
				{
					mx = parseInt(mm[1]);
					break;
				}
			}

			if (my === undefined)
			{
				let mm = reMarginY.exec(prop);
				if (mm?.[1])
				{
					my = parseInt(mm[1]);
					break;
				}
			}

			if (ml === undefined)
			{
				let mm = reMarginLeft.exec(prop);
				if (mm?.[1])
				{
					ml = parseInt(mm[1]);
					break;
				}
			}

			if (mr === undefined)
			{
				let mm = reMarginRight.exec(prop);
				if (mm?.[1])
				{
					mr = parseInt(mm[1]);
					break;
				}
			}

			if (mt === undefined)
			{
				let mm = reMarginTop.exec(prop);
				if (mm?.[1])
				{
					mt = parseInt(mm[1]);
					break;
				}
			}

			if (mb === undefined)
			{
				let mm = reMarginBottom.exec(prop);
				if (mm?.[1])
				{
					mb = parseInt(mm[1]);
					break;
				}
			}

		}


		mx = mx !== undefined ? mx : m;
		my = my !== undefined ? my : m;
		ml = ml !== undefined ? ml : mx;
		mr = mr !== undefined ? mr : mx;
		mt = mt !== undefined ? mt : my;
		mb = mb !== undefined ? mb : my;


		return { m, mx, my, ml, mr, mt, mb };

	}



	//---



	const rePadding = /^p(\d+)$/;
	const rePaddingX = /^px(\d+)$/;
	const rePaddingY = /^py(\d+)$/;
	const rePaddingLeft = /^pl(\d+)$/;
	const rePaddingRight = /^pr(\d+)$/;
	const rePaddingTop = /^pt(\d+)$/;
	const rePaddingBottom = /^pb(\d+)$/;


	export function getPaddings(props: Pick<PrimitiveClassesProps, "p" | "px" | "py" | "pl" | "pr" | "pt" | "pb">):
		{
			p: number | undefined;
			px: number | undefined;
			py: number | undefined;
			pl: number | undefined;
			pr: number | undefined;
			pt: number | undefined;
			pb: number | undefined;
		}
	{

		let { p, px, py, pl, pr, pt, pb }: {
			p: number | undefined;
			px: number | undefined;
			py: number | undefined;
			pl: number | undefined;
			pr: number | undefined;
			pt: number | undefined;
			pb: number | undefined;
		} = props as any;


		for (let prop in props)
		{

			if (p === undefined)
			{
				let mm = rePadding.exec(prop);
				if (mm?.[1])
				{
					p = parseInt(mm[1]);
					break;
				}
			}

			if (px === undefined)
			{
				let mm = rePaddingX.exec(prop);
				if (mm?.[1])
				{
					px = parseInt(mm[1]);
					break;
				}
			}

			if (py === undefined)
			{
				let mm = rePaddingY.exec(prop);
				if (mm?.[1])
				{
					py = parseInt(mm[1]);
					break;
				}
			}

			if (pl === undefined)
			{
				let mm = rePaddingLeft.exec(prop);
				if (mm?.[1])
				{
					pl = parseInt(mm[1]);
					break;
				}
			}

			if (pr === undefined)
			{
				let mm = rePaddingRight.exec(prop);
				if (mm?.[1])
				{
					pr = parseInt(mm[1]);
					break;
				}
			}

			if (pt === undefined)
			{
				let mm = rePaddingTop.exec(prop);
				if (mm?.[1])
				{
					pt = parseInt(mm[1]);
					break;
				}
			}

			if (pb === undefined)
			{
				let mm = rePaddingBottom.exec(prop);
				if (mm?.[1])
				{
					pb = parseInt(mm[1]);
					break;
				}
			}

		}


		px = px !== undefined ? px : p;
		py = py !== undefined ? py : p;
		pl = pl !== undefined ? pl : px;
		pr = pr !== undefined ? pr : px;
		pt = pt !== undefined ? pt : py;
		pb = pb !== undefined ? pb : py;


		return { p, px, py, pl, pr, pt, pb };

	}



	//---


}



//===




export interface PrimitiveBaseProps<T extends Element>
{

	id?: string | undefined;

	//sm?: IObjectSemantic | null;

	className?: string | undefined;

	hint?: string | undefined;

	onClick?: React.MouseEventHandler<T> | undefined;
	onTransitionEnd?: React.TransitionEventHandler<T> | undefined;


	style?: React.CSSProperties | undefined;

	children?: ReactNode;

	__html?: string | undefined;

}



const primitiveBasePropNames: Array<keyof PrimitiveBaseProps<Element>> = [
	"id", /*"sm",*/ "className", "hint", "onClick", "onTransitionEnd", "style", "children", "__html",
];






export type PrimitiveFontSize = (
	"xxs" | "xs" | "sm" | "lg" | "xl" | "xxl" |
	"1x" | "2x" | "3x" | "4x" | "5x" | "6x" | "7x" | "8x" | "9x" | "10x" |
	"24px" | "32px" | "64px" | "48px"
);



export module PrimitiveFontSize
{

	export function toCssValue(size: PrimitiveFontSize | null | undefined, defaultSize?: string)
	{
		return (
			!size ? defaultSize :
				size === "xxs" ? "0.625em" :
					size === "xs" ? ".75em" :
						size === "sm" ? ".875em" :
							size === "lg" ? "1.25em" :
								size === "xl" ? "1.5em" :
									size === "xxl" ? "2em" :
										undefined
		);

	}

}




export const Margins = [
	-1, -2, -3, -4, -8, -10, -12, -16, -20, -24, -30, -32, -36, -40, -48, -50, -64, -80, -100,
	0, 1, 2, 3, 4, 8, 10, 12, 16, 20, 24, 30, 32, 36, 40, 48, 50, 64, 80, 100
] as const;

export type Margin = typeof Margins[number];


type Ms = { [P in Margin as `m${P}`]?: boolean; };
type MXs = { [P in Margin as `mx${P}`]?: boolean; };
type MYs = { [P in Margin as `my${P}`]?: boolean; };
type MLs = { [P in Margin as `ml${P}`]?: boolean; };
type MRs = { [P in Margin as `mr${P}`]?: boolean; };
type MTs = { [P in Margin as `mt${P}`]?: boolean; };
type MBs = { [P in Margin as `mb${P}`]?: boolean; };


export const Paddings = [0, 1, 2, 3, 4, 8, 10, 12, 16, 20, 24, 30, 32, 36, 40, 48, 50, 64, 80, 100] as const;

export type Padding = typeof Paddings[number];


type Ps = { [P in Padding as `p${P}`]?: boolean; };
type PXs = { [P in Padding as `px${P}`]?: boolean; };
type PYs = { [P in Padding as `py${P}`]?: boolean; };
type PLs = { [P in Padding as `pl${P}`]?: boolean; };
type PRs = { [P in Padding as `pr${P}`]?: boolean; };
type PTs = { [P in Padding as `pt${P}`]?: boolean; };
type PBs = { [P in Padding as `pb${P}`]?: boolean; };


type Gaps = { [P in Padding as `gap${P}`]?: boolean; };
type GapXs = { [P in Padding as `gapx${P}`]?: boolean; };
type GapYs = { [P in Padding as `gapy${P}`]?: boolean; };




export interface PrimitiveClassesProps extends
	Ms, MXs, MYs, MLs, MRs, MTs, MBs,
	Ps, PXs, PYs, PLs, PRs, PTs, PBs,
	Gaps, GapXs, GapYs
{

	//---


	position?: "absolute" | "fixed" | "relative" | "sticky";

	absolute?: boolean;
	fixed?: boolean;
	relative?: boolean;
	sticky?: boolean;


	display?: "none" | "block" | "inline";

	block?: boolean;
	inline?: boolean;

	fill?: boolean;
	fullScreen?: boolean;


	//---


	flex?: boolean;
	vflex?: boolean;
	flexi?: boolean;

	flex1?: boolean;
	flex2?: boolean;
	flex3?: boolean;
	flex4?: boolean;
	flex5?: boolean;
	flex6?: boolean;
	flex7?: boolean;
	flex8?: boolean;
	flex9?: boolean;
	flex10?: boolean;
	flex11?: boolean;
	flex12?: boolean;
	flex13?: boolean;
	flex14?: boolean;
	flex15?: boolean;
	flex16?: boolean;
	flex17?: boolean;
	flex18?: boolean;
	flex19?: boolean;
	flex20?: boolean;
	flex21?: boolean;
	flex22?: boolean;
	flex23?: boolean;
	flex24?: boolean;


	center?: boolean;
	vcenter?: boolean;
	middle?: boolean;
	right?: boolean;


	hidden?: boolean;
	hiddenX?: boolean;
	hiddenY?: boolean;

	overflowAuto?: boolean;
	overflowAutoX?: boolean;
	overflowAutoY?: boolean;

	overflowAutoThin?: boolean;
	overflowAutoXThin?: boolean;
	overflowAutoYThin?: boolean;

	scroll?: boolean;
	scrollX?: boolean;
	scrollY?: boolean;

	scrollThin?: boolean;
	scrollXThin?: boolean;
	scrollYThin?: boolean;


	//---


	m?: Margin;
	mx?: Margin;
	my?: Margin;
	ml?: Margin;
	mr?: Margin;
	mt?: Margin;
	mb?: Margin;

	p?: Padding;
	px?: Padding;
	py?: Padding;
	pl?: Padding;
	pr?: Padding;
	pt?: Padding;
	pb?: Padding;

	gap?: Padding;
	gapi?: boolean;


	//---


	opacity?: number;

	opacity0?: boolean;
	opacity1?: boolean;
	opacity2?: boolean;
	opacity3?: boolean;
	opacity4?: boolean;
	opacity5?: boolean;
	opacity6?: boolean;
	opacity7?: boolean;
	opacity8?: boolean;
	opacity9?: boolean;
	opacity10?: boolean;


	//---


	zIndex0?: boolean;
	zIndex1?: boolean;
	zIndex2?: boolean;
	zIndex3?: boolean;
	zIndex4?: boolean;


	//---


	border?: "blue" | "green" | "red";
	borderBlue?: boolean;
	borderGreen?: boolean;
	borderRed?: boolean;
	border1?: boolean;
	border2?: boolean;
	border3?: boolean;
	border4?: boolean;
	borderDashed?: boolean;
	borderDotted?: boolean;


	//---


	text?: undefined | "primary";


	bold?: boolean;
	bolder?: boolean;
	em?: boolean;
	lighter?: boolean;
	light?: boolean;
	thin?: boolean;
	unbold?: boolean;

	fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
	font100?: boolean;
	font200?: boolean;
	font300?: boolean;
	font400?: boolean;
	font500?: boolean;
	font600?: boolean;
	font700?: boolean;
	font800?: boolean;
	font900?: boolean;


	italic?: boolean;
	strike?: boolean;


	size?: PrimitiveFontSize | null;

	xxsmall?: boolean;
	xsmall?: boolean;
	small?: boolean;
	smaller?: boolean;
	larger?: boolean;
	large?: boolean;
	xlarge?: boolean;
	xxlarge?: boolean;

	lineHeight1?: boolean;
	lineHeight15?: boolean;


	//---


	textLeft?: boolean;
	textCenter?: boolean;
	textRight?: boolean;

	wrap?: boolean;
	nowrap?: boolean;
	ellipsis?: boolean;


	capitalize?: boolean;
	lowerCase?: boolean;
	upperCase?: boolean;


	//---


	cursorPointer?: boolean;
	noselect?: boolean;

	animated?: boolean;


	//---


	white?: boolean;


	//---

}






export function GlobalStylesOfPrimitives(props: {

	prefix?: string;

})
{

	primitiveClsPrefix = props.prefix ? `${props.prefix}-` : "";


	return <GlobalStyles styles={prefixedStyles({


		".positionAbsolute, .absolute": { position: "absolute!important" },
		".positionFixed, .fixed": { position: "fixed!important" },
		".positionRelative, .relative": { position: "relative!important" },
		".positionSticky, .sticky": { position: "sticky!important" },

		displayNone: { display: "none!important" },
		".displayBlock, .block": { display: "block!important" },
		".displayInline, .inline": { display: "inline!important" },



		...rangeMP("m", Margins, i => ({ margin: `${i}px!important` })),
		...rangeMP("mx", Margins, i => ({ marginLeft: `${i}px!important`, marginRight: `${i}px!important` })),
		...rangeMP("my", Margins, i => ({ marginTop: `${i}px!important`, marginBottom: `${i}px!important` })),
		...rangeMP("ml", Margins, i => ({ marginLeft: `${i}px!important` })),
		...rangeMP("mr", Margins, i => ({ marginRight: `${i}px!important` })),
		...rangeMP("mt", Margins, i => ({ marginTop: `${i}px!important` })),
		...rangeMP("mb", Margins, i => ({ marginBottom: `${i}px!important` })),

		...rangeMP("p", Paddings, i => ({ padding: `${i}px!important` })),
		...rangeMP("px", Paddings, i => ({ paddingLeft: `${i}px!important`, paddingRight: `${i}px!important` })),
		...rangeMP("py", Paddings, i => ({ paddingTop: `${i}px!important`, paddingBottom: `${i}px!important` })),
		...rangeMP("pl", Paddings, i => ({ paddingLeft: `${i}px!important` })),
		...rangeMP("pr", Paddings, i => ({ paddingRight: `${i}px!important` })),
		...rangeMP("pt", Paddings, i => ({ paddingTop: `${i}px!important` })),
		...rangeMP("pb", Paddings, i => ({ paddingBottom: `${i}px!important` })),

		gapi: { gap: "inherit" },
		...rangeMP("gap", Paddings, i => ({ gap: `${i}px!important` })),
		...rangeMP("gapx", Paddings, i => ({ columnGap: `${i}px!important` })),
		...rangeMP("gapy", Paddings, i => ({ rowGap: `${i}px!important` })),

		flex: {
			display: "flex",
			flexDirection: "row",
		},

		vflex: {
			display: "flex",
			flexDirection: "column",
		},

		flexi: {
			//flex: 1,
			display: "flex",
			flexDirection: "inherit",
			gap: "inherit",
		},

		...range("flex", 1, 24, 1, i => ({
			flex: `${i}!important`,
		})),


		center: {
			display: "flex",
			flexDirection: "row",
			justifyContent: "center",
		},

		vcenter: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
		},

		middle: {
			display: "flex",
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
		},


		right: {
			display: "flex",
			flexDirection: "row",
			justifyContent: "flex-end",
		},


		hidden: { overflow: "hidden" },
		hiddenX: { overflowX: "hidden" },
		hiddenY: { overflowY: "hidden" },


		overflowAuto: { overflow: "auto", },
		overflowAutoX: { overflowX: "auto", },
		overflowAutoY: { overflowY: "auto", },

		overflowAutoThin: { overflow: "auto", scrollbarWidth: "thin" },
		overflowAutoXThin: { overflowX: "auto", scrollbarWidth: "thin" },
		overflowAutoYThin: { overflowY: "auto", scrollbarWidth: "thin" },


		scroll: { overflow: "scroll", },
		scrollX: { overflowX: "scroll", },
		scrollY: { overflowY: "scroll", },

		scrollThin: { overflow: "scroll", scrollbarWidth: "thin" },
		scrollXThin: { overflowX: "scroll", scrollbarWidth: "thin" },
		scrollYThin: { overflowY: "scroll", scrollbarWidth: "thin" },


		fill: {
			position: "absolute !important",
			inset: "0 0 0 0 !important",
		},


		fullScreen: {
			//position: "absolute",
			//inset: "0 0 0 0",
			position: "relative",
			minHeight: "100vh",
			minWidth: "100vw",
		},


		...range("opacity", 0, 10, 1, i => ({ opacity: i / 10.0 })),
		...range("opacity0_", 1, 9, 1, i => ({ opacity: i / 10.0 })),

		...range("zIndex", 0, 4, 1, i => ({ zIndex: i })),


		borderBlue: { border: "1px solid blue" },
		borderGreen: { border: "1px solid green" },
		borderRed: { border: "1px solid red" },
		border1: { borderWidth: "1px" },
		border2: { borderWidth: "2px" },
		border3: { borderWidth: "3px" },
		border4: { borderWidth: "4px" },
		borderDashed: { borderStyle: "dashed" },
		borderDotted: { borderStyle: "dotted" },


		"textPrimary": {
			fontSize: "1.125em",
			letterSpacing: ".75px",
		},


		bold: { fontWeight: "bold !important" },
		bolder: { fontWeight: "bolder !important" },
		em: { fontWeight: "500 !important" },
		lighter: { fontWeight: "lighter !important" },
		light: { fontWeight: "300 !important" },
		thin: { fontWeight: "200 !important" },
		unbold: { fontWeight: "normal !important" },

		...range("fontWeight", 100, 900, 100, i => ({
			fontWeight: `${i} !important`,
		})),

		...range("font", 100, 900, 100, i => ({
			fontWeight: `${i} !important`,
		})),



		italic: {
			fontStyle: "italic",
		},

		strike: {
			textDecoration: "rgba(0,0,0,.35) line-through 2px !important",
		},


		sizeXxs: { fontSize: "0.625em !important" },
		sizeXs: { fontSize: ".75em !important" },
		sizeSm: { fontSize: ".875em !important" },
		sizeLg: { fontSize: "1.25em !important" },
		sizeXl: { fontSize: "1.5em !important" },
		sizeXxl: { fontSize: "2em !important" },
		size1x: { fontSize: "1em !important" },
		size2x: { fontSize: "2em !important" },
		size3x: { fontSize: "3em !important" },
		size4x: { fontSize: "4em !important" },
		size5x: { fontSize: "5em !important" },
		size6x: { fontSize: "6em !important" },
		size7x: { fontSize: "7em !important" },
		size8x: { fontSize: "8em !important" },
		size9x: { fontSize: "9em !important" },
		size10x: { fontSize: "10em !important" },
		size24px: { fontSize: "24px !important" },
		size32px: { fontSize: "32px !important" },
		size48px: { fontSize: "48px !important" },
		size64px: { fontSize: "64px !important" },

		//xxs: { fontSize: "0.625em !important" },
		//xs: { fontSize: ".75em !important" },
		//sm: { fontSize: ".875em !important" },
		//lg: { fontSize: "1.25em !important" },
		//xl: { fontSize: "1.5em !important" },
		//xxl: { fontSize: "2em !important" },

		xxsmall: { fontSize: ".625em!important" },
		xsmall: { fontSize: ".75em!important" },
		small: { fontSize: ".875em!important" },
		smaller: { fontSize: "smaller!important" },
		larger: { fontSize: "larger!important" },
		large: { fontSize: "1.25em!important" },
		xlarge: { fontSize: "1.5em!important" },
		xxlarge: { fontSize: "2em!important" },

		lineHeight1: { lineHeight: "1em!important" },
		lineHeight15: { lineHeight: "1.5em!important" },


		textLeft: {
			textAlign: "left !important",
			justifyContent: "start",
		},
		textCenter: {
			textAlign: "center !important",
			justifyContent: "center",
		},
		textRight: {
			textAlign: "right !important",
			justifyContent: "end",
		},


		wrap: {
			whiteSpace: "normal !important",
		},

		nowrap: {
			whiteSpace: "nowrap !important",
			"& *": {
				whiteSpace: "nowrap !important",
			},
		},

		ellipsis: {
			textOverflow: "ellipsis",
		},


		capitalize: {
			textTransform: "lowercase",
		},
		lowerCase: {
			textTransform: "lowercase",
		},
		upperCase: {
			textTransform: "uppercase",
		},


		cursorPointer: {
			cursor: "pointer",
		},


		noselect: {
			userSelect: "none",
		},

		animated: {
			transition: `all ${$defaultAnimationDurationMs}ms ease-in-out, font-size ${$defaultAnimationDurationMs}ms linear`
		},


		white: {
			background: "white",
		},


	})} />;




	function range(cls: string, min: number, max: number, step: number, style: (i: number) => Object)
	{

		let styles: GlobalProps["styles"] = {};


		for (let i = min; i <= max; i += step)
		{
			(styles as any)[cls + i] = style(i);
		}


		return styles;

	}



	function rangeMP(cls: string, values: ReadonlyArray<number>, style: (i: number) => Object)
	{

		let styles: GlobalProps["styles"] = {};

		for (let i of values)
		{
			(styles as any)[cls + i] = style(i);
		}

		return styles;

	}



	function prefixedStyles(src: any/*GlobalProps["styles"]*/): GlobalProps["styles"]
	{

		let dest: GlobalProps["styles"] = {};
		let prefix = `.${primitiveClsPrefix}`;


		for (let cls in src as any)
		{

			if (!Object.prototype.hasOwnProperty.call(src, cls))
				continue;


			let destCls = cls.indexOf(".") < 0 ? prefix + cls : cls;

			dest[destCls] = (src as any)[cls];

		}


		return dest;

	}

}






//===






export function createPrimitive<TElement extends Element>(

	tag: keyof React.ReactHTML | React.FunctionComponent<any>,

	elementProps: any,
	primitiveProps: Readonly<PrimitiveProps<TElement>>,

	ignoreClassProps?: (string | number)[],
	ignoreClassProps2?: (string | number)[],
)
{

	if (!primitiveProps)
	{
		return React.createElement(tag as any, elementProps);
	}


	let className = clsx(
		elementProps.className,
		primitiveProps.className,
		primitivePropsToClassName(primitiveProps, ignoreClassProps, ignoreClassProps2)
	);


	if (primitiveProps.__html)
	{

		return React.createElement(tag, {

			dangerouslySetInnerHTML: { __html: primitiveProps.__html },

			title: primitiveProps.hint,
			onClick: primitiveProps.onClick,

			...elementProps,

			className,

		});

	}


	const children = Values.one<ReactNode>(
		elementProps.children !== undefined ? elementProps.children : primitiveProps.children
	);


	//if (primitiveProps.sm)
	//{

	//	return React.createElement(tag, {

	//		children: children ?? primitiveProps.sm.$iconTitle,

	//		title: primitiveProps.hint ?? primitiveProps.sm.$hint,
	//		onClick: primitiveProps.onClick,

	//		...elementProps,

	//		className,

	//	});

	//}


	return React.createElement(tag, {

		id: primitiveProps.id,

		children,

		title: primitiveProps.hint,
		onClick: primitiveProps.onClick,
		onTransitionEnd: primitiveProps.onTransitionEnd,

		style: primitiveProps.style,

		...elementProps,

		className,

	});

}





export function primitivePropsToClassName(
	props: PrimitiveClassesProps,
	ignoreClassProps: (string | number)[] | undefined,
	ignoreClassProps2?: (string | number)[],
)
{

	if (!props)
		return undefined;


	const prefix = primitiveClsPrefix;


	let classes: string[] = [];
	let prop: keyof PrimitiveProps;
	let value: any;


	for (prop in props)
	{

		if (!props.hasOwnProperty(prop))
			continue;


		if (primitiveBasePropNames.indexOf(prop as any) >= 0)
			continue;

		if (ignoreClassProps && ignoreClassProps.indexOf(prop) >= 0)
			continue;

		if (ignoreClassProps2 && ignoreClassProps2.indexOf(prop) >= 0)
			continue;


		value = (props as any)[prop];

		if (!value)
			continue;


		if (typeof value === "boolean")
		{
			classes.push(`${prefix}${prop}`);
		}

		else if (typeof value === "string")
		{
			classes.push(`${prefix}${prop}${value.substring(0, 1).toUpperCase() + value.substring(1)}`);
		}

		else if (typeof value === "number")
		{

			if (Number.isInteger(value))
				classes.push(`${prefix}${prop}${value}`);
			else
				classes.push(`${prefix}${prop}${value.toFixed(1).replace(".", "_")}`);

		}

	}



	return classes.join(" ") || undefined;

}






//===






export interface DivProps extends PrimitiveProps<HTMLDivElement> { }



export const Div = forwardRef((props: DivProps, ref: React.Ref<HTMLDivElement>) =>
{
	return createPrimitive("div", { ref }, props);
});






export interface SpanProps extends PrimitiveProps<HTMLSpanElement> { }



export const Span = forwardRef((props: SpanProps, ref: React.Ref<HTMLSpanElement>) =>
{
	return createPrimitive("span", { ref }, props);
});


export const Em = forwardRef((props: SpanProps, ref: React.Ref<HTMLSpanElement>) =>
{
	return createPrimitive("em", { ref }, props);
});






export interface TableProps extends PrimitiveProps<HTMLTableElement> { }



export const Table = forwardRef((props: TableProps, ref: React.Ref<HTMLTableElement>) =>
{
	return createPrimitive("table", { ref }, props);
});






//===






const LinkRoot = styled("a")({


	position: "relative",
	display: "inline-flex",
	alignItems: "center",

	color: "#0e3477",
	textDecoration: "none!important",
	outline: "0!important",

	"&::after": {
		content: `""`,
		position: "absolute",
		bottom: -1,
		height: 1,
		opacity: 0,
		left: "50%",
		right: "50%",
		background: "#40a9ff",
		transition: "all .2s ease-in-out",
	},

	"&:hover::after": {
		opacity: 1,
		left: 0,
		right: 0,
	},

});






export interface LinkProps extends PrimitiveProps<HTMLAnchorElement>//, React.AnchorHTMLAttributes<HTMLAnchorElement>
{

	download?: any;
	href?: string | undefined;
	hrefLang?: string | undefined;
	media?: string | undefined;
	ping?: string | undefined;
	rel?: string | undefined;
	target?: React.HTMLAttributeAnchorTarget | undefined;
	type?: string | undefined;
	referrerPolicy?: React.HTMLAttributeReferrerPolicy | undefined;

}



const linkBasePropNames = ["download", "href", "hrefLang", "media", "ping", "rel", "target", "type", "referrerPolicy"];






export const Link = forwardRef((props: LinkProps, ref: React.Ref<HTMLAnchorElement>) =>
{
	return createPrimitive(LinkRoot, { ref }, props, linkBasePropNames);
});
