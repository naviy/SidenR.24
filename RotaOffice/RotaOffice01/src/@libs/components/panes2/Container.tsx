import { styled } from "@mui/material/styles";
import clsx from "clsx";
import React, { useRef, type ReactNode } from "react";
import { $defaultAnimationDurationMs, PrimitiveProps, UseHookProps, Values, createPrimitive, useNew } from "../core";
import { Expander, ExpanderBaseProps, ExpanderBehavior, FlexExpanderBehavior } from "../expanders";
import { Block } from "./Block";
import { ContainerInfo } from "./ContainerInfo";
import { ContainerProps, type ContainerLayout } from "./ContainerProps";






//===






export interface DivProps extends ContainerProps, PrimitiveProps<HTMLDivElement> { }
export interface ColProps extends ContainerProps, PrimitiveProps<HTMLDivElement> { }
export interface RowProps extends ContainerProps, PrimitiveProps<HTMLDivElement> { }


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

export function Provider(props: ContainerProps & { children?: ReactNode })
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






export function renderProvider(
	layout: ContainerLayout | null | undefined,
	props: Partial<ContainerProps> & PrimitiveProps<HTMLDivElement> & ExpanderBaseProps & UseHookProps<Partial<ContainerProps> & PrimitiveProps<HTMLDivElement> & ExpanderBaseProps>,
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
			<DebugBox layout={layout!}>
				<div>
					<b>{v.layout}{props.id && ` #${props.id}`}</b>&nbsp; &nbsp;
					{props.start && " start"}{props.end && " end"}
				</div>
			</DebugBox>
			{body}
		</>;

		addClassName = clsx(addClassName, "m4 pt16");
	}



	body = createPrimitive(
		Root,
		{

			ref: elRef,

			...sizes,

			timeout: props.timeout,
			className: addClassName,

			...expanderProps,

			children: body,

		},
		props,
		ContainerProps.propNames
	);




	body = <ContainerInfo.Context.Provider
		value={v}
		children={body}
	/>;



	return body;

}



//---



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

	timeout?: number;

}





const rootPropNames: Record<keyof RootProps, true> =
{

	expandMode: true,

	flex: true,

	width: true,
	minWidth: true,
	maxWidth: true,

	height: true,
	minHeight: true,
	maxHeight: true,

	timeout: true,

};



export var Root = styled(
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



export var DebugBox = styled(
	"div",
	{ shouldForwardProp: p => p !== "layout", }
)<{
	layout: ContainerLayout
}>(({ layout }) =>
{

	let color = layout === "row" ? "rgba(30,30,160, .5)" : "rgba(30,100,30, .5)";

	return {
		position: "absolute",
		inset: "-1px",
		overflow: "hidden",
		border: `2px solid ${color}`,
		borderRadius: "inherit",
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

});
