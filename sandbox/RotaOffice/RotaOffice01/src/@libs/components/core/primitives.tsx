import { type GlobalProps } from "@emotion/react";
import GlobalStyles from "@mui/material/GlobalStyles";
import * as muiColors from "@mui/material/colors";
import { styled, type CSSObject } from "@mui/material/styles";
import clsx from "clsx";
import * as React from "react";
import { forwardRef, type ReactNode } from "react";
import { $defaultAnimationDurationMs } from "./__debug";
import { Values } from "./utils";






//===






let primitiveClsPrefix: string = "";






//===






export interface PrimitiveBaseProps<T extends Element>
{

	id?: string;

	//sm?: IObjectSemantic | null;

	className?: string;

	hint?: string;

	onClick?: React.MouseEventHandler<T>;
	onTransitionEnd?: React.TransitionEventHandler<T>;


	style?: React.CSSProperties;

	children?: ReactNode;

	__html?: string;

}



const primitiveBasePropNames: Array<keyof PrimitiveBaseProps<Element>> = [
	"id", /*"sm",*/ "className", "hint", "onClick", "onTransitionEnd", "style", "children", "__html",
];






export const Margins = [
	-1, -2, -3, -4, -5, -6, -7, -8, -10, -12, -16, -20, -21, -24, -30, -32, -36, -40, -48, -50, -60, -64, -80, -100, -150, -200,
	0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20, 21, 24, 30, 32, 36, 40, 48, 50, 60, 64, 80, 100, 150, 200
] as const;

export type Margin = typeof Margins[number];


type Ms = { [P in Margin as `m${P}`]?: boolean; };
type MXs = { [P in Margin as `mx${P}`]?: boolean; };
type MYs = { [P in Margin as `my${P}`]?: boolean; };
type MLs = { [P in Margin as `ml${P}`]?: boolean; };
type MRs = { [P in Margin as `mr${P}`]?: boolean; };
type MTs = { [P in Margin as `mt${P}`]?: boolean; };
type MBs = { [P in Margin as `mb${P}`]?: boolean; };


export const Paddings = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20, 21, 24, 30, 32, 36, 40, 48, 50, 60, 64, 80, 100, 150, 200] as const;

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






//===






const flexes24 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] as const;
const flexesPx = Paddings;


type Flex = typeof flexes24[number] | `${typeof flexesPx[number]}px`;

type FlexProps = {
	[P in Flex as `flex${P}`]?: boolean;
};





//===






type Bg = (
	"0" | "1" | "2" | "3" | "4" |
	`blueGrey${keyof typeof muiColors.blueGrey}`
);

type BgProps = (
	{ bg?: Bg; } &
	{ [P in Capitalize<Bg> as `bg${P}`]?: boolean; }
);


export const bgColors = {

	[0]: "#ffffff",
	[1]: "#f0f2f5",
	[2]: muiColors.blueGrey[200],
	[3]: muiColors.blueGrey[400],
	[4]: muiColors.blueGrey[500],
	//[2]: muiColors.blueGrey[100],
	//[3]: muiColors.blueGrey[200],
	//[4]: muiColors.blueGrey[300],

	...rangeOP("blueGrey", muiColors.blueGrey, v => v),

} as ({ [P in Bg]: string });






//===






type Elevation = "0" | "L1" | "L1b" | "L2" | "L3" | "L4" | "L5" | "D1" | "D2" | "D3" | "D4" | "D5";

type ElevationProps = { [P in Capitalize<Elevation> as `e${P}`]?: boolean; }



export const elevaltionShadows =
{
	"0": "none",

	"L1": "0 1px 4px 0 rgba(0, 0, 0, 0.165)",
	"L1b": "4px 8px 4px -8px rgba(0, 0, 0, 0.165);",
	"L2": "0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 6px 10px 0 rgba(0, 0, 0, 0.15)",
	"L3": "0 11px 7px 0 rgba(0, 0, 0, 0.195), 0 13px 25px 0 rgba(0, 0, 0, 0.15)",
	"L4": "0 14px 12px 0 rgba(0, 0, 0, 0.085), 0 20px 40px 0 rgba(0, 0, 0, 0.15)",
	"L5": "0 17px 17px 0 rgba(0, 0, 0, 0.075), 0 27px 55px 0 rgba(0, 0, 0, 0.15)",

	"D1": "0 1px 4px 0 rgba(0, 0, 0, 0.37)",
	"D2": "0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.3)",
	"D3": "0 11px 7px 0 rgba(0, 0, 0, 0.19), 0 13px 25px 0 rgba(0, 0, 0, 0.3)",
	"D4": "0 14px 12px 0 rgba(0, 0, 0, 0.17), 0 20px 40px 0 rgba(0, 0, 0, 0.3)",
	"D5": "0 17px 17px 0 rgba(0, 0, 0, 0.15), 0 27px 55px 0 rgba(0, 0, 0, 0.3)",

};






//===






type FontSize = (
	"xxs" | "xs" | "sm" | "lg" | "xl" | "xxl" |
	"1x" | "2x" | "3x" | "4x" | "5x" | "6x" | "7x" | "8x" | "9x" | "10x" |
	"24px" | "32px" | "48px" | "54px" | "64px"
);

type FontSizeProps = { [P in Capitalize<FontSize> as `font${P}`]?: boolean; }



export const fontSizes: Record<FontSize, string> =
{
	"xxs": "0.625em",
	"xs": ".75em",
	"sm": ".875em",
	"lg": "1.25em",
	"xl": "1.5em",
	"xxl": "2em",
	"1x": "1em",
	"2x": "2em",
	"3x": "3em",
	"4x": "4em",
	"5x": "5em",
	"6x": "6em",
	"7x": "7em",
	"8x": "8em",
	"9x": "9em",
	"10x": "10em",
	"24px": "24px",
	"32px": "32px",
	"48px": "48px",
	"54px": "54px",
	"64px": "64px",

};






//===






export interface PrimitiveClassesProps extends
	Ms, MXs, MYs, MLs, MRs, MTs, MBs,
	Ps, PXs, PYs, PLs, PRs, PTs, PBs,
	FlexProps,
	Gaps, GapXs, GapYs,
	BgProps, FontSizeProps, ElevationProps
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

	fontRoboto?: boolean;

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


	/** elevation */
	e?: Elevation;


	//---

}






export function GlobalStylesOfPrimitives(props: {

	prefix?: string;

})
{

	primitiveClsPrefix = props.prefix ? `${props.prefix}-` : "";


	let primitiveStyles = prefixedStyles({


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
			justifyContent: "inherit",
			alignItems: "inherit",
			gap: "inherit",
			borderRadius: "inherit",
		},

		...rangeMP("flex", flexes24, i => ({ flex: `${i}!important` })),
		...rangeMP(i => `flex${i}px`, flexesPx, i => ({ flex: `0 0 ${i}px!important` })),


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

		fontRoboto: { fontFamily: "Roboto" },


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


		...rangeOP("font", fontSizes, v => ({ fontSize: v })),



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



		...rangeOP("bg", bgColors, v => ({ background: v })),

		...rangeOP("e", elevaltionShadows, v => ({ boxShadow: v })),


	});



	return <GlobalStyles styles={{

		...primitiveStyles as any,

		em: {
			fontStyle: "normal",
			fontWeight: 500,
		},


	}} />;



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

		if (value == null)
			continue;


		if (typeof value === "boolean")
		{
			classes.push(`${prefix}${prop}`);
		}

		else if (typeof value === "string")
		{
			classes.push(`${prefix}${prop}${capitalize(value)}`);
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






function range(cls: string, min: number, max: number, step: number, style: (i: number) => CSSObject)
{

	let styles: GlobalProps["styles"] = {};


	for (let i = min; i <= max; i += step)
	{
		(styles as any)[cls + i] = style(i);
	}


	return styles;

}


function rangeMP(cls: string | ((i: number) => string), values: ReadonlyArray<number>, style: (i: number) => CSSObject)
{

	let styles: GlobalProps["styles"] = {};


	let cls2 = typeof cls === "function" ? cls : ((i: number) => cls + i);


	for (let i of values)
	{
		(styles as any)[cls2(i)] = style(i);
	}

	return styles;

}



function rangeOP(cls: string, obj: Object, style: (value: any) => CSSObject)
{

	let styles: GlobalProps["styles"] = {};

	for (let p in obj)
	{
		if (!obj.hasOwnProperty(p))
			continue;

		(styles as any)[cls + capitalize(p + '')] = style((obj as any)[p]);
	}

	return styles;

}



function capitalize(value: string)
{
	return !value ? value : value.substring(0, 1).toUpperCase() + value.substring(1);
}






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




