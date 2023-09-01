import { styled } from "@mui/material";

import { $defaultAnimationDurationMs, $log, _$log, createPrimitive, PrimitiveProps, UseHookProps } from "../core";
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

	let { expander } = parentInfo;

	//if (props.id)
	//{
	//	$log("Pane", props.id)
	//	_$log("parentInfo:", parentInfo.p2l, parentInfo.p2r)
	//	expander && _$log("expander:", expander.expanded, expander.collapsed, expander.childrenShouldBeRendered);
	//	_$log("p2:", p2)
	//}


	let hasP2 = !expander || !expander.expanded || !expander.collapsed;
	let p2l = hasP2 && parentInfo.p2l && (inCol || start) ? parentInfo.p2l : 0;
	let p2r = hasP2 && parentInfo.p2r && (inCol || end) ? parentInfo.p2r : 0;
	let p2t = hasP2 && parentInfo.p2t && (inRow || start) ? parentInfo.p2t : 0;
	let p2b = hasP2 && parentInfo.p2b && (inRow || end) ? parentInfo.p2b : 0;

	let sizes = Block.getBoxSizes(
		parentInfo.type,
		props,
		{ width: p2l + p2r, height: p2t + p2b }
	);


	let br = parentInfo.rounded;// props.borderRadius !== undefined ? props.borderRadius : cprops.rounded/*borderRadius*/;
	let br2 = br === true || br === undefined ? `${Block.bigBorderRadius}px` : br === false || br === null ? undefined : `${br}px`;

	let br0 = `${Block.smallBorderRadius}px`;

	let borderRadius = br2 && ([
		parentInfo.brtl && (inRow && start || inCol && start) ? br2 : !gap && (inRow && !start || inCol && !start) ? "0" : br0,
		parentInfo.brtr && (inRow && end || inCol && start) ? br2 : !gap && (inRow && !end || inCol && !start) ? "0" : br0,
		parentInfo.brbr && (inRow && end || inCol && end) ? br2 : !gap && (inRow && !end || inCol && !end) ? "0" : br0,
		parentInfo.brbl && (inRow && start || inCol && end) ? br2 : !gap && (inRow && !start || inCol && !end) ? "0" : br0,
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
				p !== "isFlex" && rootPropNames.indexOf(p as any) < 0
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
