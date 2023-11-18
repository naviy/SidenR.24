import { styled } from "@mui/material/styles";
import clsx from "clsx";
import React, { useRef, type ReactNode } from "react";
import { $defaultAnimationDurationMs, PrimitiveProps, UseHookProps, Values, createPrimitive, useNew } from "../core";
import { Expander, ExpanderBaseProps, ExpanderBehavior, FlexExpanderBehavior } from "../expanders";
import { Block } from "./Block";
import { ContainerInfo } from "./ContainerInfo";
import { ContainerBaseProps, PaneRadius, type ContainerLayout, PaneBorder } from "./ContainerProps";






//===






export function Ghost(props: ContainerBaseProps & { children?: ReactNode })
{

	let parentInfo = ContainerInfo.use();

	let v = ContainerInfo.init(
		props,
		parentInfo,
		{
			layout: props.layout || parentInfo?.layout || "col",
		},
	);


	v = ContainerInfo.useValue(v, props.id);

	return <ContainerInfo.Context.Provider
		value={v}
		children={props.children}
	/>;

}






//===






export interface ContainerProps<Z extends ContainerProps<Z>>
	extends ContainerBaseProps, ExpanderBaseProps, UseHookProps<Z>
{

}



export module ContainerProps
{

	export const propNames: PropNames<ContainerProps<any>> =
		{
			...ContainerBaseProps.propNames,
			...ExpanderBaseProps.propNames,
			...UseHookProps.propNames,
		} as const;

}




export interface DivProps extends ContainerProps<DivProps>, PrimitiveProps<HTMLDivElement> { }
export interface ColProps extends ContainerProps<ColProps>, PrimitiveProps<HTMLDivElement> { }
export interface RowProps extends ContainerProps<RowProps>, PrimitiveProps<HTMLDivElement> { }


export function Div(props: DivProps)
{
	return renderProvider("col", props);
}

export function Col(props: ColProps)
{
	return renderProvider("col", props, "vflex");
}

export function Row(props: RowProps)
{
	return renderProvider("row", props, "flex");
}






//===






export function renderProvider(
	layout: ContainerLayout | null | undefined,
	props: ContainerProps<any> & PrimitiveProps<HTMLDivElement>,
	addClassName?: string
)
{

	//_$log(type, props.id)

	props = UseHookProps.use(props);

	let parentInfo = ContainerInfo.use();

	let elRef = useRef<HTMLDivElement>(null);

	//props.id && $log(type, props.id)
	//props.id && _$log("ppx", props.ppx);
	//props.id && _$log("ppx0", props.ppx0);


	let expander: ExpanderBehavior | undefined = undefined;
	let flexExpander: FlexExpanderBehavior | undefined = undefined;
	let preExpanding = false;

	let sizes = Block.getBoxSizes(
		parentInfo?.layout || "col",
		props,
	);


	if (props.expanded !== undefined)
	{

		if (sizes.isFlex)
		{
			flexExpander = useNew(FlexExpanderBehavior).use(elRef, sizes.flex, props);
			preExpanding = flexExpander.expanded && flexExpander.collapsed;

		}
		else
		{
			expander = useNew(Expander.Behavior).use(elRef, null, props);
			preExpanding = expander.expanded && expander.collapsed;

		}

	}


	let v = ContainerInfo.init(
		props,
		parentInfo,
		{
			layout: props.layout || layout || parentInfo?.layout || "col",
		},
	);


	v = ContainerInfo.useValue(v, props.id);


	let body = props.children;


	let expanderProps: Partial<RootProps> & React.HTMLProps<HTMLDivElement> = {};

	if (flexExpander)
	{

		body = flexExpander.childrenShouldBeRendered && /*Block.injectProps(*/Values.one(body)/*)*/;

		expanderProps = {
			expandMode: "flex",
			onTransitionEnd: flexExpander.onTransitionEnd,
		};

	}
	else if (expander)
	{

		body = expander.childrenShouldBeRendered && /*Block.injectProps(*/Values.one(body)/*)*/;

		body = <div ref={expander.wrapperRef} className={clsx("pane-expander flexi relative", props.wrapperCls)} children={body} />;

		expanderProps = {
			expandMode: "height",
			onTransitionEnd: expander.onTransitionEnd,
		};

	}
	else
	{
		body = /*Block.injectProps(*/Values.one(body)/*)*/;
	}



	if (v.debug)
	{
		body = <>
			<DebugBox
				layout={layout!}
				r={PaneRadius.css(v.rtl, v.rtr, v.rbr, v.rbl)}
				bt={v.bt}
				br={v.br}
				bb={v.bb}
				bl={v.bl}
			>
				<div>
					<b>{v.layout}{props.id && ` #${props.id}`}</b>&nbsp; &nbsp;
					<em>b: {v.b}</em>{props.start && " start"}{props.end && " end"}
				</div>
			</DebugBox>
			{body}
		</>;

		addClassName = clsx(addClassName, "m8 pt16");
	}



	body = createPrimitive(
		Root,
		{

			ref: elRef,

			...sizes,

			timeout: props.timeout,
			className: addClassName,

			r: PaneRadius.css(v.rtl, v.rtr, v.rbr, v.rbl),

			...expanderProps,

			children: body,

		} as RootProps,
		props,
		ContainerProps.propNames
	);



	body = <ContainerInfo.Context.Provider
		value={v}
		children={body}
	/>;



	return body;

}






//===






export interface RootProps
{

	expandMode?: "height" | "flex";

	flex?: number | string;

	width?: number | string;
	minWidth?: number | string;
	maxWidth?: number | string;

	height?: number | string;
	minHeight?: number | string;
	maxHeight?: number | string;

	r: string;

	timeout?: number;

}



const rootPropNames: PropNames<RootProps> =
{

	expandMode: true,

	flex: true,

	width: true,
	minWidth: true,
	maxWidth: true,

	height: true,
	minHeight: true,
	maxHeight: true,

	r: true,

	timeout: true,

};




export const Root = styled(
	"div",
	{
		name: "pane-container",
		shouldForwardProp: p => !(rootPropNames as any)[p],
	}
)<RootProps>((props) =>
{

	let timeout = props.timeout || $defaultAnimationDurationMs;


	return {

		position: "relative",
		boxSizing: "border-box",

		flex: props.flex,

		width: props.width,
		minWidth: props.minWidth,
		maxWidth: props.maxWidth,

		height: props.height,
		minHeight: props.minHeight,
		maxHeight: props.maxHeight,

		borderRadius: props.r,

		...props.expandMode === "height" && {
			flex: undefined,
			display: "block",
			willChange: "height",
		},
		...props.expandMode === "flex" && {
			gap: "inherit",
			willChange: "flex",
		},
		transition: `all ease-in-out ${timeout}ms, mask-image 0s, background ${timeout}ms linear, opacity ${timeout}ms linear !important`,

		">.pane-expander": {
			padding: 0,
			margin: 0,
			transition: `all ease-in-out ${timeout}ms, mask-image 0s, background ${timeout}ms linear, opacity ${timeout}ms linear !important`,
		}

	};

});






//===






export interface DebugBoxProps
{

	layout: ContainerLayout;

	r: string;
	bt: PaneBorder;
	br: PaneBorder;
	bb: PaneBorder;
	bl: PaneBorder;

}



const debugPropNames: PropNames<DebugBoxProps> =
{
	layout: true,
	r: true,
	bt: true,
	br: true,
	bb: true,
	bl: true,
};





export const DebugBox = styled(
	"div",
	{
		shouldForwardProp: p => !(debugPropNames as any)[p],
	}
)<DebugBoxProps>((props) =>
{

	let color = props.layout === "row" ? "rgba(30,30,160,.5)" : "rgba(30,100,30,.5)";


	return {

		position: "absolute",
		inset: "-2px",
		overflow: "hidden",

		borderRadius: props.r,
		borderTop: border(props.bt),
		borderRight: border(props.br),
		borderBottom: border(props.bb),
		borderLeft: border(props.bl),

		//zIndex: 1,

		"> div": {

			position: "absolute",
			top: 0,
			left: 0,
			fontSize: "8px",
			padding: "0px 8px 2px 6px",
			background: color,
			color: "white",
			borderBottomRightRadius: 3,

			whiteSpace: "nowrap",

			".gaps": {
				display: "inline-block",
				border: "0px solid white",
				padding: '0 2px',
				margin: `1px 0 1px 8px`,
				fontSize: '8px',
				lineHeight: `10px`,
			},

		}

	};



	function border(b: PaneBorder)
	{

		let style = PaneBorder.styles[b];

		return style ? `${2 * style.width}px solid ${color}` : `1px dotted ${color}`;
	}


});
