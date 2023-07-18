import { PrimitiveProps } from "../core";
import { BgColor as PaneBgColor } from "./BgColor";




//===




export interface BlockProps extends PrimitiveProps<HTMLDivElement>
{

	bgcolor?: PaneBgColor | undefined;
	borderRadius?: number | boolean | undefined;
	borderWidth?: number | boolean | undefined;

	l?: number | string | undefined;
	min?: number | string | true | undefined;
	max?: number | string | true | undefined;

	width?: number | string | undefined;
	minWidth?: number | string | undefined;
	maxWidth?: number | string | undefined;

	height?: number | string | undefined;
	minHeight?: number | string | undefined;
	maxHeight?: number | string | undefined;

}


export module BlockProps
{


	//---



	export const propNames: Array<keyof BlockProps> = [
		"bgcolor", "borderRadius", "borderWidth",
		"l", "min", "max", "width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight",
	];



	export function getBoxSizes(dir: "col" | "row" | undefined, props: BlockProps)
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
