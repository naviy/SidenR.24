import { styled } from "@mui/material";
import clsx from "clsx";
import React, { useRef } from "react";
import { $defaultAnimationDurationMs, createPrimitive, PrimitiveProps, UseHookProps, useNew, Values } from "../core";
import { mui3 } from "../core/mui3";
import { Expander, FlexExpanderBehavior } from "../expanders";
import { Block } from "./Block";
import { ContainerInfo } from "./ContainerInfo";
import { ContainerProps } from "./ContainerProps";






//===






export module Container
{

	//---



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



	//---



	export function renderProvider(
		type: undefined | "row" | "col",
		props: Partial<ContainerProps> & PrimitiveProps<HTMLDivElement>,
		addClassName?: string
	)
	{

		props = UseHookProps.use(props);

		let parentInfo = ContainerInfo.use() || {};


		let gap = PrimitiveProps.getGap(props);

		let v = ContainerInfo.useValue(
			ContainerInfo.build(
				props,
				parentInfo,
				{
					type: type ?? parentInfo.type,
					...PrimitiveProps.getMargins(props),
					...PrimitiveProps.getPaddings(props),
					gap: gap === "inherit" ? parentInfo.gap || 0 : gap || 0,
				},
			)
		);



		let body = renderRoot(props, parentInfo, v, addClassName);


		body = <ContainerInfo.Context.Provider
			value={v}
			children={body}
		/>;



		return body;

	}



	//---



	function renderRoot(
		props: ContainerProps,
		parentInfo: ContainerInfo,
		v: ContainerInfo,
		addClassName?: string,
	)
	{

		let body = props.children;


		let elRef = useRef<HTMLDivElement>(null);

		let expanderProps: Partial<RootProps> = {};


		let sizes = Block.getBoxSizes(
			parentInfo.type,
			props,
			{ width: v.p2l! + v.p2r!, height: v.p2t! + v.p2b! }
		);


		if (props.expanded !== undefined)
		{

			if (sizes.isFlex)
			{

				let bhv = useNew(FlexExpanderBehavior).use(elRef, sizes.flex, props);

				body = bhv.childrenShouldBeRendered && Block.withAutoProps(Values.one(body));

				expanderProps = {
					expandMode: "flex",
					onTransitionEnd: bhv.onTransitionEnd,
				};

			}
			else
			{

				let bhv = useNew(Expander.Behavior).use(elRef, null, props);

				body = bhv.childrenShouldBeRendered && Block.withAutoProps(Values.one(body));

				body = <div ref={bhv.wrapperRef} className={clsx("flexi", props.wrapperCls)} children={body} />;

				expanderProps = {
					expandMode: "height",
					onTransitionEnd: bhv.onTransitionEnd,
				};

			}

		}
		else
		{
			body = Block.withAutoProps(Values.one(body));
		}



		return createPrimitive(
			Root,
			{

				ref: elRef,

				...sizes,

				borderRadius: v.cssBorderRadius,

				e: props.e,
				timeout: props.timeout,
				className: addClassName,

				...expanderProps,

				children: Block.withAutoProps(body),

			},
			props,
			ContainerProps.propNames
		);


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
		e?: mui3.BoxShadow;

		timeout?: number;

	}



	export const Root = styled(
		"div",
		{
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
				p !== "e" &&
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

			background: props.e == null ? "none" : mui3.Elevation.light[props.e].background,
			boxShadow: props.e == null ? "none" : mui3.Elevation.light[props.e].boxShadow,

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

		};
	});



	//---

}
