/* eslint-disable react-hooks/rules-of-hooks */
import { styled } from "@mui/material";
import React, { createContext, ReactNode, useContext, useRef } from "react";
import { $log, createPrimitive, PrimitiveClassesProps, PrimitiveProps } from "../core";
import { mui3 } from "../core/mui3";
import { Block, isBlockElement } from "./Bock";




export interface ContainerProps extends Block.Props
{

	rounded?: boolean;

	dense?: boolean;
	denseLeft?: boolean;
	denseRight?: boolean;
	denseTop?: boolean;
	denseBottom?: boolean;

	//bgcolor?: number | Property.BackgroundColor;
	//boxShadow?: number | Property.BoxShadow;
	e?: mui3.BoxShadow;

	children?: ReactNode;

}


const containerPropNames: Array<keyof ContainerProps> = [
	"rounded",
	"dense", "denseLeft", "denseRight", "denseTop", "denseBottom",
	/*"bgcolor",*/ /*"boxShadow",*/
	"e",
	...Block.propNames
];




export module Container
{


	//---



	export interface ContainerInfo extends ContainerProps
	{
		dir?: "col" | "row";
		gap?: number;

		ml?: number;
		mr?: number;
		mt?: number;
		mb?: number;

		pl?: number;
		pr?: number;
		pt?: number;
		pb?: number;

	}


	const containerInfoPropNames: Array<keyof ContainerInfo> = [
		"dir",
		"gap",
		"ml", "mr", "mt", "mb",
		"pl", "pr", "pt", "pb",
		...containerPropNames
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

		borderRadius?: number;
		e?: mui3.BoxShadow;

	}>((props) => ({


		boxSizing: "border-box",

		flex: props.flex,

		borderRadius: props.borderRadius || "0",

		background: props.e == null ? "none" : mui3.Elevation[props.e].background,
		boxShadow: props.e == null ? "none" : mui3.Elevation[props.e].boxShadow,

		width: props.width,
		minWidth: props.minWidth,
		maxWidth: props.maxWidth,

		height: props.height,
		minHeight: props.minHeight,
		maxHeight: props.maxHeight,

	}));



	//---



	export function renderProvider(
		dir: ContainerInfo["dir"],
		props: ContainerProps & PrimitiveProps<HTMLDivElement>,
		className: string
	)
	{

		let parentProps = use();


		let valueRef = useRef<ContainerInfo | null>();

		if (valueRef.current == null)
		{
			valueRef.current = {};
		}


		let v0 = valueRef.current!;
		let v: ContainerInfo = {};

		function appendContainerProps(props: ContainerInfo)
		{
			for (let prop of containerInfoPropNames)
			{
				if (props[prop] !== undefined)
				{
					(v as any)[prop] = props[prop];
				}
			}
		}


		parentProps && appendContainerProps(parentProps);
		appendContainerProps(props);

		v.dir = dir;
		v.start = props.start;
		v.end = props.end;


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

		v.gap = gap === "inherit" ? parentProps?.gap || 0 : gap || 0;


		if (parentProps?.rounded)
		{

			if (v.denseLeft === undefined && parentProps.dir === "row" && !v.start)
				v.denseLeft = true;

			if (v.denseRight === undefined && parentProps.dir === "row" && !v.end)
				v.denseRight = true;

			if (v.denseTop === undefined && parentProps.dir === "col" && !v.start)
				v.denseTop = true;

			if (v.denseBottom === undefined && parentProps.dir === "col" && !v.end)
				v.denseBottom = true;

		}



		for (let prop of containerInfoPropNames)
		{
			if (v[prop] !== v0[prop])
			{
				valueRef.current = v;
				break;
			}
		}


		let { children } = props;

		let childrenCount = React.Children.count(children);

		children = React.Children.map(children, (child, index) =>
		{
			if (isBlockElement(child) && (
				index === 0 && child.props.start === undefined ||
				index === childrenCount - 1 && child.props.end === undefined
			))
			{
				//$log('child:', child.props.children);
				return React.cloneElement(
					child,
					{
						...index === 0 && { start: true },
						...index === childrenCount - 1 && { end: true },
					}
				);
			}

			return child;
		});


		let p = ps.p || 0;
		let borderRadius = props.rounded ? 12 + p : 3 + p;


		let body: ReactNode = createPrimitive(
			Root,
			{
				className,
				borderRadius,
				e: props.e,
				children,
				...Block.getBoxSizes(parentProps?.dir, props)
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
