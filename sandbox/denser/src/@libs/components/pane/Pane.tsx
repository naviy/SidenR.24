import { styled } from "@mui/material";

import { createPrimitive } from "../core";
import { BgColor as PaneBgColor } from "./BgColor";
import { BlockProps } from "./Bock";
import { Container } from "./Container";




//===




export interface PaneProps extends BlockProps
{

	start?: boolean | undefined;
	end?: boolean | undefined;

}


const panePropNames: Array<keyof PaneProps> = [
	"start", "end",
];




export function Pane(props: PaneProps)
{


	let cprops = Container.use() || {};

	let { dense, denseLeft, denseRight, denseTop, denseBottom, } = cprops;

	let { start, end, } = props;

	let isRow = cprops.dir === "row";
	let isCol = cprops.dir === "col";


	let sizes = BlockProps.getBoxSizes(cprops.dir!, props);


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
			bgcolor: props.bgcolor,
			borderRadius,
			borderWidth,
			...sizes
		},
		props,
		panePropNames, BlockProps.propNames
	);


	body = <Container.Context.Provider
		value={null}
		children={body}
	/>;


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

		flex: props.flex,

		width: props.width,
		minWidth: props.minWidth,
		maxWidth: props.maxWidth,

		height: props.height,
		minHeight: props.minHeight,
		maxHeight: props.maxHeight,

	}));



	//---


}
