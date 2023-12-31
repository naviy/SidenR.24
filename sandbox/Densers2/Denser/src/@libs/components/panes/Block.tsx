import _ from "lodash";
import React, { isValidElement, type ReactElement, type ReactNode } from "react";
import type { BgColor as PaneBgColor } from "./BgColor";




//===




export module Block
{


	//---



	export const bigBorderRadius = 12;
	export const smallBorderRadius = 3;



	//---


	export interface Props 
	{

		bgcolor?: PaneBgColor;

		start?: boolean;
		end?: boolean;

		l?: number | string;
		min?: number | string | true;
		max?: number | string | true;

		width?: number | string;
		minWidth?: number | string;
		maxWidth?: number | string;

		height?: number | string;
		minHeight?: number | string;
		maxHeight?: number | string;

	}



	//---



	export const propNames: Array<keyof Props> = [
		"bgcolor",
		"start", "end",
		"l", "min", "max", "width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight",
	];



	//---



	export interface BoxSizes
	{

		flex?: string | number;

		width?: string | number;
		minWidth?: string | number;
		maxWidth?: string | number;
		height?: string | number;
		minHeight?: string | number;
		maxHeight?: string | number;

		isFlex?: boolean;

	}


	export function getBoxSizes(
		containerType: "row" | "col" | undefined,
		props: Props,
		//addSizes?: { width: number; height: number; }
	): BoxSizes
	{

		let { l, min, max, width, minWidth, maxWidth, height, minHeight, maxHeight, } = props;

		let inRow = containerType === "row";
		let inCol = containerType === "col";


		width = (
			inCol ? width :
				min === true ? undefined :
					max === true ? '100%' :
						width === undefined ? l :
							width
		);

		height = (
			inRow ? height :
				min === true ? undefined :
					max === true ? '100%' :
						height === undefined ? l :
							height
		);


		//if (addSizes)
		//{
		//	if (typeof width === "number")
		//		width += addSizes.width;
		//	if (typeof maxWidth === "number")
		//		maxWidth += addSizes.width;
		//	if (typeof height === "number")
		//		height += addSizes.height;
		//	if (typeof maxHeight === "number")
		//		maxHeight += addSizes.height;
		//}


		let flex = (inRow
			? min === true ? undefined : typeof width === "string" ? `0 0 ${width}` : !width ? 1 : width > 0 && width <= 24 ? width : `0 0 ${Math.abs(width)}px`
			: min === true ? undefined : typeof height === "string" ? `0 0 ${height}` : !height ? 1 : height > 0 && height <= 24 ? height : `0 0 ${Math.abs(height)}px`
		);

		let isFlex = (inRow
			? typeof width === "number" && width > 0 && width <= 24
			: typeof height === "number" && height > 0 && height <= 24
		);

		width = typeof width === "string" || !width || width > 24 ? width : width < 0 ? -width : undefined;
		height = typeof height === "string" || !height || height > 24 ? height : height < 0 ? -height : undefined;

		minWidth = inCol || minWidth !== undefined ? minWidth : min === true ? undefined : min;
		maxWidth = inCol || maxWidth !== undefined ? maxWidth : max === true ? undefined : max;
		minHeight = inCol || minHeight !== undefined ? minHeight : min === true ? undefined : min;
		maxHeight = inCol || maxHeight !== undefined ? maxHeight : max === true ? undefined : max;


		return {

			flex,

			width, minWidth, maxWidth,
			height, minHeight, maxHeight,

			isFlex,

		};

	}



	export function sumBoxSizes(sizes: BoxSizes, addSizes: { width: number; height: number; }): BoxSizes
	{

		return {
			...sizes,
			width: sum(sizes.width, addSizes.width),
			maxWidth: sum(sizes.maxWidth, addSizes.width),
			height: sum(sizes.height, addSizes.height),
			maxHeight: sum(sizes.maxHeight, addSizes.height),
		};


		function sum(x: string | number | undefined, y: number): string | number | undefined
		{
			if (typeof x === "number")
				return x + y;
			else if (typeof x === "string")
				return `calc(${x} + ${y})`;
			else if (x !== undefined && y)
				return y;
			else
				return undefined;
		}

	}



	//---



	export function injectProps(children: ReactNode): ReactNode
	{

		let childrenArr = flattenChildren(children);


		let startChild = _.find(childrenArr, isBlockElement) as ReactElement<Block.Props> | undefined;
		let endChild = _.findLast(childrenArr, isBlockElement) as ReactElement<Block.Props> | undefined;

		if (startChild?.props.start !== undefined)
			startChild = undefined;

		if (endChild?.props.end !== undefined)
			endChild = undefined;


		if (!startChild && !endChild)
		{
			return children;
		}


		childrenArr = childrenArr.map(child =>
			child === startChild || child === endChild
				? React.cloneElement(child as any, {
					...child === startChild && { start: true },
					...child === endChild && { end: true },
				})
				: child
		);


		return childrenArr;

	}


	//export function injectProps(children: ReactNode): ReactNode
	//{

	//	let childrenArr = flattenChildren(children);


	//	let startChild = _.find(childrenArr, isBlockElement) as ReactElement<Block.Props>;
	//	let endChild = _.findLast(childrenArr, isBlockElement) as ReactElement<Block.Props>;


	//	childrenArr = childrenArr.map(child =>
	//		(
	//			elementEqualBlockElements(child, startChild) && child.props.start === undefined ||
	//			elementEqualBlockElements(child, endChild) && child.props.end === undefined
	//		)
	//			? React.cloneElement(child, {
	//				...elementEqualBlockElements(child, startChild) && child.props.start === undefined && { start: true },
	//				...elementEqualBlockElements(child, endChild) && child.props.end === undefined && { end: true },
	//			})
	//			: child
	//	);


	//	return childrenArr;

	//}



	//---


}



//---



export function isBlockElement<P>(obj: {} | null | undefined): obj is ReactElement<P & Block.Props>
{
	return (
		isValidElement<P>(obj) && typeof obj.type === "function" &&
		(obj.type.name === "Col" || obj.type.name === "Row" || obj.type.name === "Pane")
	);
}



//export function elementEqualBlockElements(
//	el: {} | null | undefined,
//	block: ReactElement<Block.Props>
//): el is ReactElement<Block.Props>
//{
//	return el === block;
//}



function flattenChildren(children: ReactNode)
{

	const result: ReactNode[] = [];

	let index = 0;


	append(children);


	return result;



	function append(children: ReactNode)
	{

		React.Children.forEach(children, child =>
		{
			if (React.isValidElement(child))
			{
				if (child.type === React.Fragment)
				{
					append(child.props.children);
				}
				else
				{
					result.push(
						React.cloneElement(child, { key: `.${index++}-.${child.key}` })
					);
				}
			}
			else
			{
				index++;
				result.push(child);
			}
		});

	}

}