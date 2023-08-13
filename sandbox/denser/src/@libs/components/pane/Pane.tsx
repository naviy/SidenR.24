import { styled } from "@mui/material";

import { $defaultAnimationDurationMs, createPrimitive, PrimitiveProps, UseHookProps } from "../core";
import { BgColor as PaneBgColor } from "./BgColor";
import { Block } from "./Block";
import { Container } from "./Container";






//===






export function Pane(props: Pane.Props)
{

	props = UseHookProps.use(props);

	let cprops = Container.use() || {};

	let { gap, } = cprops;
	let { start, end, } = props;

	let inRow = cprops.type === "row";
	let inCol = cprops.type === "col";


	let p2l = cprops.p2l && (inCol || start) ? cprops.p2l : 0;
	let p2r = cprops.p2r && (inCol || end) ? cprops.p2r : 0;
	let p2t = cprops.p2t && (inRow || start) ? cprops.p2t : 0;
	let p2b = cprops.p2b && (inRow || end) ? cprops.p2b : 0;

	let sizes = Block.getBoxSizes(
		cprops.type,
		props,
		{ width: p2l + p2r, height: p2t + p2b }
	);


	let br = cprops.rounded;// props.borderRadius !== undefined ? props.borderRadius : cprops.rounded/*borderRadius*/;
	let br2 = br === true || br === undefined ? "12px" : br === false || br === null ? undefined : `${br}px`;

	let br0 = "3px";

	let borderRadius = br2 && ([
		cprops.brtl && (inRow && start || inCol && start) ? br2 : !gap && (inRow && !start || inCol && !start) ? "0" : br0,
		cprops.brtr && (inRow && end || inCol && start) ? br2 : !gap && (inRow && !end || inCol && !start) ? "0" : br0,
		cprops.brbr && (inRow && end || inCol && end) ? br2 : !gap && (inRow && !end || inCol && !end) ? "0" : br0,
		cprops.brbl && (inRow && start || inCol && end) ? br2 : !gap && (inRow && !start || inCol && !end) ? "0" : br0,
	].join(" "));


	let body = createPrimitive(
		Pane.Root as any,
		{
			bgcolor: props.bgcolor,
			borderRadius,
			p2l, p2r, p2t, p2b,
			...sizes
		},
		props,
		Pane.propNames
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

	export type ColProps = Container.ColProps;
	export type DivProps = Container.DivProps;
	export type RowProps = Container.RowProps;

	export const Col = Container.Col;
	export const Div = Container.Div;
	export const Row = Container.Row;



	//---



	export interface Props extends Block.Props, PrimitiveProps<HTMLDivElement>, UseHookProps<Props>
	{

	}



	export const propNames: Array<keyof Props> = [
		...Block.propNames,
		...UseHookProps.propNames,
	];



	//---



	interface RootProps
	{

		bgcolor?: Pane.BgColor;
		borderRadius: string;

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

		position: "relative",

		background: Pane.BgColor(props.theme, props.bgcolor),
		borderRadius: props.borderRadius,
		//borderWidth: props.borderWidth,

		borderLeft: `transparent solid ${props.p2l || 0}px`,
		borderRight: `transparent solid ${props.p2r || 0}px`,
		borderTop: `transparent solid ${props.p2t || 0}px`,
		borderBottom: `transparent solid ${props.p2b || 0}px`,

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
