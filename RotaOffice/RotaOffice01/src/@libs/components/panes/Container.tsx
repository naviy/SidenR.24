import { styled } from "@mui/material/styles";
import clsx from "clsx";
import React, { useRef } from "react";
import { $defaultAnimationDurationMs, PrimitiveProps, UseHookProps, Values, createPrimitive, useNew } from "../core";
import { Expander, ExpanderBehavior, FlexExpanderBehavior } from "../expanders";
import { Block } from "./Block";
import { ContainerInfo } from "./ContainerInfo";
import { ContainerProps, type ContainerLayout } from "./ContainerProps";






//===






export module Container
{


	//---



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



	//---



	export function renderProvider(
		layout: ContainerLayout | undefined,
		props: Partial<ContainerProps> & PrimitiveProps<HTMLDivElement>,
		addClassName?: string
	)
	{

		//_$log(type, props.id)

		props = UseHookProps.use(props);

		let parentInfo = ContainerInfo.use() || {};

		let elRef = useRef<HTMLDivElement>(null);

		//props.id && $log(type, props.id)
		//props.id && _$log("ppx", props.ppx);
		//props.id && _$log("ppx0", props.ppx0);


		let expander: ExpanderBehavior | undefined = undefined;
		let flexExpander: FlexExpanderBehavior | undefined = undefined;
		let preExpanding = false;

		let { isFlex, ...sizes } = Block.getBoxSizes(
			parentInfo.layout,
			props,
		);


		if (props.expanded !== undefined)
		{

			if (isFlex)
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


		let gap = PrimitiveProps.getGap(props);


		let v = ContainerInfo.init(
			props,
			parentInfo,
			{
				layout: props.layout || layout || parentInfo.layout,
				//...PrimitiveProps.getMargins(props),
				...PrimitiveProps.getPaddings(props),
				gap: gap === "inherit" ? parentInfo.gap || 0 : gap || 0,
				preExpanding,
			},
		);


		v = ContainerInfo.build(props, parentInfo, v,);

		v = ContainerInfo.useValue(v, props.id);


		let body = props.children;


		let expanderProps: Partial<RootProps> = {};

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
						{props.rounded && " rounded"}{props.start && " start"}{props.end && " end"}
						<div
							className="gaps"
						//style={{ borderWidth: `${v.gapt ? 2 : .5}px ${v.gapr ? 2 : .5}px ${v.gapb ? 2 : .5}px ${v.gapl ? 2 : .5}px`, }}
						>
							gap: {v.gap}
						</div>
						{v.brtl && ` brtl`}
						{/*{"   radius: " + v.cssBorderRadius}*/}
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

				...Block.sumBoxSizes(sizes, { width: (v.ppl || 0) + (v.ppr || 0), height: (v.ppt || 0) + (v.ppb || 0) }),

				borderRadius: v.cssBorderRadius,

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



	export interface RootProps extends React.HTMLProps<HTMLDivElement>
	{

		expandMode?: "height" | "flex";

		flex?: number | string;

		width?: number | string;
		minWidth?: number | string;
		maxWidth?: number | string;

		height?: number | string;
		minHeight?: number | string;
		maxHeight?: number | string;

		borderRadius?: string;

		timeout?: number;

	}



	export var Root = styled(
		"div",
		{
			name: "pane-container",
			shouldForwardProp: p =>
				p !== "expandMode" &&
				p !== "isFlex" &&
				p !== "flex" &&
				p !== "width" &&
				p !== "minWidth" &&
				p !== "maxWidth" &&
				p !== "height" &&
				p !== "minHeight" &&
				p !== "maxHeight" &&
				p !== "borderRadius" &&
				p !== "timeout"
			,
		}
	)<RootProps>((props) =>
	{

		let timeout = props.timeout || $defaultAnimationDurationMs;


		return {

			position: "relative",
			boxSizing: "border-box",

			flex: props.flex,

			borderRadius: props.borderRadius || "0",

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



	//---


}
