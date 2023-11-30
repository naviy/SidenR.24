import { styled } from "@mui/material/styles";
import { $defaultAnimationDurationMs, createPrimitive, PrimitiveProps, UseHookProps } from "../core";
import { BgColor as PaneBgColor } from "./BgColor";
import { Block } from "./Block";
import { Container } from "./Container";
import { ContainerInfo as ContainerInfo_ } from "./ContainerInfo";






//===






export function Pane(props: Pane.Props)
{

	//__$log("Pane");
	props = UseHookProps.use(props);

	let containerInfo = ContainerInfo_.use() || {};
	//let parentInfo:ContainerInfo_ = {};

	let { start, end, } = props;

	let inRow = containerInfo.layout === "row";
	let inCol = containerInfo.layout === "col";



	let { noPP, preExpanding, gap, } = containerInfo;

	let ppl = !noPP && (!inRow || start) && (preExpanding ? containerInfo.ppl0 : containerInfo.ppl) || 0;
	let ppr = !noPP && (!inRow || end) && (preExpanding ? containerInfo.ppr0 : containerInfo.ppr) || 0;
	let ppt = !noPP && (!inCol || start) && (preExpanding ? containerInfo.ppt0 : containerInfo.ppt) || 0;
	let ppb = !noPP && (!inCol || end) && (preExpanding ? containerInfo.ppb0 : containerInfo.ppb) || 0;


	let sizes = Block.getBoxSizes(
		containerInfo.layout,
		props,
	);

	sizes = Block.sumBoxSizes(sizes, { width: ppl + ppr, height: ppt + ppb });


	let br = containerInfo.rounded;// props.borderRadius !== undefined ? props.borderRadius : cprops.rounded/*borderRadius*/;
	let br2 = br === true || br === undefined ? `${Block.bigBorderRadius}px` : br === false || br === null ? undefined : `${br}px`;

	let br0 = `${Block.smallBorderRadius}px`;

	let borderRadius = br2 && ([
		containerInfo.brtl && (inRow && start || inCol && start) ? br2 : !gap && (inRow && !start || inCol && !start) ? "0" : br0,
		containerInfo.brtr && (inRow && end || inCol && start) ? br2 : !gap && (inRow && !end || inCol && !start) ? "0" : br0,
		containerInfo.brbr && (inRow && end || inCol && end) ? br2 : !gap && (inRow && !end || inCol && !end) ? "0" : br0,
		containerInfo.brbl && (inRow && start || inCol && end) ? br2 : !gap && (inRow && !start || inCol && !end) ? "0" : br0,
	].join(" "));



	let body = props.children;


	if (typeof body === "string")
	{
		body = <span>{body}</span>;
	}


	if (containerInfo.debug)
	{
		body = <>
			<Pane.DebugBox>
				<div>
					<b>pane{props.id && ` #${props.id}`}</b>&nbsp; &nbsp;
					{props.start && " start"}{props.end && " end"}
				</div>
			</Pane.DebugBox>
			{body}
		</>;
	}


	body = createPrimitive(
		Pane.Root as any,
		{
			debug: containerInfo.debug,
			//bgcolor: props.bgcolor,
			borderRadius,
			ppl, ppr, ppt, ppb,
			...sizes,
			children: body,
		},
		props,
		Pane.propNames
	);


	body = <ContainerInfo_.Context.Provider
		value={null}
		children={body}
	/>;


	return body;

}






export module Pane
{


	//---




	export type ContainerInfo = ContainerInfo_;
	export const ContainerInfo = ContainerInfo_;

	export type BgColor = PaneBgColor;
	export const BgColor = PaneBgColor;

	export type ColProps = Container.ColProps;
	export type DivProps = Container.DivProps;
	export type RowProps = Container.RowProps;

	export const Col = Container.Col;
	export const Div = Container.Div;
	export const Row = Container.Row;


	//export const injectProps = Block.injectProps;



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

		//bgcolor?: Pane.BgColor;
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
		//"bgcolor",
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

			background: "white",
			borderRadius: props.borderRadius,
			//borderWidth: props.borderWidth,

			border: `${ppColor} solid 0px`,
			borderWidth: `${props.ppt || 0}px ${props.ppr || 0}px ${props.ppb || 0}px ${props.ppl || 0}px`,

			boxSizing: 'border-box',

			flex: props.flex,

			width: props.width,
			minWidth: props.minWidth,
			maxWidth: props.maxWidth,

			height: props.height,
			minHeight: props.minHeight,
			maxHeight: props.maxHeight,

			transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,

			userSelect: "none", 

			"> *": {
				userSelect: "text", 
			},

		};
	});




	//---




	export const DebugBox = styled("div")(() =>
	{

		let color = "rgba(100,30,30, .5)";

		return {
			position: "absolute",
			inset: "-1px",
			overflow: "hidden",
			border: `2px solid ${color}`,
			borderRadius: "inherit",

			"> div": {
				position: "absolute",
				top: 0,
				left: 0,
				fontSize: "8px",
				padding: "0px 8px 2px 6px",
				background: color,
				color: "white",
				borderBottomRightRadius: 3,

				whiteSpace: "nowrap",

			}
		};
	});




	//---


}
