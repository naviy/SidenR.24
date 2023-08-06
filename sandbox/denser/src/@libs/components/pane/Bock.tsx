import _ from "lodash";
import React, { ReactNode } from "react";
import { isValidElement, ReactElement } from "react";
import { BgColor as PaneBgColor } from "./BgColor";




//===




export module Block
{


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



	export function getBoxSizes(
		containerType: "row" | "col" | undefined,
		props: Props,
		addSizes?: { width: number; height: number; }
	)
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


		if (addSizes)
		{
			if (typeof width === "number")
				width += addSizes.width;
			if (typeof maxWidth === "number")
				maxWidth += addSizes.width;
			if (typeof height === "number")
				height += addSizes.height;
			if (typeof maxHeight === "number")
				maxHeight += addSizes.height;
		}


		let flex = (inRow
			? min === true ? undefined : typeof width === "string" ? `0 0 ${width}` : !width ? 1 : width > 0 && width <= 24 ? width : `0 0 ${Math.abs(width)}px`
			: min === true ? undefined : typeof height === "string" ? `0 0 ${height}` : !height ? 1 : height > 0 && height <= 24 ? height : `0 0 ${Math.abs(height)}px`
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
		};

	}



	//---



	export function withAutoProps(children: ReactNode): ReactNode
	{

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


		return childrenArr;

	}



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
