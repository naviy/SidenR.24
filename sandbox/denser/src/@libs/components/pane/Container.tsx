/* eslint-disable react-hooks/rules-of-hooks */
import { styled } from "@mui/material";
import _ from "lodash";
import React, { createContext, ReactNode, useContext, useRef } from "react";
import { $defaultAnimationDurationMs, createPrimitive, PrimitiveProps } from "../core";
import { mui3 } from "../core/mui3";
import { Block, isBlockElement } from "./Bock";




export interface ContainerProps extends Block.Props
{

	rounded?: boolean;

	//bgcolor?: number | Property.BackgroundColor;
	//boxShadow?: number | Property.BoxShadow;
	e?: mui3.BoxShadow;

	children?: ReactNode;

}


const containerPropNames: Array<keyof (ContainerProps & PrimitiveProps)> = [
	"rounded",
	/*"bgcolor",*/ /*"boxShadow",*/
	"e",
	"flex", "width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight",
	...Block.propNames
];




export module Container
{


	//---



	export interface ContainerInfo 
	{
		dir?: "col" | "row";

		rounded?: boolean;
		brtl?: boolean;
		brtr?: boolean;
		brbl?: boolean;
		brbr?: boolean;

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
		"dir",
		"rounded", "brtl", "brtr", "brbl", "brbr",
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



	export const Root = styled(
		"div",
		{
			shouldForwardProp: p =>
				containerPropNames.indexOf(p as any) < 0
			,
		}
	)<{

		flex?: number | string;

		width?: number | string;
		minWidth?: number | string;
		maxWidth?: number | string;

		height?: number | string;
		minHeight?: number | string;
		maxHeight?: number | string;

		borderRadius?: string;
		e?: mui3.BoxShadow;

	}>((props) => ({


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

		transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,

	}));



	//---



	export function renderProvider(
		dir: ContainerInfo["dir"],
		props: ContainerProps & PrimitiveProps<HTMLDivElement>,
		className: string
	)
	{

		let cprops = use() || {};


		let valueRef = useRef<ContainerInfo | null>();

		if (valueRef.current == null)
		{
			valueRef.current = {};
		}


		let v0 = valueRef.current!;
		let v: ContainerInfo = {};

		v.dir = dir;


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


		let { rounded, start, end } = props;
		let inRow = cprops.dir === "row";
		let inCol = cprops.dir === "col";

		v.brtl = !!(rounded || cprops.brtl && (inRow && start || inCol && start));
		v.brtr = !!(rounded || cprops.brtr && (inRow && end || inCol && start));
		v.brbr = !!(rounded || cprops.brbr && (inRow && end || inCol && end));
		v.brbl = !!(rounded || cprops.brbl && (inRow && start || inCol && end));

		v.p2l = (inCol || start ? cprops.p2l || 0 : 0) + (v.ml && v.ml < 0 ? -v.ml - (v.pl || 0) : 0);
		v.p2r = (inCol || end ? cprops.p2r || 0 : 0) + (v.mr && v.mr < 0 ? -v.mr - (v.pr || 0) : 0);
		v.p2t = (inRow || start ? cprops.p2t || 0 : 0) + (v.mt && v.mt < 0 ? -v.mt - (v.pt || 0) : 0);
		v.p2b = (inRow || end ? cprops.p2b || 0 : 0) + (v.mb && v.mb < 0 ? -v.mb - (v.pb || 0) : 0);


		for (let prop of containerInfoPropNames)
		{
			if (v[prop] !== v0[prop])
			{
				valueRef.current = v;
				break;
			}
		}


		let { children } = props;

		let childrenArr = React.Children.toArray(children);

		let startChild = _.find(childrenArr, isBlockElement);
		let endChild = _.findLast(childrenArr, isBlockElement);


		childrenArr = childrenArr.map(child =>
			(
				child === startChild && startChild.props.start === undefined ||
				child === endChild && endChild.props.end === undefined
			)
				? React.cloneElement(child, {
					start: child === startChild,
					end: child === endChild,
				})
				: child
		);




		let br2 = 12;
		let br0 = 3;

		let borderRadius = [
			v.brtl ? `${br2 + (v.pl || 0)}px` : !cprops.gap && (inRow && !start || inCol && !start) ? "0" : `${br0 + (v.pl || 0)}px`,
			v.brtr ? `${br2 + (v.pr || 0)}px` : !cprops.gap && (inRow && !end || inCol && !start) ? "0" : `${br0 + (v.pr || 0)}px`,
			v.brbr ? `${br2 + (v.pl || 0)}px` : !cprops.gap && (inRow && !end || inCol && !end) ? "0" : `${br0 + (v.pl || 0)}px`,
			v.brbl ? `${br2 + (v.pr || 0)}px` : !cprops.gap && (inRow && !start || inCol && !end) ? "0" : `${br0 + (v.pr || 0)}px`,
		].join(" ");


		let body: ReactNode = createPrimitive(
			Root,
			{
				className,
				borderRadius,
				e: props.e,
				children: childrenArr,
				...Block.getBoxSizes(cprops?.dir, props)
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



	export function Col(props: Omit<ContainerProps, "denseTop" | "denseBottom"> & PrimitiveProps<HTMLDivElement>)
	{
		return renderProvider("col", props, "vflex");
	}



	export function Row(props: Omit<ContainerProps, "denseLeft" | "denseRight"> & PrimitiveProps<HTMLDivElement>)
	{
		return renderProvider("row", props, "flex");
	}



	//---


}
