import { Box, styled } from "@mui/material";
import clsx from "clsx";
import React, { useRef } from "react";
import { $defaultAnimationDurationMs, PrimitiveProps, UseHookProps, Values, createPrimitive, useNew } from "../core";
import { mui3 } from "../core/mui3";
import { Expander, ExpanderBehavior, FlexExpanderBehavior } from "../expanders";
import { Block } from "./Block";
import { ContainerInfo } from "./ContainerInfo";
import { ContainerProps } from "./ContainerProps";






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
		type: undefined | "row" | "col",
		props: Partial<ContainerProps> & PrimitiveProps<HTMLDivElement>,
		addClassName?: string
	)
	{

		props = UseHookProps.use(props);

		let parentInfo = ContainerInfo.use() || {};

		let elRef = useRef<HTMLDivElement>(null);


		//props.id && $log(type, props.id)
		//props.id && _$log("ppx", props.ppx);
		//props.id && _$log("ppx0", props.ppx0);
		

		let expander: ExpanderBehavior | undefined = undefined;
		let flexExpander: FlexExpanderBehavior | undefined = undefined;
		let preExpanding = false;

		let sizes = Block.getBoxSizes(
			parentInfo.type,
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


		let gap = PrimitiveProps.getGap(props);


		let v = ContainerInfo.init(
			props,
			parentInfo,
			{
				type: type ?? parentInfo.type,
				//...PrimitiveProps.getMargins(props),
				...PrimitiveProps.getPaddings(props),
				gap: gap === "inherit" ? parentInfo.gap || 0 : gap || 0,
				preExpanding,
			},
		);


		//if (props.props)
		//{
		//	let v2 = props.props(v);
		//	if (v2)
		//		props = { ...props, ...v2 };
		//}

		v = ContainerInfo.build(props, parentInfo, v,);

		v = ContainerInfo.useValue(v);






		let body = props.children;


		let expanderProps: Partial<RootProps> = {};

		if (flexExpander)
		{

			body = flexExpander.childrenShouldBeRendered && Block.withAutoProps(Values.one(body));

			expanderProps = {
				expandMode: "flex",
				onTransitionEnd: flexExpander.onTransitionEnd,
			};

		}
		else if (expander)
		{

			body = expander.childrenShouldBeRendered && Block.withAutoProps(Values.one(body));

			body = <div ref={expander.wrapperRef} className={clsx("flexi", props.wrapperCls)} children={body} />;

			expanderProps = {
				expandMode: "height",
				onTransitionEnd: expander.onTransitionEnd,
			};

		}
		else
		{
			body = Block.withAutoProps(Values.one(body));
		}



		if (v.debug)
		{

			let isRow = v.type === "row";

			let color = isRow ? "rgba(30,30,160, .5)" : "rgba(30,100,30, .5)";

			body = <>
				<Box sx={{
					position: "absolute",
					inset: "0 0 0 0",
					overflow: "hidden",
					border: `2px solid ${color}`,
					borderRadius: "inherit",
					zIndex: 1
				}}>
					<Box sx={{
						position: "absolute",
						top: 0,
						left: 0,
						fontSize: "8px",
						padding: "0px 8px 2px 6px",
						background: color,
						color: "white",
						whiteSpace: "nowrap",
					}}>
						<b>{v.type}{props.id && ` #${props.id}`}</b>{props.start && " start"}{props.end && " end"}
					</Box>
				</Box>
				{body}
			</>;

			addClassName = clsx(addClassName, "m4 pt16")

		}



		body = createPrimitive(
			Root,
			{

				ref: elRef,

				...Block.sumBoxSizes(sizes, { width: (v.ppl || 0) + (v.ppr || 0), height: (v.ppt || 0) + (v.ppb || 0) }),

				borderRadius: v.cssBorderRadius,

				e: props.e,
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
