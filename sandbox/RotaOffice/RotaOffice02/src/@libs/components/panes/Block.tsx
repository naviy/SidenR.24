export module Block
{


	//---



	export const bigBorderRadius = 12;
	export const smallBorderRadius = 3;



	//---



	export interface Props 
	{

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



	export const propNames: PropNames<Props> =
	{

		start: true,
		end: true,

		l: true,
		min: true,
		max: true,
		width: true,
		minWidth: true,
		maxWidth: true,
		height: true,
		minHeight: true,
		maxHeight: true,

	} as const;



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
		layout: "row" | "col",
		props: Props,
	): BoxSizes
	{

		let { l, min, max, width, minWidth, maxWidth, height, minHeight, maxHeight, } = props;

		let inRow = layout === "row";
		let inCol = layout === "col";


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


}
