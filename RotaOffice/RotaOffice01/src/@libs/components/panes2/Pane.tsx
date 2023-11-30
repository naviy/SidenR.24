import { styled } from "@mui/material/styles";
import { $defaultAnimationDurationMs, $log, createPrimitive, PrimitiveProps, UseHookProps } from "../core";
import { Block } from "./Block";
import * as Container from "./Container";
import { ContainerInfo, ContainerInfo as ContainerInfo_ } from "./ContainerInfo";
import { PaneBorder, PaneRadius } from "./ContainerProps";






//===






export function Pane2(props: Pane2.Props & PrimitiveProps<HTMLDivElement>)
{

	//__$log("Pane");
	props = UseHookProps.use(props);

	let containerInfo = ContainerInfo_.use();


	let v = ContainerInfo.init(
		props,
		containerInfo,
		{}
	);


	let sizes = Block.getBoxSizes(
		containerInfo?.layout || "col",
		props,
	);



	let body = props.children;


	if (typeof body === "string")
	{
		body = <span>{body}</span>;
	}


	if (containerInfo?.debug)
	{
		body = <>
			<Pane2.DebugBox>
				<div>
					<b>pane{props.id && ` #${props.id}`}</b>&nbsp; &nbsp;
					{props.start && " start"}{props.end && " end"}
				</div>
			</Pane2.DebugBox>
			{body}
		</>;
	}


	body = createPrimitive(
		Pane2.Root as any,
		{
			debug: containerInfo?.debug,
			//bgcolor: props.bgcolor,
			r: PaneRadius.toCss(v.rtl, v.rtr, v.rbr, v.rbl),
			bt: PaneBorder.toCss(v.bt),
			br: PaneBorder.toCss(v.br),
			bb: PaneBorder.toCss(v.bb),
			bl: PaneBorder.toCss(v.bl),
			...sizes,
			children: body,
		} as Pane2.RootProps,
		props,
		Pane2.propNames
	);


	body = <ContainerInfo_.Context.Provider
		value={null}
		children={body}
	/>;


	return body;

}






export module Pane2
{


	//---




	export type ContainerInfo = ContainerInfo_;
	export const ContainerInfo = ContainerInfo_;

	export type ColProps = Container.ColProps;
	export type DivProps = Container.DivProps;
	export type RowProps = Container.RowProps;

	export const Provider = Container.Provider;
	export const Col = Container.Col;
	export const Div = Container.Div;
	export const Row = Container.Row;




	//---




	export interface Props extends Block.Props, UseHookProps<Props>
	{
		id?: string;
	}



	export const propNames_: Record<keyof Props, true> =
	{
		id: true,
		...Block.propNames_,
		...UseHookProps.propNames_,
	};


	export const propNames = Object.keys(propNames_) as Array<keyof Props>;




	//---




	export interface RootProps
	{
		debug?: boolean;

		r: string;
		bt: string | undefined;
		br: string | undefined;
		bb: string | undefined;
		bl: string | undefined;

		flex?: number | string;

		width?: number | string;
		minWidth?: number | string;
		maxWidth?: number | string;

		height?: number | string;
		minHeight?: number | string;
		maxHeight?: number | string;

	}


	const rootPropNames: Record<keyof RootProps, true> =
	{
		debug: true,
		r: true,
		bt: true,
		br: true,
		bb: true,
		bl: true,
		flex: true,
		width: true,
		minWidth: true,
		maxWidth: true,
		height: true,
		minHeight: true,
		maxHeight: true,
	};




	export const Root = styled(
		"div",
		{
			shouldForwardProp: p =>
				p !== "isFlex" && !(rootPropNames as any)[p]
			,
		}
	)<RootProps>((props) =>
	{

		//let ppColor = props.debug ? `rgb(231,171,171)` : "transparent";

		const defaultBorder = "0 solid transparent" as const;


		return {

			display: "flex",
			position: "relative",

			background: props.theme.palette.background.paper,
			//background: Pane.BgColor(props.theme, props.bgcolor),
			borderRadius: props.r,
			//borderWidth: props.borderWidth,

			borderTop: props.bt || defaultBorder,
			borderRight: props.br || defaultBorder,
			borderBottom: props.bb || defaultBorder,
			borderLeft: props.bl || defaultBorder,

			//border: `${ppColor} solid 0px`,
			//borderWidth: `${props.ppt || 0}px ${props.ppr || 0}px ${props.ppb || 0}px ${props.ppl || 0}px`,

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
