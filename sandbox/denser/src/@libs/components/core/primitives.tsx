import { GlobalProps } from "@emotion/react";
import { GlobalStyles, styled } from "@mui/material";
import clsx from "clsx";
import * as React from "react";
import { forwardRef, ReactNode } from "react";
import { $defaultAnimationDurationMs } from "./__debug";






//===







var primitiveClsPrefix: string = '';






//===






export interface PrimitiveProps<T extends Element = Element>
	extends PrimitiveBaseProps<T>, PrimitiveClassesProps
{
}






export interface PrimitiveBaseProps<T extends Element>
{

	id?: string | undefined;

	//sm?: IObjectSemantic | null;

	className?: string | undefined;

	hint?: string | undefined;

	onClick?: React.MouseEventHandler<T> | undefined;

	style?: React.CSSProperties | undefined;

	children?: ReactNode | /*(() => ReactNode) |*/ undefined;

	__html?: string | undefined;

}



const primitiveBasePropNames = ['id', /*'sm',*/ 'className', 'hint', 'onClick', 'style', 'children', '__html',];






export type PrimitiveFontSize = (
	'xxs' | 'xs' | 'sm' | 'lg' | 'xl' | 'xxl' |
	'1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x' |
	'24px' | '32px' | '64px' | '48px'
);



export module PrimitiveFontSize
{

	export function toCssValue(size: PrimitiveFontSize | null | undefined, defaultSize?: string)
	{
		return (
			!size ? defaultSize :
				size === 'xxs' ? '0.625em' :
					size === 'xs' ? '.75em' :
						size === 'sm' ? '.875em' :
							size === 'lg' ? '1.25em' :
								size === 'xl' ? '1.5em' :
									size === 'xxl' ? '2em' :
										undefined
		);

	}

}




export const MarginOrPaddings = [1, 2, 4, 8, 10, 12, 16, 20, 24, 30, 32, 36, 40, 48, 50, 64, 80, 100] as const;
export type MarginOrPadding = typeof MarginOrPaddings[number];


type Ms = { [P in MarginOrPadding as `m${P}`]?: boolean; };
type MXs = { [P in MarginOrPadding as `mx${P}`]?: boolean; };
type MYs = { [P in MarginOrPadding as `my${P}`]?: boolean; };
type MLs = { [P in MarginOrPadding as `ml${P}`]?: boolean; };
type MRs = { [P in MarginOrPadding as `mr${P}`]?: boolean; };
type MTs = { [P in MarginOrPadding as `mt${P}`]?: boolean; };
type MBs = { [P in MarginOrPadding as `mb${P}`]?: boolean; };

type Ps = { [P in MarginOrPadding as `p${P}`]?: boolean; };
type PXs = { [P in MarginOrPadding as `px${P}`]?: boolean; };
type PYs = { [P in MarginOrPadding as `py${P}`]?: boolean; };
type PLs = { [P in MarginOrPadding as `pl${P}`]?: boolean; };
type PRs = { [P in MarginOrPadding as `pr${P}`]?: boolean; };
type PTs = { [P in MarginOrPadding as `pt${P}`]?: boolean; };
type PBs = { [P in MarginOrPadding as `pb${P}`]?: boolean; };


type Gaps = { [P in MarginOrPadding as `gap${P}`]?: boolean; };
type GapXs = { [P in MarginOrPadding as `gapx${P}`]?: boolean; };
type GapYs = { [P in MarginOrPadding as `gapy${P}`]?: boolean; };




export interface PrimitiveClassesProps extends
	Ms, MXs, MYs, MLs, MRs, MTs, MBs,
	Ps, PXs, PYs, PLs, PRs, PTs, PBs,
	Gaps, GapXs, GapYs
{

	//---



	position?: 'absolute' | 'fixed' | 'relative' | 'sticky';

	absolute?: boolean;
	fixed?: boolean;
	relative?: boolean;
	sticky?: boolean;


	display?: 'none' | 'block' | 'inline';

	block?: boolean;
	inline?: boolean;

	fill?: boolean;
	fullScreen?: boolean;



	//---



	flex?: boolean;
	vflex?: boolean;

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



	m?: MarginOrPadding;
	mx?: MarginOrPadding;
	my?: MarginOrPadding;
	ml?: MarginOrPadding;
	mr?: MarginOrPadding;
	mt?: MarginOrPadding;
	mb?: MarginOrPadding;

	p?: MarginOrPadding;
	px?: MarginOrPadding;
	py?: MarginOrPadding;
	pl?: MarginOrPadding;
	pr?: MarginOrPadding;
	pt?: MarginOrPadding;
	pb?: MarginOrPadding;

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



	border?: 'blue' | 'green' | 'red';
	borderBlue?: boolean;
	borderGreen?: boolean;
	borderRed?: boolean;


	//---



	text?: undefined | 'primary';



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

	primitiveClsPrefix = props.prefix ? `${props.prefix}-` : '';


	return <GlobalStyles styles={prefixedStyles({


		'.positionAbsolute, .absolute': { position: 'absolute!important' },
		'.positionFixed, .fixed': { position: 'fixed!important' },
		'.positionRelative, .relative': { position: 'relative!important' },
		'.positionSticky, .sticky': { position: 'sticky!important' },

		displayNone: { display: 'none!important' },
		'.displayBlock, .block': { display: 'block!important' },
		'.displayInline, .inline': { display: 'inline!important' },



		...rangeMP('m', i => ({ margin: `${i}px!important` })),
		...rangeMP('mx', i => ({ marginLeft: `${i}px!important`, marginRight: `${i}px!important` })),
		...rangeMP('my', i => ({ marginTop: `${i}px!important`, marginBottom: `${i}px!important` })),
		...rangeMP('ml', i => ({ marginLeft: `${i}px!important` })),
		...rangeMP('mr', i => ({ marginRight: `${i}px!important` })),
		...rangeMP('mt', i => ({ marginTop: `${i}px!important` })),
		...rangeMP('mb', i => ({ marginBottom: `${i}px!important` })),

		...rangeMP('p', i => ({ padding: `${i}px!important` })),
		...rangeMP('px', i => ({ paddingLeft: `${i}px!important`, paddingRight: `${i}px!important` })),
		...rangeMP('py', i => ({ paddingTop: `${i}px!important`, paddingBottom: `${i}px!important` })),
		...rangeMP('pl', i => ({ paddingLeft: `${i}px!important` })),
		...rangeMP('pr', i => ({ paddingRight: `${i}px!important` })),
		...rangeMP('pt', i => ({ paddingTop: `${i}px!important` })),
		...rangeMP('pb', i => ({ paddingBottom: `${i}px!important` })),

		gapi: { gap: 'inherit' },
		...rangeMP('gap', i => ({ gap: `${i}px!important` })),
		...rangeMP('gapx', i => ({ columnGap: `${i}px!important` })),
		...rangeMP('gapy', i => ({ rowGap: `${i}px!important` })),

		flex: {
			display: 'flex',
			flexDirection: 'row',
		},

		vflex: {
			display: 'flex',
			flexDirection: 'column',
		},

		...range('flex', 1, 24, 1, i => ({
			flex: i,
		})),


		center: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
		},

		vcenter: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
		},

		middle: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
		},


		right: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-end',
		},


		hidden: { overflow: 'hidden' },
		hiddenX: { overflowX: 'hidden' },
		hiddenY: { overflowY: 'hidden' },


		overflowAuto: { overflow: 'auto', },
		overflowAutoX: { overflowX: 'auto', },
		overflowAutoY: { overflowY: 'auto', },

		overflowAutoThin: { overflow: 'auto', scrollbarWidth: 'thin' },
		overflowAutoXThin: { overflowX: 'auto', scrollbarWidth: 'thin' },
		overflowAutoYThin: { overflowY: 'auto', scrollbarWidth: 'thin' },


		scroll: { overflow: 'scroll', },
		scrollX: { overflowX: 'scroll', },
		scrollY: { overflowY: 'scroll', },

		scrollThin: { overflow: 'scroll', scrollbarWidth: 'thin' },
		scrollXThin: { overflowX: 'scroll', scrollbarWidth: 'thin' },
		scrollYThin: { overflowY: 'scroll', scrollbarWidth: 'thin' },


		fill: {
			position: 'absolute !important',
			inset: '0 0 0 0 !important',
		},


		fullScreen: {
			//position: 'absolute',
			//inset: '0 0 0 0',
			position: 'relative',
			minHeight: '100vh',
			minWidth: '100vw',
		},


		...range('opacity', 0, 10, 1, i => ({ opacity: i / 10.0 })),
		...range('opacity0_', 1, 9, 1, i => ({ opacity: i / 10.0 })),


		borderBlue: { border: '1px solid blue' },
		borderGreen: { border: '1px solid green' },
		borderRed: { border: '1px solid red' },


		'textPrimary': {
			fontSize: '1.125em',
			letterSpacing: '.75px',
		},


		bold: { fontWeight: 'bold !important' },
		bolder: { fontWeight: 'bolder !important' },
		em: { fontWeight: '500 !important' },
		lighter: { fontWeight: 'lighter !important' },
		light: { fontWeight: '300 !important' },
		thin: { fontWeight: '200 !important' },
		unbold: { fontWeight: 'normal !important' },

		...range('fontWeight', 100, 900, 100, i => ({
			fontWeight: `${i} !important`,
		})),

		...range('font', 100, 900, 100, i => ({
			fontWeight: `${i} !important`,
		})),



		italic: {
			fontStyle: 'italic',
		},

		strike: {
			textDecoration: 'rgba(0,0,0,.35) line-through 2px !important',
		},


		sizeXxs: { fontSize: '0.625em !important' },
		sizeXs: { fontSize: '.75em !important' },
		sizeSm: { fontSize: '.875em !important' },
		sizeLg: { fontSize: '1.25em !important' },
		sizeXl: { fontSize: '1.5em !important' },
		sizeXxl: { fontSize: '2em !important' },
		size1x: { fontSize: '1em !important' },
		size2x: { fontSize: '2em !important' },
		size3x: { fontSize: '3em !important' },
		size4x: { fontSize: '4em !important' },
		size5x: { fontSize: '5em !important' },
		size6x: { fontSize: '6em !important' },
		size7x: { fontSize: '7em !important' },
		size8x: { fontSize: '8em !important' },
		size9x: { fontSize: '9em !important' },
		size10x: { fontSize: '10em !important' },
		size24px: { fontSize: '24px !important' },
		size32px: { fontSize: '32px !important' },
		size48px: { fontSize: '48px !important' },
		size64px: { fontSize: '64px !important' },

		//xxs: { fontSize: '0.625em !important' },
		//xs: { fontSize: '.75em !important' },
		//sm: { fontSize: '.875em !important' },
		//lg: { fontSize: '1.25em !important' },
		//xl: { fontSize: '1.5em !important' },
		//xxl: { fontSize: '2em !important' },

		xxsmall: { fontSize: '.625em!important' },
		xsmall: { fontSize: '.75em!important' },
		small: { fontSize: '.875em!important' },
		smaller: { fontSize: 'smaller!important' },
		larger: { fontSize: 'larger!important' },
		large: { fontSize: '1.25em!important' },
		xlarge: { fontSize: '1.5em!important' },
		xxlarge: { fontSize: '2em!important' },

		lineHeight1: { lineHeight: '1em!important' },
		lineHeight15: { lineHeight: '1.5em!important' },


		textLeft: {
			textAlign: 'left !important',
			justifyContent: 'start',
		},
		textCenter: {
			textAlign: 'center !important',
			justifyContent: 'center',
		},
		textRight: {
			textAlign: 'right !important',
			justifyContent: 'end',
		},


		wrap: {
			whiteSpace: 'normal !important',
		},

		nowrap: {
			whiteSpace: 'nowrap !important',
			'& *': {
				whiteSpace: 'nowrap !important',
			},
		},

		ellipsis: {
			textOverflow: 'ellipsis',
		},


		capitalize: {
			textTransform: 'lowercase',
		},
		lowerCase: {
			textTransform: 'lowercase',
		},
		upperCase: {
			textTransform: 'uppercase',
		},


		cursorPointer: {
			cursor: 'pointer',
		},


		noselect: {
			userSelect: 'none',
		},

		animated: {
			transition: `all ${$defaultAnimationDurationMs}ms ease-in-out, font-size ${$defaultAnimationDurationMs}ms linear`
		},


		white: {
			background: 'white',
		},


	})} />;




	function range(cls: string, min: number, max: number, step: number, style: (i: number) => Object)
	{

		let styles: GlobalProps['styles'] = {};


		for (let i = min; i <= max; i += step)
		{
			(styles as any)[cls + i] = style(i);
		}


		return styles;

	}



	function rangeMP(cls: string, style: (i: number) => Object)
	{

		let styles: GlobalProps['styles'] = {};


		for (let i of MarginOrPaddings)
		{
			(styles as any)[cls + i] = style(i);
		}


		return styles;

	}



	function prefixedStyles(src: any/*GlobalProps['styles']*/): GlobalProps['styles']
	{

		let dest: GlobalProps['styles'] = {};
		let prefix = `.${primitiveClsPrefix}`;


		for (let cls in src as any)
		{

			if (!Object.prototype.hasOwnProperty.call(src, cls))
				continue;


			let destCls = cls.indexOf('.') < 0 ? prefix + cls : cls;

			dest[destCls] = (src as any)[cls];

		}


		return dest;

	}

}






//===






export function createPrimitive<TElement extends Element>(

	tag: keyof React.ReactHTML | React.FunctionComponent<any>,

	elementProps: any,
	primitiveProps: PrimitiveProps<TElement>,

	ignoreClassProps?: string[],
	//	ignoreClassProps2?: string[],
)
{

	if (!primitiveProps)
	{
		return React.createElement(tag as any, elementProps);
	}


	let className = clsx(
		elementProps.className,
		primitiveProps.className,
		primitivePropsToClassName(primitiveProps, ignoreClassProps/*, ignoreClassProps2*/)
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


	const children_ = elementProps.children !== undefined ? elementProps.children : primitiveProps.children;
	const children: ReactNode = typeof children_ === 'function' ? children_() : children_;


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

		style: primitiveProps.style,

		...elementProps,

		className,

	});

}





export function primitivePropsToClassName(
	props: PrimitiveClassesProps,
	ignoreClassProps: string[] | undefined,
	//	ignoreClassProps2?: string[],
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


		if (primitiveBasePropNames.indexOf(prop) >= 0)
			continue;

		if (ignoreClassProps && ignoreClassProps.indexOf(prop) >= 0)
			continue;

		//if (ignoreClassProps2 && ignoreClassProps2.indexOf(prop) >= 0)
		//	continue;


		value = (props as any)[prop];

		if (!value)
			continue;


		if (typeof value === 'boolean')
		{
			classes.push(`${prefix}${prop}`);
		}

		else if (typeof value === 'string')
		{
			classes.push(`${prefix}${prop}${value.substr(0, 1).toUpperCase() + value.substr(1)}`);
		}

		else if (typeof value === 'number')
		{

			if (Number.isInteger(value))
				classes.push(`${prefix}${prop}${value}`);
			else
				classes.push(`${prefix}${prop}${value.toFixed(1).replace('.', '_')}`);

		}

	}



	return classes.join(' ') || undefined;

}






//===






export interface DivProps extends PrimitiveProps<HTMLDivElement> { }



export const Div = forwardRef((props: DivProps, ref: React.Ref<HTMLDivElement>) =>
{
	return createPrimitive('div', { ref }, props);
});






export interface SpanProps extends PrimitiveProps<HTMLSpanElement> { }



export const Span = forwardRef((props: SpanProps, ref: React.Ref<HTMLSpanElement>) =>
{
	return createPrimitive('span', { ref }, props);
});


export const Em = forwardRef((props: SpanProps, ref: React.Ref<HTMLSpanElement>) =>
{
	return createPrimitive('em', { ref }, props);
});






export interface TableProps extends PrimitiveProps<HTMLTableElement> { }



export const Table = forwardRef((props: TableProps, ref: React.Ref<HTMLTableElement>) =>
{
	return createPrimitive('table', { ref }, props);
});






//===






const LinkRoot = styled('a')({


	position: 'relative',
	display: 'inline-flex',
	alignItems: 'center',

	color: '#0e3477',
	textDecoration: 'none!important',
	outline: '0!important',

	'&::after': {
		content: '""',
		position: 'absolute',
		bottom: -1,
		height: 1,
		opacity: 0,
		left: '50%',
		right: '50%',
		background: '#40a9ff',
		transition: 'all .2s ease-in-out',
	},

	'&:hover::after': {
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



const linkBasePropNames = ['download', 'href', 'hrefLang', 'media', 'ping', 'rel', 'target', 'type', 'referrerPolicy'];






export const Link = forwardRef((props: LinkProps, ref: React.Ref<HTMLAnchorElement>) =>
{
	return createPrimitive(LinkRoot, { ref }, props, linkBasePropNames);
});
