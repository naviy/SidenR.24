import { isValidElement, ReactElement } from "react";
import { PrimitiveProps } from "../core";
import { BgColor as PaneBgColor } from "./BgColor";




//===




export module Block
{


	//---



	export interface Props extends PrimitiveProps<HTMLDivElement>
	{

		bgcolor?: PaneBgColor;
		borderRadius?: number | boolean;
		borderWidth?: number | boolean;

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
		"bgcolor", "borderRadius", "borderWidth",
		"start", "end",
		"l", "min", "max", "width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight",
	];



	export function getBoxSizes(dir: "col" | "row" | undefined, props: Props)
	{

		let { l, min, max, width, minWidth, maxWidth, height, minHeight, maxHeight, } = props;

		let isRow = dir === "row";
		let isCol = dir === "col";


		width = (
			isCol ? width :
				min === true ? undefined :
					max === true ? '100%' :
						width === undefined ? l :
							width
		);

		height = (
			isRow ? height :
				min === true ? undefined :
					max === true ? '100%' :
						height === undefined ? l :
							height
		);

		let flex = (isRow
			? min === true ? undefined : typeof width === "string" ? `0 0 ${width}` : !width ? 1 : width > 0 && width <= 24 ? width : `0 0 ${Math.abs(width)}px`
			: min === true ? undefined : typeof height === "string" ? `0 0 ${height}` : !height ? 1 : height > 0 && height <= 24 ? height : `0 0 ${Math.abs(height)}px`
		);

		width = typeof width === "string" || !width || width > 24 ? width : width < 0 ? -width : undefined;
		height = typeof height === "string" || !height || height > 24 ? height : height < 0 ? -height : undefined;

		minWidth = isCol || minWidth !== undefined ? minWidth : min === true ? undefined : min;
		maxWidth = isCol || maxWidth !== undefined ? maxWidth : max === true ? undefined : max;
		minHeight = isCol || minHeight !== undefined ? minHeight : min === true ? undefined : min;
		maxHeight = isCol || maxHeight !== undefined ? maxHeight : max === true ? undefined : max;


		return {
			flex,
			width, minWidth, maxWidth,
			height, minHeight, maxHeight,
		};

	}



	//---


}



//---



export function isBlockElement<P>(obj: {} | null | undefined): obj is ReactElement<P>
{
	return (
		isValidElement<P>(obj) && typeof obj.type === "function" &&
		(obj.type.name === "Col" || obj.type.name === "Row" || obj.type.name === "Pane")
	);
}
