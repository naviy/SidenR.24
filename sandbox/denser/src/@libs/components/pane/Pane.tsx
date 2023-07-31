import { styled } from "@mui/material";

import { $defaultAnimationDurationMs, $log, createPrimitive, PrimitiveProps, _$log } from "../core";
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
	$log("props:", props);
	_$log("cprops:", cprops);
	let { gap, } = cprops;
	let { start, end, } = props;

	let inRow = cprops.dir === "row";
	let inCol = cprops.dir === "col";


	let p2l = cprops.p2l && (inCol || start) ? cprops.p2l : 0;
	let p2r = cprops.p2r && (inCol || end) ? cprops.p2r : 0;
	let p2t = cprops.p2t && (inRow || start) ? cprops.p2t : 0;
	let p2b = cprops.p2b && (inRow || end) ? cprops.p2b : 0;

	let sizes = Block.getBoxSizes(
		cprops.dir!,
		props,
		{ width: p2l + p2r, height: p2t + p2b }
	);


	let br = props.borderRadius !== undefined ? props.borderRadius : cprops.rounded/*borderRadius*/;
	let br2 = br === true || br === undefined ? "12px" : br === false || br === null ? undefined : `${br}px`;

	let br0 = "3px";

	let borderRadius = br2 && ([
		cprops.brtl && (inRow && start || inCol && start) ? br2 : !gap && (inRow && !start || inCol && !start) ? "0" : br0,
		cprops.brtr && (inRow && end || inCol && start) ? br2 : !gap && (inRow && !end || inCol && !start) ? "0" : br0,
		cprops.brbr && (inRow && end || inCol && end) ? br2 : !gap && (inRow && !end || inCol && !end) ? "0" : br0,
		cprops.brbl && (inRow && start || inCol && end) ? br2 : !gap && (inRow && !start || inCol && !end) ? "0" : br0,
	].join(" "));


	//let bw = props.borderWidth !== undefined ? props.borderWidth : cprops.borderWidth;
	//let bw2 = bw === true || bw === undefined ? "2px" : bw === false || bw === null ? undefined : `${bw}px`;

	//let borderWidth = bw2 && ([
	//	denseTop || dense ? "0" : bw2,
	//	denseRight || dense ? "0" : bw2,
	//	denseBottom || dense ? "0" : bw2,
	//	denseLeft || dense ? "0" : bw2,
	//].join(" "));


	let body = createPrimitive(
		Pane.Root as any,
		{
			bgcolor: props.bgcolor,
			borderRadius,
			//borderWidth,
			p2l, p2r, p2t, p2b,
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

		//borderWidth: string;

		p2l: string;
		p2r: string;
		p2t: string;
		p2b: string;

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
		"borderRadius", //"borderWidth",
		"p2l", "p2r", "p2t", "p2b",
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

		borderLeft: `green solid ${props.p2l || 0}px`,
		borderRight: `green solid ${props.p2r || 0}px`,
		borderTop: `green solid ${props.p2t || 0}px`,
		borderBottom: `green solid ${props.p2b || 0}px`,

		boxSizing: 'border-box',

		flex: props.flex,

		width: props.width,
		minWidth: props.minWidth,
		maxWidth: props.maxWidth,

		height: props.height,
		minHeight: props.minHeight,
		maxHeight: props.maxHeight,

		transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,

	}));



	//---


}
