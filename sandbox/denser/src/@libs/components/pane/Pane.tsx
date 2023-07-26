import { styled } from "@mui/material";

import { $log, createPrimitive, PrimitiveProps } from "../core";
import { BgColor as PaneBgColor } from "./BgColor";
import { Block } from "./Bock";
import { Container } from "./Container";




//===




export interface PaneProps extends Block.Props, PrimitiveProps<HTMLDivElement>
{

}


const panePropNames: Array<keyof PaneProps> = [
	...Block.propNames
];




export function Pane(props: PaneProps)
{


	let cprops = Container.use() || {};

	let { rounded, dense, denseLeft, denseRight, denseTop, denseBottom, gap, } = cprops;

	let { start, end, } = props;

	let inRow = cprops.dir === "row";
	let inCol = cprops.dir === "col";


	let ml = cprops.ml || 0;
	let mr = cprops.mr || 0;
	let mt = cprops.mt || 0;
	let mb = cprops.mb || 0;

	let padding2Left = inRow && start && ml < 0 ? -ml - (cprops.pl || 0) : 0;
	let padding2Right = inRow && end && mr < 0 ? -mr - (cprops.pr || 0) : 0;
	let padding2Top = inCol && start && mt < 0 ? -mt - (cprops.pt || 0) : 0;
	let padding2Bottom = inCol && end && mb < 0 ? -mb - (cprops.pb || 0) : 0;

	let sizes = Block.getBoxSizes(
		cprops.dir!,
		props,
		{ width: padding2Left + padding2Right, height: padding2Top + padding2Bottom }
	);


	let br = props.borderRadius !== undefined ? props.borderRadius : cprops.borderRadius;
	let br2 = br === true || br === undefined ? "12px" : br === false || br === null ? undefined : `${br}px`;

	let br0 = "3px";

	let borderRadius = br2 && ([
		rounded && start && !denseLeft && !denseTop && !dense ? br2 : !gap && (inRow && !start || inCol && !start) ? "0" : br0,
		rounded && (inRow && end || inCol && start) && !denseRight && !denseTop && !dense ? br2 : !gap && (inRow && !end || inCol && !start) ? "0" : br0,
		rounded && end && !denseRight && !denseBottom && !dense ? br2 : !gap && (inRow && !end || inCol && !end) ? "0" : br0,
		rounded && (inRow && start || inCol && end) && !denseLeft && !denseBottom && !dense ? br2 : !gap && (inRow && !start || inCol && !end) ? "0" : br0,
	].join(" "));


	let bw = props.borderWidth !== undefined ? props.borderWidth : cprops.borderWidth;
	let bw2 = bw === true || bw === undefined ? "2px" : bw === false || bw === null ? undefined : `${bw}px`;

	let borderWidth = bw2 && ([
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
			padding2Left, padding2Right, padding2Top, padding2Bottom,
			...sizes
		},
		props,
		panePropNames
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



	interface RootProps
	{

		bgcolor?: Pane.BgColor;
		borderRadius: string;

		borderWidth: string;

		padding2Left: string;
		padding2Right: string;
		padding2Top: string;
		padding2Bottom: string;

		flex?: number | string;

		width?: number | string;
		minWidth?: number | string;
		maxWidth?: number | string;

		height?: number | string;
		minHeight?: number | string;
		maxHeight?: number | string;

	}


	const rootPropNames: Array<keyof RootProps> = [
		"bgcolor",
		"borderRadius", "borderWidth",
		"padding2Left", "padding2Right", "padding2Top", "padding2Bottom",
		"flex",
		"width", "minWidth", "maxWidth",
		"height", "minHeight", "maxHeight",
	];




	export const Root = styled(
		"div",
		{
			shouldForwardProp: p =>
				rootPropNames.indexOf(p as any) < 0
			,
		}
	)<RootProps>((props) => ({


		background: Pane.BgColor(props.theme, props.bgcolor),
		borderRadius: props.borderRadius,
		//borderWidth: props.borderWidth,

		borderLeft: `transparent solid ${props.padding2Left || 0}px`,
		borderRight: `transparent solid ${props.padding2Right || 0}px`,
		borderTop: `transparent solid ${props.padding2Top || 0}px`,
		borderBottom: `transparent solid ${props.padding2Bottom || 0}px`,

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
