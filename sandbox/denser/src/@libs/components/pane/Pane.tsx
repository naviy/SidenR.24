import { styled } from "@mui/material";
import { ReactNode } from "react";

import { createPrimitive, PrimitiveProps } from "../core";
import { BgColor as PaneBgColor } from "./BgColor";
import { Container } from "./Container";




//===




export interface PaneProps extends PrimitiveProps<HTMLDivElement>
{

	className?: string;

	start?: boolean | undefined;
	end?: boolean | undefined;

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

	children?: ReactNode;

}


const panePropNames: Array<keyof PaneProps> = [
	"start", "end",
	"bgcolor", "borderRadius", "borderWidth",
	"l", "min", "max", "width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight",
	//'model', 'ff', 'g', 's', 'w', 'min', 'max',
];




export function Pane(props: PaneProps)
{


	let cprops = Container.use() || {};

	let { dense, denseLeft, denseRight, denseTop, denseBottom, } = cprops;

	let isRow = cprops.dir === "row";
	let isCol = cprops.dir === "col";


	let { start, end, l, min, max, width, minWidth, maxWidth, height, minHeight, maxHeight, } = props;


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
		? typeof width === "string" ? `0 0 ${width}` : !width ? 1 : width > 0 && width <= 24 ? width : `0 0 ${Math.abs(width)}px`
		: typeof height === "string" ? `0 0 ${height}` : !height ? 1 : height > 0 && height <= 24 ? height : `0 0 ${Math.abs(height)}px`
	);

	width = typeof width === "string" || !width || width > 24 ? width : width < 0 ? -width : undefined;
	height = typeof height === "string" || !height || height > 24 ? height : height < 0 ? -height : undefined;

	minWidth = isCol || minWidth !== undefined ? minWidth : min === true ? undefined : min;
	maxWidth = isCol || maxWidth !== undefined ? maxWidth : max === true ? undefined : max;
	minHeight = isCol || minHeight !== undefined ? minHeight : min === true ? undefined : min;
	maxHeight = isCol || maxHeight !== undefined ? maxHeight : max === true ? undefined : max;


	let br = props.borderRadius !== undefined ? props.borderRadius : cprops.borderRadius;
	let br2 = br === true || br === undefined ? "12px" : br === false || br === null ? "0" : `${br}px`;

	let borderRadius = ([
		start && !denseLeft && !denseTop && !dense ? br2 : "0",
		(isRow && end || isCol && start) && !denseRight && !denseTop && !dense ? br2 : "0",
		end && !denseRight && !denseBottom && !dense ? br2 : "0",
		(isRow && start || isCol && end) && !denseLeft && !denseBottom && !dense ? br2 : "0",
	].join(" "));


	let bw = props.borderWidth !== undefined ? props.borderWidth : cprops.borderWidth;
	let bw2 = bw === true || bw === undefined ? "2px" : bw === false || bw === null ? "0" : `${bw}px`;

	let borderWidth = ([
		denseTop || dense ? "0" : bw2,
		denseRight || dense ? "0" : bw2,
		denseBottom || dense ? "0" : bw2,
		denseLeft || dense ? "0" : bw2,
	].join(" "));


	let body = createPrimitive(
		Pane.Root as any,
		{
			className: props.className,
			bgcolor: props.bgcolor,
			borderRadius,
			borderWidth,
			flex,
			width, minWidth, maxWidth,
			height, minHeight, maxHeight,
			children: props.children
		},
		props,
		panePropNames
	);


	return body;


}




export module Pane
{


	//---



	export type BgColor = PaneBgColor;
	export const BgColor = PaneBgColor;

	export const Col = Container.Col;
	export const Row = Container.Row;



	//---



	export const Root = styled(
		"div",
		{
			shouldForwardProp: p =>
				p !== "bgcolor" && p !== "borderRadius" && p !== "borderWidth" &&
				p !== "flex" &&
				p !== "width" && p !== "minWidth" && p !== "maxWidth" &&
				p !== "height" && p !== "minHeight" && p !== "maxHeight"
			,
		}
	)<{

		bgcolor?: Pane.BgColor;
		borderRadius: string;
		borderWidth: string;

		flex?: number | string;

		width?: number | string;
		minWidth?: number | string;
		maxWidth?: number | string;

		height?: number | string;
		minHeight?: number | string;
		maxHeight?: number | string;

	}>((props) => ({


		background: Pane.BgColor(props.theme, props.bgcolor),
		borderRadius: props.borderRadius,
		borderWidth: props.borderWidth,

		boxSizing: 'border-box',

		flex: props.flex ?? 1,

		width: props.width,
		minWidth: props.minWidth,
		maxWidth: props.maxWidth,

		height: props.height,
		minHeight: props.minHeight,
		maxHeight: props.maxHeight,

	}));



	//---


}
