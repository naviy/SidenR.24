/* eslint-disable react-hooks/rules-of-hooks */
import { styled } from "@mui/material";
import React from "react";
import { createContext, useContext, useRef } from "react";
import { $log, createPrimitive } from "../core";
import { Block, isBlockElement } from "./Bock";




export interface ContainerProps extends Block.Props
{

	rounded?: boolean;

	dense?: boolean;
	denseLeft?: boolean;
	denseRight?: boolean;
	denseTop?: boolean;
	denseBottom?: boolean;

}


const containerPropNames: Array<keyof ContainerProps> = [
	"rounded",
	"dense", "denseLeft", "denseRight", "denseTop", "denseBottom",
	...Block.propNames
];




export module Container
{


	//---



	export interface ContainerInfo extends ContainerProps //Omit<ContainerProps, 'start' | 'end'>
	{
		dir?: "col" | "row";
	}



	export const Context = createContext<ContainerInfo | null>(null);


	export function use()
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

	}>((props) => ({


		boxSizing: 'border-box',

		flex: props.flex,

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
		props: ContainerProps,
		className: string
	)
	{

		let parentProps = use();


		let valueRef = useRef<ContainerInfo | null>();

		if (valueRef.current == null)
		{
			valueRef.current = { dir };
		}


		let v0 = valueRef.current;
		let v: ContainerInfo = { dir };

		function appendContainerProps(props: ContainerProps)
		{
			for (let prop of containerPropNames)
			{
				if (props[prop] !== undefined)
				{
					(v as any)[prop] = props[prop];
				}
			}
		}


		parentProps && appendContainerProps(parentProps);
		appendContainerProps(props);

		v.start = props.start;
		v.end = props.end;

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


		for (let prop of containerPropNames)
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


		let body = createPrimitive(
			Root,
			{
				className, children,
				...Block.getBoxSizes(parentProps?.dir, props)
			},
			props,
			containerPropNames
		);


		body = <Context.Provider
			value={valueRef.current}
			children={body}
		/>;


		return body;

	}



	//---



	export function Col(props: Omit<ContainerProps, "denseTop" | "denseBottom">)
	{
		return renderProvider("col", props, "vflex");
	}



	export function Row(props: Omit<ContainerProps, "denseLeft" | "denseRight">)
	{
		return renderProvider("row", props, "flex");
	}



	//---


}
