import { styled } from "@mui/material";
import React, { createContext, ReactNode, useContext, useRef } from "react";
import { $defaultAnimationDurationMs, $log, createPrimitive, PrimitiveProps, UseHookProps, useNew, Values } from "../core";
import { mui3 } from "../core/mui3";
import { Block } from "./Block";
import { Expander, ExpanderBaseProps, FlexExpanderBehavior } from "../expanders";
import clsx from "clsx";






//===






export module Container
{

	//---



	export interface Props extends Block.Props, ExpanderBaseProps, UseHookProps<Props>
	{

		rounded?: boolean;

		e?: mui3.BoxShadow;

		wrapperCls?: string | null;

		children?: ReactNode;

	}


	const containerPropNames: Array<keyof (Props & PrimitiveProps)> = [
		"rounded",
		"e",
		"wrapperCls",
		...Block.propNames,
		...ExpanderBaseProps.propNames,
		...UseHookProps.propNames,
	];



	//---



	export interface ContainerInfo 
	{
		type?: "row" | "col";

		rounded?: boolean;

		brtl?: boolean;
		brtr?: boolean;
		brbl?: boolean;
		brbr?: boolean;
		cssBorderRadius?: string;

		ml?: number;
		mr?: number;
		mt?: number;
		mb?: number;

		pl?: number;
		pr?: number;
		pt?: number;
		pb?: number;

		p2l?: number;
		p2r?: number;
		p2t?: number;
		p2b?: number;

		gap?: number;

	}


	const containerInfoPropNames: Array<keyof ContainerInfo> = [
		"type",
		"rounded", "brtl", "brtr", "brbl", "brbr", "cssBorderRadius",
		"ml", "mr", "mt", "mb",
		"pl", "pr", "pt", "pb",
		"p2l", "p2r", "p2t", "p2b",
		"gap",
	];


	export const Context = createContext<ContainerInfo | null>(null);


	export function use(): ContainerInfo | null
	{
		return useContext(Container.Context);
	}



	//---



	//export function Host(props: Props & PrimitiveProps<HTMLDivElement>)
	//{
	//	return renderProvider(undefined, props);
	//}


	export interface DivProps extends Props, PrimitiveProps<HTMLDivElement> { }
	export interface ColProps extends Props, PrimitiveProps<HTMLDivElement> { }
	export interface RowProps extends Props, PrimitiveProps<HTMLDivElement> { }


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
		props: Partial<Props> & PrimitiveProps<HTMLDivElement>,
		className?: string
	)
	{

		props = UseHookProps.use(props);

		let cprops = use() || {};


		let valueRef = useRef<ContainerInfo | null>();

		if (valueRef.current == null)
		{
			valueRef.current = {};
		}


		let { rounded, start, end } = props;
		let inRow = cprops.type === "row";
		let inCol = cprops.type === "col";


		let v0 = valueRef.current!;
		let v: ContainerInfo = {};

		v.type = type ?? cprops.type;


		let ms = PrimitiveProps.getMargins(props);
		let ps = PrimitiveProps.getPaddings(props);

		v.ml = ms.ml;
		v.mr = ms.mr;
		v.mt = ms.mt;
		v.mb = ms.mb;

		v.pl = ps.pl;
		v.pr = ps.pr;
		v.pt = ps.pt;
		v.pb = ps.pb;

		let gap = PrimitiveProps.getGap(props);

		v.gap = gap === "inherit" ? cprops.gap || 0 : gap || 0;

		v.p2l = (inCol || start ? cprops.p2l || 0 : 0) + (v.ml && v.ml < 0 ? -v.ml - (v.pl || 0) : 0);
		v.p2r = (inCol || end ? cprops.p2r || 0 : 0) + (v.mr && v.mr < 0 ? -v.mr - (v.pr || 0) : 0);
		v.p2t = (inRow || start ? cprops.p2t || 0 : 0) + (v.mt && v.mt < 0 ? -v.mt - (v.pt || 0) : 0);
		v.p2b = (inRow || end ? cprops.p2b || 0 : 0) + (v.mb && v.mb < 0 ? -v.mb - (v.pb || 0) : 0);

		let sizes = Block.getBoxSizes(
			cprops.type,
			props,
			{ width: v.p2l + v.p2r, height: v.p2t + v.p2b }
		);


		v.brtl = !!(rounded || cprops.brtl && (inRow && start || inCol && start));
		v.brtr = !!(rounded || cprops.brtr && (inRow && end || inCol && start));
		v.brbr = !!(rounded || cprops.brbr && (inRow && end || inCol && end));
		v.brbl = !!(rounded || cprops.brbl && (inRow && start || inCol && end));

		let br2 = 12;
		let br0 = 3;

		v.cssBorderRadius = [
			v.brtl ? `${br2 + (v.pl || 0)}px` : !cprops.gap && (inRow && !start || inCol && !start) ? "0" : `${br0 + (v.pl || 0)}px`,
			v.brtr ? `${br2 + (v.pr || 0)}px` : !cprops.gap && (inRow && !end || inCol && !start) ? "0" : `${br0 + (v.pr || 0)}px`,
			v.brbr ? `${br2 + (v.pl || 0)}px` : !cprops.gap && (inRow && !end || inCol && !end) ? "0" : `${br0 + (v.pl || 0)}px`,
			v.brbl ? `${br2 + (v.pr || 0)}px` : !cprops.gap && (inRow && !start || inCol && !end) ? "0" : `${br0 + (v.pr || 0)}px`,
		].join(" ");



		for (let prop of containerInfoPropNames)
		{
			if (v[prop] !== v0[prop])
			{
				valueRef.current = v;
				break;
			}
		}



		let body = props.children;



		let elRef = useRef<HTMLDivElement>(null);

		let expanderProps: Partial<RootProps> = {};


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



		body = createPrimitive(
			Root,
			{

				ref: elRef,
				className,

				...sizes,

				borderRadius: v.cssBorderRadius,
				e: props.e,
				timeout: props.timeout,

				...expanderProps,

				children: Block.withAutoProps(body),

			},
			props,
			containerPropNames
		);



		body = <Context.Provider
			value={valueRef.current!}
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
