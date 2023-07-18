/* eslint-disable react-hooks/rules-of-hooks */
import { styled } from "@mui/material";
import { createContext, ReactNode, useContext, useRef } from "react";
import { createPrimitive, PrimitiveProps } from "../core";
import { BgColor } from "./BgColor";
import { BlockProps } from "./Bock";




export interface ContainerProps extends BlockProps
{

	dense?: boolean;
	denseLeft?: boolean;
	denseRight?: boolean;
	denseTop?: boolean;
	denseBottom?: boolean;

}


const containerPropNames: Array<keyof ContainerProps> = [
	"dense", "denseLeft", "denseRight", "denseTop", "denseBottom",
];




export module Container
{


	//---



	export interface ContainerInfo extends ContainerProps
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
				p !== "flex" &&
				p !== "width" && p !== "minWidth" && p !== "maxWidth" &&
				p !== "height" && p !== "minHeight" && p !== "maxHeight"
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


		for (let prop of containerPropNames)
		{
			if (v[prop] !== v0[prop])
			{
				valueRef.current = v;
				break;
			}
		}


		let body = createPrimitive(
			Root,
			{ className, ...BlockProps.getBoxSizes(parentProps?.dir, props) },
			props,
			containerPropNames, BlockProps.propNames
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
