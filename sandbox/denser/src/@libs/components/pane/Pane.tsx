import { Box, styled } from "@mui/material";

import { $defaultAnimationDurationMs, createPrimitive, PrimitiveProps, UseHookProps } from "../core";
import { BgColor as PaneBgColor } from "./BgColor";
import { Block } from "./Block";
import { Container } from "./Container";
import { ContainerInfo } from "./ContainerInfo";






//===






export function Pane(props: Pane.Props)
{

	props = UseHookProps.use(props);

	let parentInfo = ContainerInfo.use() || {};

	let { gap, } = parentInfo;
	let { start, end, } = props;

	let inRow = parentInfo.type === "row";
	let inCol = parentInfo.type === "col";



	let { noPP, preExpanding } = parentInfo;

	let ppl = !noPP && (inCol || start) && (preExpanding ? parentInfo.ppl0 : parentInfo.ppl) || 0;
	let ppr = !noPP && (inCol || end) && (preExpanding ? parentInfo.ppr0 : parentInfo.ppr) || 0;
	let ppt = !noPP && (inRow || start) && (preExpanding ? parentInfo.ppt0 : parentInfo.ppt) || 0;
	let ppb = !noPP && (inRow || end) && (preExpanding ? parentInfo.ppb0 : parentInfo.ppb) || 0;


	//if (props.id)
	//{
	//	$log("Pane", props.id)
	//	_$log("parentInfo:", parentInfo.preExpanding, parentInfo.ppl, parentInfo.ppl0)
	//	_$log("ppl", ppl)
	//}

	let sizes = Block.getBoxSizes(
		parentInfo.type,
		props,
	);

	sizes = Block.sumBoxSizes(sizes, { width: ppl + ppr, height: ppt + ppb });


	let br = parentInfo.rounded;// props.borderRadius !== undefined ? props.borderRadius : cprops.rounded/*borderRadius*/;
	let br2 = br === true || br === undefined ? `${Block.bigBorderRadius}px` : br === false || br === null ? undefined : `${br}px`;

	let br0 = `${Block.smallBorderRadius}px`;

	let borderRadius = br2 && ([
		parentInfo.brtl && (inRow && start || inCol && start) ? br2 : !gap && (inRow && !start || inCol && !start) ? "0" : br0,
		parentInfo.brtr && (inRow && end || inCol && start) ? br2 : !gap && (inRow && !end || inCol && !start) ? "0" : br0,
		parentInfo.brbr && (inRow && end || inCol && end) ? br2 : !gap && (inRow && !end || inCol && !end) ? "0" : br0,
		parentInfo.brbl && (inRow && start || inCol && end) ? br2 : !gap && (inRow && !start || inCol && !end) ? "0" : br0,
	].join(" "));



	let body = props.children;

	if (parentInfo.debug)
	{
		body = <>
			<Box sx={{ position: "absolute", inset: "0 0 0 0", border: `2px solid rgba(100,30,30, .5)`, borderRadius: "inherit" }} />
			{body}
		</>;
	}


	body = createPrimitive(
		Pane.Root as any,
		{
			debug: parentInfo.debug,
			bgcolor: props.bgcolor,
			borderRadius,
			ppl, ppr, ppt, ppb,
			...sizes,
			children: body,
		},
		props,
		Pane.propNames
	);


	body = <ContainerInfo.Context.Provider
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
		id?: string;
	}



	export const propNames: Array<keyof Props> = [
		...Block.propNames,
		...UseHookProps.propNames,
	];



	//---



	interface RootProps
	{
		debug?: boolean;

		bgcolor?: Pane.BgColor;
		borderRadius: string;

		ppl: string;
		ppr: string;
		ppt: string;
		ppb: string;

		flex?: number | string;

		width?: number | string;
		minWidth?: number | string;
		maxWidth?: number | string;

		height?: number | string;
		minHeight?: number | string;
		maxHeight?: number | string;

	}


	const rootPropNames: Array<keyof RootProps> = [
		"debug",
		"bgcolor",
		"borderRadius", //"borderWidth",
		"ppl", "ppr", "ppt", "ppb",
		"flex",
		"width", "minWidth", "maxWidth",
		"height", "minHeight", "maxHeight",
	];




	export const Root = styled(
		"div",
		{
			shouldForwardProp: p =>
				p !== "isFlex" && rootPropNames.indexOf(p as any) < 0
			,
		}
	)<RootProps>((props) =>
	{

		let ppColor = props.debug ? `rgb(231,171,171)` : "transparent";

		return {

			display: "flex",
			position: "relative",

			background: Pane.BgColor(props.theme, props.bgcolor),
			borderRadius: props.borderRadius,
			//borderWidth: props.borderWidth,

			borderLeft: `${ppColor} solid ${props.ppl || 0}px`,
			borderRight: `${ppColor} solid ${props.ppr || 0}px`,
			borderTop: `${ppColor} solid ${props.ppt || 0}px`,
			borderBottom: `${ppColor} solid ${props.ppb || 0}px`,

			boxSizing: 'border-box',

			flex: props.flex,

			width: props.width,
			minWidth: props.minWidth,
			maxWidth: props.maxWidth,

			height: props.height,
			minHeight: props.minHeight,
			maxHeight: props.maxHeight,

			transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,

			//"> div": {
			//	display: "inherit",
			//	flexDirection: "inherit",
			//	justifyContent: "inherit",
			//	alignItems: "inherit",
			//	gap: "inherit",
			//	flex: 1,
			//	////padding: `${props.ppt || 0}px ${props.ppr || 0}px ${props.ppb || 0}px ${props.ppl || 0}px`,
			//	//borderLeft: `blue solid ${props.ppl || 0}px`,
			//	//borderRight: `blue solid ${props.ppr || 0}px`,
			//	//borderTop: `blue solid ${props.ppt || 0}px`,
			//	//borderBottom: `blue solid ${props.ppb || 0}px`,

			//	transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,
			//}

		};
	});



	//---

}
